require('dotenv').config();

const express = require('express');
const cors = require('cors');

// In-memory rate limiter with cleanup to prevent memory leaks
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // requests per window
const CLEANUP_INTERVAL = 60000; // Clean up every minute

// Periodically clean up old entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

function rateLimiter(req, res, next) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
  
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW;
  }
  
  record.count++;
  rateLimitMap.set(key, record);
  
  if (record.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  next();
}

// Input sanitization helper
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  // Remove potentially dangerous characters and HTML entities
  return str
    .replace(/[<>\"'&]/g, '')
    .replace(/&(lt|gt|quot|#39|amp);/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove any HTML tags that might have been missed
    .slice(0, 10000);
}

// Security: Validate environment on startup
function validateEnv() {
  const config = require('./config');
  const missing = config.requiredEnvVars.filter(key => !process.env[key]);
  
   if (missing.length > 0) {
     console.warn('[WARNING] Missing env vars (using mock fallback):', missing.join(', '));
   } else if (process.env.NODE_ENV !== 'production') {
     console.log('[INFO] Environment variables configured');
   }
}

const vetoRoutes = require('./routes/veto');
const memoryRoutes = require('./routes/memory');
const briefRoutes = require('./routes/brief');
const suggestRoutes = require('./routes/suggest');

// New: Async error wrapper to standardize error handling
const asyncHandler = require('./utils/asyncHandler');

const app = express();
const config = require('./config');

validateEnv();

// Security: Trust proxy (if behind reverse proxy)
if (config.trustProxy) {
  app.set('trust proxy', 1);
}

// Security: Rate limiting
app.use(rateLimiter);

// Security: CORS configuration
const corsOptions = {
  origin: config.nodeEnv === 'production' && config.frontendUrl
    ? config.frontendUrl
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit request body size

// Security: Request logging (without sensitive data)
app.use((req, res, next) => {
  const start = Date.now();
  const { method, path, ip } = req;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log only method, path, status, duration - never bodies or params
    console.log(`${method} ${path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Sanitization middleware for query params
app.use((req, res, next) => {
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      req.query[key] = sanitizeString(req.query[key]);
    }
  }
  next();
});

// Security: API key validation middleware
app.use((req, res, next) => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/veto', vetoRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/customer', briefRoutes);
app.use('/api/suggest', suggestRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log('\n🚀 Veto backend running on http://localhost:' + PORT);
  console.log('📊 Health: http://localhost:' + PORT + '/health\n');
});
