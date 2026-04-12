const express = require('express');
const router = express.Router();

// Static ticket data (mirrors the Zustand store for API consistency)
const TICKETS = [
  {
    id: 'TK-001',
    company: 'Meridian Corp',
    issue: 'SSO login loop — users unable to authenticate',
    tag: 'Authentication',
    status: 'active',
    customerId: 'meridian-corp',
  },
  {
    id: 'TK-002',
    company: 'Praxis Systems',
    issue: 'API rate limiting errors on bulk import',
    tag: 'API',
    status: 'active',
    customerId: 'praxis-systems',
  },
  {
    id: 'TK-003',
    company: 'Volta Analytics',
    issue: 'Dashboard not loading after recent update',
    tag: 'Dashboard',
    status: 'resolved',
    customerId: 'volta-analytics',
  },
  {
    id: 'TK-004',
    company: 'Nexus Financial',
    issue: 'Two-factor auth codes not being received',
    tag: 'Authentication',
    status: 'flagged',
    customerId: 'nexus-financial',
  },
];

/**
 * GET /api/tickets
 * Return ticket list with optional status filter
 */
router.get('/tickets', (req, res) => {
  const { status } = req.query;
  const filtered = status && status !== 'all'
    ? TICKETS.filter((t) => t.status === status)
    : TICKETS;
  return res.json({ tickets: filtered, total: filtered.length });
});

/**
 * GET /api/metrics
 * Return platform-wide performance metrics
 */
router.get('/metrics', (req, res) => {
  return res.json({
    conflictsBlockedThisWeek: 4821,
    resolutionTimeDeltaPct: -38,
    satisfactionMultiplier: 2.4,
    repeatFailures: 0,
    topCustomer: {
      id: 'meridian-corp',
      name: 'Meridian Corp',
      conflictsBlocked: 3,
      recallAccuracy: 0.94,
    },
    updatedAt: new Date().toISOString(),
  });
});

module.exports = router;
