// Centralized configuration for environment variables
const config = {
  // API Keys
  hindsightApiKey: process.env.HINDSIGHT_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  trustProxy: process.env.TRUST_PROXY === 'true',
  
  // CORS Configuration
  frontendUrl: process.env.FRONTEND_URL,
  
  // Hindsight Configuration
  hindsightBaseUrl: process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io',
  hindsightBankId: process.env.HINDSIGHT_BANK_ID || 'veto-customer-support',
  
  // Validation
  requiredEnvVars: ['HINDSIGHT_API_KEY', 'GROQ_API_KEY']
};

module.exports = config;