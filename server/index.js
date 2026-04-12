require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const Groq = require('./lib/groq');
const Hindsight = require('./lib/hindsight');

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_DEMO_CUSTOMER_ID = 'meridian-corp';

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

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

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
