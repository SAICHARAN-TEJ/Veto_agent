require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const Groq = require('./lib/groq');
const Hindsight = require('./lib/hindsight');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const d = Date.now() - start;
    console.log(`${req.method} ${req.path} — ${res.statusCode} (${d}ms)`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      hindsight: !!process.env.HINDSIGHT_API_KEY ? 'configured' : 'mock',
      groq: !!process.env.GROQ_API_KEY ? 'configured' : 'mock',
    },
  });
});

// Routes

// POST /api/analyze - Extract solutions from agent draft
app.post('/api/analyze', async (req, res) => {
  try {
    const { customer_id, draft_response, environment } = req.body;
    
    if (!customer_id || !draft_response) {
      return res.status(400).json({ error: 'customer_id and draft_response required' });
    }

    const solutions = await Groq.extractSolutions(draft_response);
    const conflicts = await Hindsight.queryMemory(customer_id, solutions);

    res.json({
      success: true,
      extracted_solutions: solutions,
      memory_conflicts: conflicts,
      blocking_alert: conflicts.length > 0,
    });
  } catch (err) {
    console.error('Error in /api/analyze:', err);
    res.status(500).json({ error: 'Failed to analyze draft' });
  }
});

// POST /api/resolve - Get alternative solutions
app.post('/api/resolve', async (req, res) => {
  try {
    const { customer_id, failed_solutions, environment, ticket_context } = req.body;
    
    if (!customer_id || !failed_solutions || !Array.isArray(failed_solutions)) {
      return res.status(400).json({ error: 'customer_id and failed_solutions array required' });
    }

    const alternatives = await Groq.generateAlternatives(failed_solutions, ticket_context);
    const ranked = await Hindsight.rankAlternatives(alternatives, environment);

    res.json({
      success: true,
      alternatives: ranked,
      customer_memory_score: 0,
      recommended_followup: 'Monitor success rate of selected solution',
    });
  } catch (err) {
    console.error('Error in /api/resolve:', err);
    res.status(500).json({ error: 'Failed to resolve alternatives' });
  }
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('\n🧠 VETO backend running on http://localhost:' + PORT);
  console.log('📡 Health: http://localhost:' + PORT + '/health');

  const hindsightKey = process.env.HINDSIGHT_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const hindsightUrl = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';

  console.log('');
  console.log('🔑 Hindsight API:', hindsightKey ? `✓ configured (${hindsightKey.slice(0, 8)}...)` : '✗ missing (using mock)');
  console.log('🌐 Hindsight URL:', hindsightUrl);
  console.log('🔑 Groq API:', groqKey ? `✓ configured (${groqKey.slice(0, 8)}...)` : '✗ missing (using mock)');
  console.log('');
});
