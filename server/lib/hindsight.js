/**
 * Hindsight — in-memory Stitch MCP wrapper
 *
 * In production: replace the in-memory store with actual Stitch MCP API calls.
 * The store/search interface matches the spec pattern exactly.
 *
 * STITCH MCP PATTERN (production):
 * await stitch.memory.store({ key, value, tags })
 * const matches = await stitch.memory.search({ tags, filter })
 */

// In-memory store (dev fallback when STITCH_API_KEY not set)
const memoryStore = new Map();

/**
 * Store a memory entry.
 */
async function storeMemory({ key, value, tags = [] }) {
  if (process.env.STITCH_API_KEY) {
    // Production: call Stitch MCP API
    // await stitch.memory.store({ key, value, tags });
    console.log('[Stitch] Would store:', key, 'tags:', tags);
  }

  // In-memory fallback
  const existing = memoryStore.get(key);
  if (existing) {
    memoryStore.set(key, { ...existing, ...value, count: (existing.count || 1) + 1, updatedAt: new Date().toISOString() });
  } else {
    memoryStore.set(key, { ...value, tags, count: 1, createdAt: new Date().toISOString() });
  }
  return { success: true, key };
}

/**
 * Query memories by customerId and solution string.
 * Returns matches with failure count and last failure info.
 */
async function queryFailures(customerId, proposedSolution) {
  if (process.env.STITCH_API_KEY) {
    // Production: call Stitch MCP API
    // const matches = await stitch.memory.search({ tags: [customerId, 'failure'], filter: { solution: proposedSolution } });
    // return matches;
    console.log('[Stitch] Would query:', customerId, proposedSolution);
  }

  // In-memory fallback: check pre-seeded + runtime data
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
 * Get full memory profile for a customer.
 */
async function getMemoryProfile(customerId) {
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
    memoryStore.set(key, {
      solution: f.solution,
      environment: f.env,
      agentId: f.agentId,
      timestamp: f.timestamp,
      outcome: 'failed',
      tags: ['meridian-corp', 'failure'],
      count: 1,
    });
  });

  console.log('[Hindsight] Seeded', demoFailures.length, 'demo memories for meridian-corp');
}

seedDemoData();

module.exports = { storeMemory, queryFailures, getMemoryProfile };
