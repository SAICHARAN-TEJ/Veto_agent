const express = require('express');
const { writeMemory } = require('../services/hindsight');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/write', asyncHandler(async (req, res) => {
  const memoryChunk = {
    ...req.body,
    timestamp: new Date().toISOString()
  };

  const result = await writeMemory(memoryChunk);
  
  res.json({ success: true, memory_id: result.id });
}));


module.exports = router;
