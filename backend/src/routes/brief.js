const express = require('express');
const { recallMemory } = require('../services/hindsight');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/:id/brief', asyncHandler(async (req, res) => {
  const customerId = req.params.id;

  const memories = await recallMemory(
    'customer history tickets solutions',
    { customer_id: customerId }
  );

  if (memories.length === 0) {
    return res.json({
      customer_id: customerId,
      company: 'Unknown',
      contact_name: 'Unknown',
      env: {},
      open_issues: [],
      past_solutions: [],
      frustration_level: 'low',
      last_resolution: null,
      escalation_count: 0,
      total_tickets: 0
    });
  }

  const firstMemory = memories[0];
  const env = firstMemory.env || {};
  
  const pastSolutions = memories
    .filter(m => m.ticket_id)
    .map(m => ({
      solution: m.solutions_attempted?.join(', ') || 'Unknown',
      outcome: m.outcome || 'unknown',
      date: m.timestamp?.split('T')[0] || 'Unknown',
      ticket_id: m.ticket_id
    }));

  const escalationCount = memories.filter(m => m.escalated).length;
  const frustrationSignals = memories.map(m => m.frustration_signal || 'low');
  const highFrustration = frustrationSignals.filter(f => f === 'high').length;
  
  let frustrationLevel = 'low';
  if (highFrustration > 1) frustrationLevel = 'high';
  else if (highFrustration === 1 || frustrationSignals.includes('medium')) frustrationLevel = 'medium';

  const resolvedMemories = memories.filter(m => m.outcome === 'resolved');
  const lastResolution = resolvedMemories.length > 0 
    ? resolvedMemories[0].resolution_notes || resolvedMemories[0].resolved_by 
    : null;

  res.json({
    customer_id: customerId,
    company: firstMemory.company || 'Unknown',
    contact_name: firstMemory.contact_name || 'Unknown',
    env,
    open_issues: memories
      .filter(m => m.outcome === 'failed' || !m.outcome)
      .map(m => m.issue_category || 'Unknown issue'),
    past_solutions: pastSolutions,
    frustration_level: frustrationLevel,
    last_resolution: lastResolution,
    escalation_count: escalationCount,
    total_tickets: new Set(memories.map(m => m.ticket_id).filter(Boolean)).size
  });
}));


module.exports = router;
