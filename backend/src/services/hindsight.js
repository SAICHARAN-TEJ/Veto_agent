const axios = require('axios');
require('dotenv').config();
const config = require('../config');

const HINDSIGHT_BASE_URL = config.hindsightBaseUrl;
const API_KEY = config.hindsightApiKey;
const BANK_ID = config.hindsightBankId;
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Mock data for demo (when Hindsight is unavailable)
const mockCustomerHistories = {
  'cust_brightloop_001': [
    { ticket_id: 'ticket_4821', issue_category: 'sso_redirect_loop', solutions_attempted: ['clear_browser_cache'], outcome: 'failed', timestamp: '2024-10-03T14:32:00Z', env: { browser: 'Chrome 118', os: 'macOS 13.5', plan: 'Enterprise', sso_provider: 'Okta' }, company: 'Brightloop', contact_name: 'Marcus Tan' },
    { ticket_id: 'ticket_4934', issue_category: 'sso_redirect_loop', solutions_attempted: ['clear_browser_cache', 'disable_extensions'], outcome: 'failed', timestamp: '2024-10-17T14:32:00Z', env: { browser: 'Chrome 118', os: 'macOS 13.5', plan: 'Enterprise', sso_provider: 'Okta' }, company: 'Brightloop', contact_name: 'Marcus Tan' }
  ],
  'cust_meridian_002': [
    { ticket_id: 'ticket_5102', issue_category: 'sso_redirect_loop', solutions_attempted: ['clear_browser_cache'], outcome: 'failed', timestamp: '2024-10-22T09:15:00Z', env: { browser: 'Firefox 119', os: 'Windows 11', plan: 'Enterprise', sso_provider: 'Okta' }, company: 'Meridian Health', contact_name: 'Priya Desai' },
    { ticket_id: 'ticket_5210', issue_category: 'sso_redirect_loop', solutions_attempted: ['reset_password'], outcome: 'failed', timestamp: '2024-11-01T11:20:00Z', env: { browser: 'Firefox 119', os: 'Windows 11', plan: 'Enterprise', sso_provider: 'Okta' }, company: 'Meridian Health', contact_name: 'Priya Desai' }
  ],
  'cust_flux_003': [
    { ticket_id: 'ticket_4455', issue_category: 'api_rate_limit', solutions_attempted: ['reduce_polling_frequency'], outcome: 'resolved', timestamp: '2024-09-15T10:00:00Z', env: { browser: 'Chrome 119', os: 'Ubuntu 22.04', plan: 'Growth', sso_provider: 'Google' }, company: 'Flux Robotics', contact_name: 'Carlos Mendez' }
  ]
};

const solutionIndex = [
  { issue_category: 'sso_redirect_loop', solution: 'revoke_saml_session_admin', env_sso_provider: 'Okta', env_browser_family: 'Chrome', resolution_rate: 0.875, resolved_count: 7, attempted_count: 8, sample_companies: ['Brightloop', 'Meridian Health'] },
  { issue_category: 'sso_redirect_loop', solution: 'check_conditional_access_policy', env_sso_provider: 'Azure AD', env_browser_family: 'Edge', resolution_rate: 0.80, resolved_count: 8, attempted_count: 10, sample_companies: ['Coastline Capital'] },
  { issue_category: 'api_rate_limit', solution: 'implement_exponential_backoff', resolution_rate: 0.92, resolved_count: 23, attempted_count: 25, sample_companies: ['Flux Robotics'] }
];

/**
 * Write memory chunk to Hindsight (with fallback to mock)
 */
async function writeMemory(chunk) {
  try {
    const response = await axios.post(
      HINDSIGHT_BASE_URL + '/banks/' + BANK_ID + '/retain',
      { items: [{ content: JSON.stringify(chunk) }] },
      { 
        headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json' },
        timeout: REQUEST_TIMEOUT
      }
    );
    return { success: true, id: response.data.operation_id || 'stored' };
  } catch (error) {
    console.warn('Hindsight write error:', error.response?.data || error.message);
    return { success: true, id: 'mock-' + Date.now() };
  }
}

/**
 * Recall memories from Hindsight (with fallback to mock)
 */
async function recallMemory(query, filters = {}) {
  try {
    const requestBody = { query: query, max_results: 5 };
    if (filters.customer_id) requestBody.filters = { customer_id: filters.customer_id };

    const response = await axios.post(
      HINDSIGHT_BASE_URL + '/banks/' + BANK_ID + '/recall',
      requestBody,
      { 
        headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json' },
        timeout: REQUEST_TIMEOUT
      }
    );

    return (response.data.results || []).map(result => {
      try { return JSON.parse(result.text); } catch (e) { return { raw: result.text }; }
    });
  } catch (error) {
    // Fallback to mock data
    console.warn('Hindsight recall error:', error.response?.data || error.message, '- using mock data');
    
    if (filters.customer_id && filters.outcome === 'failed') {
      return mockCustomerHistories[filters.customer_id]?.filter(m => m.outcome === 'failed') || [];
    }
    
    if (filters.customer_id) {
      return mockCustomerHistories[filters.customer_id] || [];
    }
    
    if (query.includes('solution')) {
      return solutionIndex;
    }
    
    return [];
  }
}

module.exports = { writeMemory, recallMemory };
