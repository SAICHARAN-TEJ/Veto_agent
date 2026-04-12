try {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
} catch (error) {
  console.warn('[Config] dotenv not found; continuing with environment variables only');
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('./lib/groq');
const Hindsight = require('./lib/hindsight');

let HindsightClient = null;
try {
  ({ HindsightClient } = require('@vectorize-io/hindsight-client'));
} catch (error) {
  console.warn('[Suggest] Hindsight SDK not available for /api/suggest route');
}

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_DEMO_CUSTOMER_ID = 'meridian-corp';
const outboundMessageStore = new Map();

const FALLBACK_SOLUTIONS = [
  {
    solution: 'Force SSO token refresh via Admin → Users → Force SSO token refresh',
    keywords: ['okta', 'sso', 'login', 'loop'],
    successRate: 0.94,
  },
  {
    solution: 'Clear application-level cache via Settings → Advanced → Clear App Cache',
    keywords: ['cache', 'loading', 'stuck', 'slow'],
    successRate: 0.87,
  },
  {
    solution: 'Revoke and reissue OAuth tokens via Admin Console → Security → Active Sessions',
    keywords: ['oauth', 'token', 'authentication', 'expired'],
    successRate: 0.91,
  },
  {
    solution: 'Disable browser extensions one by one — LastPass/1Password conflict with SSO',
    keywords: ['extension', 'plugin', 'chrome', 'conflict'],
    successRate: 0.78,
  },
  {
    solution: 'Switch to Firefox temporarily to isolate browser-specific rendering bug',
    keywords: ['chrome', 'browser', 'display', 'render'],
    successRate: 0.72,
  },
  {
    solution: 'Reduce bulk import concurrency and increase retry backoff (exponential) to avoid API rate-limit spikes',
    keywords: ['api', 'rate', 'limit', 'bulk', 'import'],
    successRate: 0.9,
  },
  {
    solution: 'Capture HAR + server logs for 429 bursts, then tune per-tenant throttle settings',
    keywords: ['api', '429', 'throttle', 'rate', 'retry'],
    successRate: 0.82,
  },
  {
    solution: 'Rebuild frontend assets and purge CDN/browser cache after release to fix blank dashboard',
    keywords: ['dashboard', 'blank', 'render', 'update', 'bundle'],
    successRate: 0.86,
  },
  {
    solution: 'Disable Firefox hardware acceleration temporarily to isolate Ubuntu rendering issues',
    keywords: ['firefox', 'ubuntu', 'dashboard', 'blank', 'render'],
    successRate: 0.79,
  },
  {
    solution: 'Reset MFA enrollment via Admin → Users → [user] → Reset MFA',
    keywords: ['mfa', '2fa', 'authenticator', 'two-factor'],
    successRate: 0.89,
  },
  {
    solution: 'Disconnect VPN and retry — VPN commonly interferes with SSO redirects',
    keywords: ['vpn', 'network', 'timeout', 'access'],
    successRate: 0.83,
  },
  {
    solution: 'Re-provision user: Admin → Users → Deprovision → Re-provision (takes ~2 min)',
    keywords: ['provision', 'account', 'permission', 'denied'],
    successRate: 0.88,
  },
  {
    solution: 'Update Chrome to latest version — Chrome 122+ fixes known Okta cookie bug',
    keywords: ['okta', 'cookie', 'chrome', 'version'],
    successRate: 0.76,
  },
  {
    solution: 'Flush DNS cache: Windows → ipconfig /flushdns | Mac → sudo dscacheutil -flushcache',
    keywords: ['dns', 'network', 'domain', 'resolve'],
    successRate: 0.69,
  },
];

const FALLBACK_KEYWORD_GROUPS = {
  auth: ['sso', 'okta', 'login', 'oauth', 'authentication', 'token', 'mfa', '2fa', 'authenticator', 'two-factor'],
  browser: ['browser', 'chrome', 'firefox', 'safari', 'edge', 'extension', 'plugin', 'cookie', 'render', 'display'],
  network: ['vpn', 'network', 'timeout', 'dns', 'domain', 'resolve', 'access'],
  account: ['provision', 'deprovision', 'account', 'permission', 'denied'],
  performance: ['cache', 'loading', 'stuck', 'slow'],
};

let suggestHindsightClient = null;
if (process.env.HINDSIGHT_API_KEY && HindsightClient) {
  try {
    suggestHindsightClient = new HindsightClient({
      apiKey: process.env.HINDSIGHT_API_KEY,
      baseUrl: process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io',
    });
  } catch (error) {
    console.warn('[Suggest] Failed to initialize Hindsight client:', error.message);
  }
}

const RECOMMENDED_FIXES = {
  'clear browser cache': 'SSO token refresh via admin panel — navigate to Admin → Users → [Company] → Force SSO token refresh',
  'clear cookies': 'SSO token refresh via admin panel — navigate to Admin → Users → [Company] → Force SSO token refresh',
  'disable browser extensions': 'Verify Okta integration settings — check SAML assertion expiry in SSO provider dashboard',
  'reset password': 'Check SSO provider user sync status — password resets can fail in federated environments',
  'try incognito mode': 'Clear identity-provider session tokens, then retry from a fresh browser session',
  'logout and login again': 'Force SSO token expiration and re-issue via Admin → Identity → Refresh tokens',
  'general troubleshooting': 'Collect environment details and escalate with full session logs and timestamps',
};

function normalizeString(value) {
  return String(value || '').toLowerCase().trim();
}

function pickRecommendedFix(solution, customerId) {
  const normalized = normalizeString(solution);
  const match = Object.entries(RECOMMENDED_FIXES).find(([pattern]) =>
    normalized.includes(pattern) || pattern.includes(normalized.slice(0, 8))
  );
  const template = match ? match[1] : RECOMMENDED_FIXES['general troubleshooting'];
  return template.replace('[Company]', customerId);
}

function parseFailedSolutions(input) {
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object' && item.solution) return String(item.solution).trim();
        return '';
      })
      .filter(Boolean);
  }
  if (typeof input === 'string' && input.trim()) {
    return [input.trim()];
  }
  return [];
}

function normalizeMode(value) {
  return String(value || '').toLowerCase().trim() === 'demo' ? 'demo' : 'live';
}

function toScopedCustomerId(mode, customerId) {
  const normalizedId = String(customerId || '').toLowerCase().trim();
  if (!normalizedId) return '';
  if (normalizedId.startsWith('demo-') || normalizedId.startsWith('live-')) {
    const baseId = normalizedId.replace(/^(demo|live)-/, '');
    return `${mode}-${baseId}`;
  }
  return `${mode}-${normalizedId}`;
}

function resolveRequestContext(body = {}) {
  const mode = normalizeMode(body.mode);
  const rawCustomerId = body.customer_id || body.customerId || (mode === 'demo' ? DEFAULT_DEMO_CUSTOMER_ID : '');
  const customerId = String(rawCustomerId || '').toLowerCase().trim();
  const scopedCustomerId = toScopedCustomerId(mode, customerId);
  return { mode, customerId, scopedCustomerId };
}

function buildSuggestionQuery(draft, environment = {}) {
  return [draft, environment.os, environment.browser, environment.sso]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .join(' ');
}

function rankFallbackSuggestions(query) {
  const normalizedQuery = normalizeString(query);
  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
  const hasAnyKeyword = Object.values(FALLBACK_KEYWORD_GROUPS)
    .flat()
    .some((keyword) => normalizedQuery.includes(keyword));

  const expandedQueryTerms = hasAnyKeyword
    ? queryTerms
    : [
        ...queryTerms,
        ...FALLBACK_KEYWORD_GROUPS.auth.slice(0, 5),
        ...FALLBACK_KEYWORD_GROUPS.browser.slice(0, 4),
        ...FALLBACK_KEYWORD_GROUPS.network.slice(0, 3),
      ];

  return FALLBACK_SOLUTIONS
    .map((item) => {
      const keywordMatches = item.keywords.reduce((count, keyword) => {
        const normalizedKeyword = normalizeString(keyword);
        return expandedQueryTerms.some((term) => term.includes(normalizedKeyword) || normalizedKeyword.includes(term))
          ? count + 1
          : count;
      }, 0);

      const textScore = expandedQueryTerms.reduce((count, term) => {
        if (term.length < 3) return count;
        return item.solution.toLowerCase().includes(term) ? count + 1 : count;
      }, 0);

      return {
        ...item,
        keywordMatches,
        textScore,
      };
    })
    .sort((a, b) => {
      if (b.keywordMatches !== a.keywordMatches) {
        return b.keywordMatches - a.keywordMatches;
      }
      if (b.textScore !== a.textScore) {
        return b.textScore - a.textScore;
      }
      return b.successRate - a.successRate;
    })
    .slice(0, 3)
    .map(({ solution, successRate }) => ({
      solution,
      successRate,
      source: 'fallback',
    }));
}

function toRecallEntries(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.memories)) {
    return payload.memories;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}

function normalizeSuccessRate(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0.7;
  }
  if (numeric > 1) {
    return Math.min(1, Math.max(0, numeric / 100));
  }
  return Math.min(1, Math.max(0, numeric));
}

async function recallSuggestionMemories(bankId, query) {
  if (!suggestHindsightClient) {
    return null;
  }

  const attempts = [
    () => suggestHindsightClient.recall({ bankId, query, maxResults: 5 }),
    () => suggestHindsightClient.recall(bankId, query, { limit: 5 }),
  ];

  const withTimeout = (promiseFactory, timeoutMs = 1200) => {
    return Promise.race([
      promiseFactory(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Hindsight suggest recall timeout')), timeoutMs);
      }),
    ]);
  };

  let lastError = null;
  for (const attempt of attempts) {
    try {
      const result = await withTimeout(attempt);
      const entries = toRecallEntries(result);
      if (entries.length > 0) {
        return result;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

function mapHindsightSuggestions(recallPayload) {
  return toRecallEntries(recallPayload)
    .map((entry) => {
      const metadata = entry && typeof entry.metadata === 'object' ? entry.metadata : {};
      const outcome = normalizeString(metadata.outcome);
      const solution = String(metadata.solution || entry.solution || entry.content || entry.text || '').trim();
      const successRate = normalizeSuccessRate(
        metadata.successRate ?? metadata.success_rate ?? metadata.confidence ?? entry.successRate ?? entry.score
      );

      return {
        outcome,
        solution,
        successRate,
      };
    })
    .filter((item) => item.outcome === 'success' && item.solution)
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 3)
    .map(({ solution, successRate }) => ({
      solution,
      successRate,
      source: 'hindsight',
    }));
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const d = Date.now() - start;
    console.log(`${req.method} ${req.path} — ${res.statusCode} (${d}ms)`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      hindsight: !!process.env.HINDSIGHT_API_KEY ? 'configured' : 'mock',
      groq: !!process.env.GROQ_API_KEY ? 'configured' : 'mock',
    },
  });
});

// Routes

// POST /api/analyze - Extract solutions from agent draft
app.post('/api/analyze', async (req, res) => {
  try {
    const { mode, customerId, scopedCustomerId } = resolveRequestContext(req.body);
    const draftResponse = req.body.draft_response || req.body.draft;

    Hindsight.ensureScopedData(scopedCustomerId);

    if (!customerId || !draftResponse) {
      return res.status(400).json({
        error: 'customerId/customer_id and draft/draft_response are required',
      });
    }

    const extracted = await Groq.extractSolutions(draftResponse);
    const solutions = [
      ...new Set(
        extracted
          .map((item) => {
            if (typeof item === 'string') return item.trim();
            if (item && typeof item === 'object' && item.solution) {
              return String(item.solution).trim();
            }
            return '';
          })
          .filter(Boolean)
      ),
    ];

    const conflictMap = new Map();
    let topConflictSolution = null;
    let topConflictCount = 0;
    let topMatches = [];

    for (const solution of solutions) {
      const matches = await Hindsight.queryFailures(scopedCustomerId, solution);
      if (!Array.isArray(matches) || matches.length === 0) {
        continue;
      }

      const normalizedMatches = matches.map((entry) => ({
        ...entry,
        solution: entry.solution || solution,
        outcome: entry.outcome || 'failed',
      }));

      for (const entry of normalizedMatches) {
        const dedupeKey = entry.key || [entry.solution, entry.agentId, entry.timestamp, entry.environment].join('|');
        if (!conflictMap.has(dedupeKey)) {
          conflictMap.set(dedupeKey, entry);
        }
      }

      const failCount = normalizedMatches.reduce((sum, entry) => {
        const count = Number(entry.count);
        return sum + (Number.isFinite(count) && count > 0 ? count : 1);
      }, 0);

      if (failCount > topConflictCount) {
        topConflictCount = failCount;
        topConflictSolution = solution;
        topMatches = normalizedMatches
          .slice()
          .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      }
    }

    const memoryConflicts = Array.from(conflictMap.values());
    const hasConflict = memoryConflicts.length > 0;
    const lastMatch = topMatches[0];
    const recommended = hasConflict
      ? pickRecommendedFix(topConflictSolution, customerId)
      : null;
    const confidence = hasConflict
      ? Math.min(0.99, 0.6 + topConflictCount * 0.12)
      : 0;

    res.json({
      success: true,
      mode,
      customer_id: customerId,
      customer_scope: scopedCustomerId,
      extracted_solutions: solutions,
      memory_conflicts: memoryConflicts,
      blocking_alert: hasConflict,

      // Compatibility fields used by existing UI overlay
      conflict: hasConflict,
      proposed: topConflictSolution,
      failCount: topConflictCount,
      lastAttempt: lastMatch?.timestamp ? String(lastMatch.timestamp).slice(0, 10) : null,
      lastAgent: lastMatch?.agentId || null,
      recommended,
      confidence,
      matches: topMatches.slice(0, 5),
    });
  } catch (err) {
    console.error('Error in /api/analyze:', err);
    res.status(500).json({ error: 'Failed to analyze draft' });
  }
});

// POST /api/suggest - Auto-suggest likely successful fixes while drafting
app.post('/api/suggest', async (req, res) => {
  const draft = String(req.body?.draft || '').trim();
  const environment = req.body?.environment && typeof req.body.environment === 'object'
    ? req.body.environment
    : {};

  if (draft.length < 8) {
    return res.json({
      success: true,
      suggestions: [],
    });
  }

  const query = buildSuggestionQuery(draft, environment);

  try {
    const { mode, customerId } = resolveRequestContext(req.body);
    let suggestions = [];

    if (process.env.HINDSIGHT_API_KEY && customerId) {
      try {
        const bankId = `${mode}-${customerId}`;
        const recallResult = await recallSuggestionMemories(bankId, query);
        suggestions = mapHindsightSuggestions(recallResult);
      } catch (error) {
        console.warn('[Suggest] Hindsight recall failed, using fallback:', error.message);
      }
    }

    if (suggestions.length === 0) {
      suggestions = rankFallbackSuggestions(query);
    }

    return res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('Error in /api/suggest:', error);
    return res.json({
      success: true,
      suggestions: rankFallbackSuggestions(query),
    });
  }
});

// POST /api/resolve - Get alternative solutions
app.post('/api/resolve', async (req, res) => {
  try {
    const { mode, customerId, scopedCustomerId } = resolveRequestContext(req.body);
    const environment = req.body.environment || {};
    const ticketContext = req.body.ticket_context || req.body.ticketContext || '';
    const failedSolutions = parseFailedSolutions(req.body.failed_solutions || req.body.failedSolutions);

    Hindsight.ensureScopedData(scopedCustomerId);

    if (!customerId || failedSolutions.length === 0) {
      return res.status(400).json({
        error: 'customerId/customer_id and failedSolutions/failed_solutions array are required',
      });
    }

    const alternatives = await Groq.generateAlternatives(failedSolutions, ticketContext);
    const ranked = await Hindsight.rankAlternatives(alternatives, environment);

    let customerMemoryScore = 0;
    for (const failedSolution of failedSolutions) {
      const matches = await Hindsight.queryFailures(scopedCustomerId, failedSolution);
      customerMemoryScore += matches.reduce((sum, entry) => {
        const count = Number(entry.count);
        return sum + (Number.isFinite(count) && count > 0 ? count : 1);
      }, 0);
    }

    res.json({
      success: true,
      mode,
      customer_id: customerId,
      customer_scope: scopedCustomerId,
      alternatives: ranked,
      customer_memory_score: customerMemoryScore,
      recommended_followup: ranked[0]
        ? `Try "${ranked[0].solution}" first, then record the outcome to improve future rankings.`
        : 'No ranked alternatives available yet. Gather more context and record outcomes.',
    });
  } catch (err) {
    console.error('Error in /api/resolve:', err);
    res.status(500).json({ error: 'Failed to resolve alternatives' });
  }
});

// POST /api/send - Mock outbound send with in-memory persistence
app.post('/api/send', async (req, res) => {
  try {
    const { mode, customerId, scopedCustomerId } = resolveRequestContext(req.body);
    const ticketId = String(req.body?.ticketId || '').trim();
    const message = String(req.body?.message || '').trim();

    if (!ticketId || !customerId || !message) {
      return res.status(400).json({
        error: 'ticketId, customerId/customer_id, and message are required',
      });
    }

    const persistedEntry = {
      ticketId,
      customerId,
      customerScope: scopedCustomerId,
      mode,
      message,
      sentBy: 'agent',
      sentAt: new Date().toISOString(),
    };

    const existing = outboundMessageStore.get(ticketId) || [];
    outboundMessageStore.set(ticketId, [...existing, persistedEntry]);

    return res.json({
      success: true,
      ticketId,
      sentAt: persistedEntry.sentAt,
      messageCount: outboundMessageStore.get(ticketId).length,
      provider: 'mock-outbound',
    });
  } catch (err) {
    console.error('Error in /api/send:', err);
    return res.status(500).json({ error: 'Failed to send outbound response' });
  }
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  return res.sendFile(path.join(distPath, 'index.html'));
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('\n🧠 VETO backend running on http://localhost:' + PORT);
  console.log('📡 Health: http://localhost:' + PORT + '/health');

  const hindsightKey = process.env.HINDSIGHT_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const hindsightUrl = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';

  console.log('');
  console.log('🔑 Hindsight API:', hindsightKey ? `✓ configured (${hindsightKey.slice(0, 8)}...)` : '✗ missing (using mock)');
  console.log('🌐 Hindsight URL:', hindsightUrl);
  console.log('🔑 Groq API:', groqKey ? `✓ configured (${groqKey.slice(0, 8)}...)` : '✗ missing (using mock)');
  console.log('');
});
