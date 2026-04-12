const express = require('express');
const router = express.Router();
const { storeMemory } = require('../lib/hindsight');
const crypto = require('crypto');

/**
 * POST /api/resolve
 * Store ticket resolution outcome in Stitch MCP memory
 */
router.post('/resolve', async (req, res, next) => {
  try {
    const { ticketId, solution, outcome, customerId, environment = {} } = req.body;

    if (!solution || !outcome || !customerId) {
      return res.status(400).json({ error: 'solution, outcome, and customerId are required' });
    }

    // Hash the solution for consistent keying
    const solutionHash = crypto
      .createHash('sha256')
      .update(`${customerId}:${solution.toLowerCase().trim()}`)
      .digest('hex')
      .slice(0, 12);

    const key = `${outcome}:${customerId}:${solutionHash}`;

    // Store in Stitch MCP (or in-memory fallback)
    const result = await storeMemory({
      key,
      value: {
        ticketId,
        solution,
        outcome,
        customerId,
        environment,
        timestamp: new Date().toISOString(),
        agentId: req.body.agentId || 'unknown',
      },
      tags: [
        customerId,
        outcome,
        environment.os || 'unknown-os',
        environment.browser || 'unknown-browser',
        environment.sso || 'unknown-sso',
        solutionHash,
      ],
    });

    return res.json({
      success: true,
      key,
      message: `Outcome '${outcome}' stored for ${customerId}: "${solution}"`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
