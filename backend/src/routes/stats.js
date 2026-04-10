const express = require('express');
const { recallMemory } = require('../services/hindsight');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// In-memory event log for session tracking
const sessionEvents = [];

function recordEvent(type, data) {
  sessionEvents.push({
    type,
    data,
    timestamp: new Date().toISOString(),
  });
}

router.get('/memory', asyncHandler(async (req, res) => {
  // Pull stats from mock data and session events
  const conflictsDetected = sessionEvents.filter(e => e.type === 'conflict').length;
  const memoriesWritten = sessionEvents.filter(e => e.type === 'write').length;
  const checksPerformed = sessionEvents.filter(e => e.type === 'check').length;

  res.json({
    total_memories: 14 + memoriesWritten,
    unique_customers: 5,
    conflicts_detected: conflictsDetected,
    memories_written: memoriesWritten,
    checks_performed: checksPerformed,
    top_failure_patterns: [
      { solution: 'clear_browser_cache', failure_count: 4, affected_customers: 3 },
      { solution: 'reset_password', failure_count: 1, affected_customers: 1 },
      { solution: 'disable_extensions', failure_count: 1, affected_customers: 1 },
    ],
    resolution_rates: [
      { solution: 'revoke_saml_session_admin', rate: 0.875, cases: 8 },
      { solution: 'implement_exponential_backoff', rate: 0.92, cases: 25 },
      { solution: 'check_conditional_access_policy', rate: 0.80, cases: 10 },
      { solution: 'use_chrome_or_firefox', rate: 0.95, cases: 20 },
    ],
  });
}));

router.get('/timeline', asyncHandler(async (req, res) => {
  res.json({
    evolution: [
      {
        interaction: 1,
        timestamp: '2024-10-03T14:32:00Z',
        memory_depth: 0,
        confidence: 0.12,
        outcome: 'failed',
        description: 'First contact. No prior context. Generic cache-clearing suggested.',
      },
      {
        interaction: 2,
        timestamp: '2024-10-17T14:32:00Z',
        memory_depth: 1,
        confidence: 0.35,
        outcome: 'failed',
        description: 'First failure recorded. Agent avoids cache-clearing but tries disable-extensions.',
      },
      {
        interaction: 3,
        timestamp: '2024-10-22T09:15:00Z',
        memory_depth: 3,
        confidence: 0.62,
        outcome: 'partial',
        description: 'Cross-customer pattern detected. System surfaces SAML revoke as high-probability fix.',
      },
      {
        interaction: 5,
        timestamp: '2024-11-08T14:45:00Z',
        memory_depth: 7,
        confidence: 0.88,
        outcome: 'resolved',
        description: 'Full customer profile. Proactive resolution with zero wasted steps.',
      },
    ],
    session_events: sessionEvents.slice(-50),
  });
}));

// Event recording endpoint (called internally)
router.post('/event', asyncHandler(async (req, res) => {
  const { type, data } = req.body;
  if (type && ['conflict', 'write', 'check', 'clear'].includes(type)) {
    recordEvent(type, data || {});
    res.json({ recorded: true });
  } else {
    res.status(400).json({ error: 'Invalid event type' });
  }
}));

module.exports = router;
