const express = require('express');
const { checkDraft } = require('../services/veto-engine');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Input sanitization helper
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  // Remove potentially dangerous characters and HTML entities
  return str
    .replace(/[<>\"'&]/g, '')
    .replace(/&(lt|gt|quot|#39|amp);/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove any HTML tags that might have been missed
    .slice(0, 10000);
}

router.post('/check', asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  const { customer_id, draft_response, ticket_id } = req.body;

  // Sanitize inputs
  const sanitizedCustomerId = sanitizeInput(customer_id);
  const sanitizedDraft = sanitizeInput(draft_response);
  const sanitizedTicketId = sanitizeInput(ticket_id);

  if (!sanitizedCustomerId || !sanitizedDraft || !sanitizedTicketId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const result = await checkDraft(sanitizedCustomerId, sanitizedDraft, sanitizedTicketId);
  
  console.log('[VETO] Response time: ' + (Date.now() - startTime) + 'ms');
  
  res.json(result);
}));

module.exports = router;