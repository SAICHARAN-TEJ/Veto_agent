const express = require('express');
const { writeMemory } = require('../services/hindsight');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>"'&]/g, '')
    .replace(/&(lt|gt|quot|#39|amp);/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .slice(0, 10000)
    .trim();
}

function normalizeSolutions(value) {
  if (Array.isArray(value)) {
    return value
      .map(item => sanitizeInput(String(item || '')))
      .filter(Boolean)
      .slice(0, 10);
  }
  if (typeof value === 'string') {
    const cleaned = sanitizeInput(value);
    return cleaned ? [cleaned] : [];
  }
  return [];
}

function validateOutcome(value) {
  const normalized = sanitizeInput(String(value || '')).toLowerCase();
  const validOutcomes = ['resolved', 'failed', 'escalated', 'unknown'];
  return validOutcomes.includes(normalized) ? normalized : '';
}

function validateFrustrationSignal(value) {
  const normalized = sanitizeInput(String(value || 'low')).toLowerCase();
  const valid = ['low', 'medium', 'high'];
  return valid.includes(normalized) ? normalized : 'low';
}

router.post('/write', asyncHandler(async (req, res) => {
  const customerId = sanitizeInput(req.body.customer_id);
  const ticketId = sanitizeInput(req.body.ticket_id);
  const outcome = validateOutcome(req.body.outcome);
  const solutionsAttempted = normalizeSolutions(req.body.solutions_attempted || req.body.solution);

  if (!customerId || !ticketId || !outcome || solutionsAttempted.length === 0) {
    return res.status(400).json({
      error: 'Invalid memory payload',
      required: ['customer_id', 'ticket_id', 'outcome', 'solutions_attempted'],
    });
  }

  const memoryChunk = {
    ...req.body,
    customer_id: customerId,
    ticket_id: ticketId,
    outcome,
    solutions_attempted: solutionsAttempted,
    resolution_notes: sanitizeInput(req.body.resolution_notes || ''),
    frustration_signal: validateFrustrationSignal(req.body.frustration_signal),
    issue_category: sanitizeInput(req.body.issue_category || 'agent_resolution'),
    timestamp: new Date().toISOString()
  };

  const result = await writeMemory(memoryChunk);
  
  res.json({ success: true, memory_id: result.id });
}));


module.exports = router;
