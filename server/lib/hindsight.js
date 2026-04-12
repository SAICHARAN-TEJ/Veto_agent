/**
 * Hindsight — Cloud API integration (api.hindsight.vectorize.io)
 *
 * Uses the real Hindsight cloud API with hsk_ API key authentication.
 * Correct endpoint paths:
 *   POST /v1/default/banks/{bank_id}/memories/retain
 *   POST /v1/default/banks/{bank_id}/memories/recall
 *   POST /v1/default/banks/{bank_id}/reflect
 *
 * Falls back to in-memory store if Hindsight API is unreachable.
 */

const axios = require('axios');

// ── Configuration ──────────────────────────────────────────────
const HINDSIGHT_API_KEY = process.env.HINDSIGHT_API_KEY || '';
const HINDSIGHT_BASE_URL = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';
const HINDSIGHT_BANK_ID = process.env.HINDSIGHT_BANK_ID || 'veto-customer-support';

const isConfigured = !!HINDSIGHT_API_KEY;

// HTTP client for Hindsight REST API
const hindsightHttp = axios.create({
  baseURL: HINDSIGHT_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HINDSIGHT_API_KEY}`,
  },
});

if (isConfigured) {
  console.log('[Hindsight] Cloud API configured →', HINDSIGHT_BASE_URL);
  console.log('[Hindsight] API Key:', HINDSIGHT_API_KEY.slice(0, 8) + '...' + HINDSIGHT_API_KEY.slice(-6));
  console.log('[Hindsight] Bank ID:', HINDSIGHT_BANK_ID);
} else {
  console.warn('[Hindsight] No API key configured — using in-memory fallback only');
}

// ── In-memory fallback store ──────────────────────────────────
const memoryStore = new Map();

// ── SDK client (optional) ─────────────────────────────────────
let sdkClient = null;
try {
  const { HindsightClient } = require('@vectorize-io/hindsight-client');
  sdkClient = new HindsightClient({
    apiKey: HINDSIGHT_API_KEY,
    baseUrl: HINDSIGHT_BASE_URL,
  });
  console.log('[Hindsight] SDK client initialized');
} catch (e) {
  console.log('[Hindsight] SDK not available, using REST API directly');
}

// ── Helper: flatten metadata to string-only values (Hindsight requirement) ──
function flattenMetadata(obj) {
  const flat = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    flat[k] = Array.isArray(v) ? v.join(',') : String(v);
  }
  return flat;
}

// ══════════════════════════════════════════════════════════════
// RETAIN: Store a memory entry
// ══════════════════════════════════════════════════════════════
async function storeMemory({ key, value, tags = [] }) {
  const bankId = tags.includes('meridian-corp') ? 'meridian-corp' : HINDSIGHT_BANK_ID;
  const contentText = typeof value === 'string' ? value : JSON.stringify(value);
  const metadata = flattenMetadata({ key, ...value, tags });

  // 1. Try SDK client
  if (sdkClient && isConfigured) {
    try {
      await sdkClient.retain(bankId, contentText, {
        timestamp: new Date(),
        metadata,
      });
      console.log(`[Hindsight] ✓ Memory RETAINED (SDK) → ${bankId}: ${key}`);
    } catch (err) {
      console.warn(`[Hindsight] SDK retain: ${err.message}`);
      // Try REST fallback
      await retainViaREST(bankId, key, contentText, metadata);
    }
  }
  // 2. Try REST API if no SDK
  else if (isConfigured) {
    await retainViaREST(bankId, key, contentText, metadata);
  }

  // 3. Always update in-memory fallback for instant UI responsiveness
  const existing = memoryStore.get(key);
  if (existing) {
    memoryStore.set(key, {
      ...existing,
      ...value,
      count: (existing.count || 1) + 1,
      updatedAt: new Date().toISOString(),
    });
  } else {
    memoryStore.set(key, {
      ...value,
      tags,
      count: 1,
      createdAt: new Date().toISOString(),
    });
  }

  return { success: true, key };
}

async function retainViaREST(bankId, key, contentText, metadata) {
  try {
    await hindsightHttp.post(`/v1/default/banks/${bankId}/memories/retain`, {
      items: [{
        content: contentText,
        metadata,
      }],
    });
    console.log(`[Hindsight] ✓ Memory RETAINED (REST) → ${bankId}: ${key}`);
  } catch (err) {
    const status = err.response?.status || 'N/A';
    const detail = err.response?.data?.detail || err.message;
    console.warn(`[Hindsight] REST retain [${status}]: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
  }
}

// ══════════════════════════════════════════════════════════════
// RECALL: Query memories by customerId and solution string
// ══════════════════════════════════════════════════════════════
async function queryFailures(customerId, proposedSolution) {
  const queryStr = `Did we try the solution "${proposedSolution}" before for customer ${customerId}, and did it fail?`;

  // 1. Try SDK client
  if (sdkClient && isConfigured) {
    try {
      const results = await sdkClient.recall(customerId, queryStr, { limit: 5 });
      if (results && results.length > 0) {
        console.log(`[Hindsight] ✓ Memory RECALLED (SDK) → ${results.length} results for ${customerId}`);
        const failed = results
          .map(r => r.metadata)
          .filter(m => m && m.outcome === 'failed');
        if (failed.length > 0) return failed;
      }
    } catch (err) {
      console.warn(`[Hindsight] SDK recall: ${err.message}`);
    }
  }

  // 2. Try REST API
  if (isConfigured) {
    try {
      const { data } = await hindsightHttp.post(`/v1/default/banks/${customerId}/memories/recall`, {
        query: queryStr,
        limit: 5,
      });
      if (data && data.memories && data.memories.length > 0) {
        console.log(`[Hindsight] ✓ Memory RECALLED (REST) → ${data.memories.length} results for ${customerId}`);
        const failed = data.memories
          .map(r => r.metadata)
          .filter(m => m && m.outcome === 'failed');
        if (failed.length > 0) return failed;
      }
    } catch (err) {
      const status = err.response?.status || 'N/A';
      console.warn(`[Hindsight] REST recall [${status}]: ${err.message}`);
    }
  }

  // 3. In-memory fallback
  const normalized = proposedSolution.toLowerCase().trim();
  const matches = [];

  for (const [key, val] of memoryStore.entries()) {
    if (
      key.startsWith(`failure:${customerId}`) &&
      val.solution &&
      val.solution.toLowerCase().includes(normalized.slice(0, 12))
    ) {
      matches.push({ ...val, key });
    }
  }

  return matches;
}

// ══════════════════════════════════════════════════════════════
// REFLECT: Get full memory profile and synthesis for a customer
// ══════════════════════════════════════════════════════════════
async function getMemoryProfile(customerId) {
  let reflectionSynopsis = null;

  // 1. Try SDK client
  if (sdkClient && isConfigured) {
    try {
      const reflection = await sdkClient.reflect(
        customerId,
        "Summarize this customer's past technical issues and current frustration state strictly based on memory."
      );
      if (reflection && reflection.text) {
        console.log(`[Hindsight] ✓ Synthesized REFLECTION (SDK) for ${customerId}`);
        reflectionSynopsis = reflection.text;
      }
    } catch (err) {
      console.warn(`[Hindsight] SDK reflect: ${err.message}`);
    }
  }

  // 2. Try REST API
  if (!reflectionSynopsis && isConfigured) {
    try {
      const { data } = await hindsightHttp.post(`/v1/default/banks/${customerId}/reflect`, {
        query: "Summarize this customer's past technical issues and current frustration state strictly based on memory.",
      });
      if (data && data.text) {
        console.log(`[Hindsight] ✓ Synthesized REFLECTION (REST) for ${customerId}`);
        reflectionSynopsis = data.text;
      }
    } catch (err) {
      const status = err.response?.status || 'N/A';
      console.warn(`[Hindsight] REST reflect [${status}]: ${err.message}`);
    }
  }

  // 3. Build profile from in-memory store
  const failed = [];
  const resolved = [];

  for (const [key, val] of memoryStore.entries()) {
    if (!key.includes(customerId)) continue;
    if (val.outcome === 'failed') failed.push(val);
    else if (val.outcome === 'resolved') resolved.push(val);
  }

  return {
    customerId,
    failedSolutions: failed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    resolvedSolutions: resolved,
    totalInteractions: failed.length + resolved.length,
    frustrationScore: Math.min(100, failed.length * 20 + (failed.length > 2 ? 30 : 0)),
    reflectionSynopsis,
  };
}

// ── Seed demo data for Meridian Corp ──────────────────────────
function seedDemoData() {
  const demoFailures = [
    { solution: 'clear browser cache', env: 'Chrome 122/Win11/Okta', agentId: 'J. Park', timestamp: '2026-03-14T09:10:00Z' },
    { solution: 'clear browser cache', env: 'Chrome 122/Win11/Okta', agentId: 'A. Chen', timestamp: '2026-03-21T14:22:00Z' },
    { solution: 'clear browser cache', env: 'Chrome 122/Win11/Okta', agentId: 'L. Torres', timestamp: '2026-04-01T11:05:00Z' },
    { solution: 'disable browser extensions', env: 'Chrome 122/Win11/Okta', agentId: 'A. Chen', timestamp: '2026-03-21T15:00:00Z' },
    { solution: 'reset password', env: 'Chrome 122/Win11/Okta', agentId: 'J. Park', timestamp: '2026-03-14T10:00:00Z' },
  ];

  demoFailures.forEach((f, i) => {
    const key = `failure:meridian-corp:${f.solution.replace(/\s+/g, '-')}:${i}`;
    // Seed in-memory fallback
    memoryStore.set(key, {
      solution: f.solution,
      environment: f.env,
      agentId: f.agentId,
      timestamp: f.timestamp,
      outcome: 'failed',
      tags: ['meridian-corp', 'failure'],
      count: 1,
    });
    // Also retain in cloud Hindsight (async, fire-and-forget)
    storeMemory({ key, value: f, tags: ['meridian-corp', 'failure'] }).catch(() => {});
  });

  console.log('[Hindsight] Seeded', demoFailures.length, 'demo memories for meridian-corp');
}

seedDemoData();

module.exports = { storeMemory, queryFailures, getMemoryProfile };
