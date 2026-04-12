require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

const memoryRoutes = require('./routes/memory');
const conflictRoutes = require('./routes/conflict');
const ticketsRoutes = require('./routes/tickets');

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
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// Routes
app.use('/api', memoryRoutes);
app.use('/api', conflictRoutes);
app.use('/api', ticketsRoutes);

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
  const groqKey = process.env.GROQ_API_KEY;
  const stitchKey = process.env.STITCH_API_KEY;
  console.log('🔑 Groq:', groqKey ? '✓ configured' : '✗ missing (using mock)');
  console.log('🔑 Stitch MCP:', stitchKey ? '✓ configured' : '✗ missing (using in-memory)\n');
});
