/**
 * Hindsight — Official Stitch MCP API integration via @vectorize-io/hindsight-client
 *
 * Implements true biomimetic memory for VETO via retain, recall, and reflect.
 * Includes an in-memory seamless fallback if the locally running Docker container is unavailable.
 */

const { HindsightClient } = require('@vectorize-io/hindsight-client');

// Initialize the official client
const HINDSIGHT_URL = process.env.HINDSIGHT_URL || 'http://localhost:8888';
let client;

try {
  client = new HindsightClient({ baseUrl: HINDSIGHT_URL });
  console.log('[Hindsight] Client initialized pointing to', HINDSIGHT_URL);
} catch (e) {
  console.warn('[Hindsight] Failed to initialize official client', e.message);
}

// In-memory fallback (keeps UI functional if Docker server is missing)
const memoryStore = new Map();

/**
 * RETAIN: Store a memory entry.
 */
async function storeMemory({ key, value, tags = [] }) {
  const bankId = tags.includes('meridian-corp') ? 'meridian-corp' : 'veto-primary';
  
  try {
    if (client) {
      const contentText = typeof value === 'string' ? value : JSON.stringify(value);
      // Formal Hindsight API usage: retain(bankId, content, options)
      await client.retain(bankId, contentText, {
        timestamp: new Date(),
        metadata: { key, ...value, tags },
      });
      console.log(`[Hindsight] Memory RETAINED for ${bankId}: ${key}`);
    }
  } catch (error) {
    // console.warn('[Hindsight API] Retain failed (Server offline). Using fallback.', error.message);
  }

  // In-memory fallback update
  const existing = memoryStore.get(key);
  if (existing) {
    memoryStore.set(key, { ...existing, ...value, count: (existing.count || 1) + 1, updatedAt: new Date().toISOString() });
  } else {
    memoryStore.set(key, { ...value, tags, count: 1, createdAt: new Date().toISOString() });
  }
  return { success: true, key };
}

/**
 * RECALL: Query memories by customerId and solution string.
 * Returns matches with failure count.
 */
async function queryFailures(customerId, proposedSolution) {
  try {
    if (client) {
      // Formal Hindsight API usage: recall(bankId, query, options)
      const queryStr = `Did we try the solution "${proposedSolution}" before, and did it fail?`;
      const results = await client.recall(customerId, queryStr, { limit: 5 });
      
      if (results && results.length > 0) {
        console.log(`[Hindsight] Memory RECALLED ${results.length} vectors for ${customerId}`);
        return results.map(r => r.metadata).filter(m => m && m.outcome === 'failed');
      }
    }
  } catch (error) {
    // console.warn('[Hindsight API] Recall failed or offline. Using fallback.');
  }

  // In-memory fallback
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

/**
 * REFLECT: Get full memory profile and synthesis for a customer.
 */
async function getMemoryProfile(customerId) {
  let reflectionSynopsis = null;
  
  try {
    if (client) {
      // Formal Hindsight API usage: reflect(bankId, query)
      const reflection = await client.reflect(customerId, 'Summarize this customer\'s past technical issues and current frustration state strictly based on memory.');
      if (reflection && reflection.text) {
        console.log(`[Hindsight] Synthesized REFLECTION for ${customerId}`);
        reflectionSynopsis = reflection.text;
      }
    }
  } catch (error) {
     // console.warn('[Hindsight API] Reflect failed or offline. Using fallback.');
  }

  // Use the memory map to compute the exact counts for the UI layout
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
    reflectionSynopsis
  };
}

// ── Seed demo data for Meridian Corp ──
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
    // Seed the in-memory fallback
    memoryStore.set(key, {
      solution: f.solution,
      environment: f.env,
      agentId: f.agentId,
      timestamp: f.timestamp,
      outcome: 'failed',
      tags: ['meridian-corp', 'failure'],
      count: 1,
    });
    
    // We also attempt to asynchronously seed the real Hindsight memory bank if it's awake
    storeMemory({ key, value: f, tags: ['meridian-corp', 'failure'] }).catch(() => {});
  });

  console.log('[Hindsight] Seeded', demoFailures.length, 'demo memories for meridian-corp (Fallback/Cache)');
}

seedDemoData();

module.exports = { storeMemory, queryFailures, getMemoryProfile };

