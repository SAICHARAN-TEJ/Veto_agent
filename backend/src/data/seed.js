const { writeMemory } = require('../services/hindsight');

const customerHistories = [
  // 1. Marcus Tan / Brightloop
  {
    customer_id: 'cust_brightloop_001',
    company: 'Brightloop',
    contact_name: 'Marcus Tan',
    env: { browser: 'Chrome 118', os: 'macOS 13.5', plan: 'Enterprise', sso_provider: 'Okta' },
    ticket_id: 'ticket_4821',
    issue_category: 'sso_redirect_loop',
    solutions_attempted: ['clear_browser_cache'],
    outcome: 'failed',
    follow_up_within_48h: true,
    frustration_signal: 'medium',
    escalated: false,
    resolved_by: null,
    resolution_notes: '',
    timestamp: '2024-10-03T14:32:00Z'
  },
  {
    customer_id: 'cust_brightloop_001',
    company: 'Brightloop',
    contact_name: 'Marcus Tan',
    env: { browser: 'Chrome 118', os: 'macOS 13.5', plan: 'Enterprise', sso_provider: 'Okta' },
    ticket_id: 'ticket_4934',
    issue_category: 'sso_redirect_loop',
    solutions_attempted: ['clear_browser_cache', 'disable_extensions'],
    outcome: 'failed',
    follow_up_within_48h: true,
    frustration_signal: 'high',
    escalated: false,
    resolved_by: null,
    resolution_notes: '',
    timestamp: '2024-10-17T14:32:00Z'
  },
  // 2. Priya Desai / Meridian Health
  {
    customer_id: 'cust_meridian_002',
    company: 'Meridian Health',
    contact_name: 'Priya Desai',
    env: { browser: 'Firefox 119', os: 'Windows 11', plan: 'Enterprise', sso_provider: 'Okta' },
    ticket_id: 'ticket_5102',
    issue_category: 'sso_redirect_loop',
    solutions_attempted: ['clear_browser_cache'],
    outcome: 'failed',
    follow_up_within_48h: true,
    frustration_signal: 'medium',
    escalated: false,
    resolved_by: null,
    resolution_notes: '',
    timestamp: '2024-10-22T09:15:00Z'
  },
  {
    customer_id: 'cust_meridian_002',
    company: 'Meridian Health',
    contact_name: 'Priya Desai',
    env: { browser: 'Firefox 119', os: 'Windows 11', plan: 'Enterprise', sso_provider: 'Okta' },
    ticket_id: 'ticket_5210',
    issue_category: 'sso_redirect_loop',
    solutions_attempted: ['reset_password'],
    outcome: 'failed',
    follow_up_within_48h: true,
    frustration_signal: 'high',
    escalated: false,
    resolved_by: null,
    resolution_notes: '',
    timestamp: '2024-11-01T11:20:00Z'
  },
  {
    customer_id: 'cust_meridian_002',
    company: 'Meridian Health',
    contact_name: 'Priya Desai',
    env: { browser: 'Firefox 119', os: 'Windows 11', plan: 'Enterprise', sso_provider: 'Okta' },
    ticket_id: 'ticket_5318',
    issue_category: 'sso_redirect_loop',
    solutions_attempted: ['revoke_saml_session_admin'],
    outcome: 'resolved',
    follow_up_within_48h: false,
    frustration_signal: 'low',
    escalated: false,
    resolved_by: 'revoke_saml_session_admin',
    resolution_notes: 'SAML session revoke worked immediately',
    timestamp: '2024-11-08T14:45:00Z'
  },
  // 3. Carlos Mendez / Flux Robotics
  {
    customer_id: 'cust_flux_003',
    company: 'Flux Robotics',
    contact_name: 'Carlos Mendez',
    env: { browser: 'Chrome 119', os: 'Ubuntu 22.04', plan: 'Growth', sso_provider: 'Google' },
    ticket_id: 'ticket_4455',
    issue_category: 'api_rate_limit',
    solutions_attempted: ['reduce_polling_frequency'],
    outcome: 'resolved',
    follow_up_within_48h: false,
    frustration_signal: 'low',
    escalated: false,
    resolved_by: 'reduce_polling_frequency',
    resolution_notes: 'Adjusted polling to 10s intervals',
    timestamp: '2024-09-15T10:00:00Z'
  },
  {
    customer_id: 'cust_flux_003',
    company: 'Flux Robotics',
    contact_name: 'Carlos Mendez',
    env: { browser: 'Chrome 119', os: 'Ubuntu 22.04', plan: 'Growth', sso_provider: 'Google' },
    ticket_id: 'ticket_4701',
    issue_category: 'api_rate_limit',
    solutions_attempted: ['reduce_polling_frequency'],
    outcome: 'resolved',
    follow_up_within_48h: false,
    frustration_signal: 'low',
    escalated: false,
    resolved_by: 'reduce_polling_frequency',
    resolution_notes: 'Reconfigured to 15s intervals',
    timestamp: '2024-10-05T13:30:00Z'
  },
  // 4. Aisha Patel / Verdigris Labs
  {
    customer_id: 'cust_verdigris_004',
    company: 'Verdigris Labs',
    contact_name: 'Aisha Patel',
    env: { browser: 'Safari 17', os: 'macOS 14', plan: 'Starter', sso_provider: 'None' },
    ticket_id: 'ticket_5001',
    issue_category: 'csv_export_fail',
    solutions_attempted: ['use_different_browser', 'clear_browser_cache'],
    outcome: 'failed',
    follow_up_within_48h: true,
    frustration_signal: 'medium',
    escalated: false,
    resolved_by: null,
    resolution_notes: '',
    timestamp: '2024-10-19T15:22:00Z'
  },
  // 5. James Wu / Coastline Capital
  {
    customer_id: 'cust_coastline_005',
    company: 'Coastline Capital',
    contact_name: 'James Wu',
    env: { browser: 'Edge 118', os: 'Windows 11', plan: 'Enterprise', sso_provider: 'Azure AD' },
    ticket_id: 'ticket_4890',
    issue_category: 'sso_redirect_loop',
    solutions_attempted: ['clear_browser_cache'],
    outcome: 'failed',
    follow_up_within_48h: true,
    frustration_signal: 'medium',
    escalated: false,
    resolved_by: null,
    resolution_notes: '',
    timestamp: '2024-10-10T08:45:00Z'
  },
  {
    customer_id: 'cust_coastline_005',
    company: 'Coastline Capital',
    contact_name: 'James Wu',
    env: { browser: 'Edge 118', os: 'Windows 11', plan: 'Enterprise', sso_provider: 'Azure AD' },
    ticket_id: 'ticket_4901',
    issue_category: 'sso_redirect_loop',
    solutions_attempted: ['check_conditional_access_policy'],
    outcome: 'resolved',
    follow_up_within_48h: false,
    frustration_signal: 'low',
    escalated: false,
    resolved_by: 'check_conditional_access_policy',
    resolution_notes: 'Azure AD conditional access was blocking',
    timestamp: '2024-10-11T10:15:00Z'
  }
];

const solutionIndexEntries = [
  { type: 'solution_index', issue_category: 'sso_redirect_loop', solution: 'revoke_saml_session_admin', env_sso_provider: 'Okta', env_browser_family: 'Chrome', resolved_count: 7, attempted_count: 8, resolution_rate: 0.875, sample_companies: ['Brightloop', 'Meridian Health', 'Flux Robotics'] },
  { type: 'solution_index', issue_category: 'sso_redirect_loop', solution: 'check_conditional_access_policy', env_sso_provider: 'Azure AD', env_browser_family: 'Edge', resolved_count: 8, attempted_count: 10, resolution_rate: 0.80, sample_companies: ['Coastline Capital', 'Quantum Designs', 'Cascade Systems'] },
  { type: 'solution_index', issue_category: 'api_rate_limit', solution: 'implement_exponential_backoff', env_sso_provider: '', env_browser_family: '', resolved_count: 23, attempted_count: 25, resolution_rate: 0.92, sample_companies: ['Flux Robotics', 'Nimbus Analytics', 'Stellar Logistics'] },
  { type: 'solution_index', issue_category: 'csv_export_fail', solution: 'use_chrome_or_firefox', env_sso_provider: '', env_browser_family: 'Safari', resolved_count: 19, attempted_count: 20, resolution_rate: 0.95, sample_companies: ['Verdigris Labs', 'Zenith Corp', 'Quantum Designs'] },
  { type: 'solution_index', issue_category: 'data_sync_delay', solution: 'force_resync_from_settings', env_sso_provider: '', env_browser_family: '', resolved_count: 14, attempted_count: 18, resolution_rate: 0.78, sample_companies: ['Stellar Logistics', 'Cascade Systems', 'Nimbus Analytics'] }
];

async function seedHindsight() {
  console.log('?? Starting Hindsight seed process...\n');
  console.log('?? Seeding customer histories:');
  for (const history of customerHistories) {
    try {
      await writeMemory(history);
      console.log('  ? ' + history.contact_name + ' / ' + history.company + ' - Ticket ' + history.ticket_id);
    } catch (error) {
      console.error('  ? Failed to seed ' + history.ticket_id + ':', error.message);
    }
  }
  console.log('\n?? Seeding solution index entries:');
  for (const entry of solutionIndexEntries) {
    try {
      await writeMemory(entry);
      console.log('  ? ' + entry.issue_category + ' ? ' + entry.solution + ' (' + Math.round(entry.resolution_rate * 100) + '% success)');
    } catch (error) {
      console.error('  ? Failed to seed solution index:', error.message);
    }
  }
  console.log('\n? Done! Seeded:');
  console.log('   • ' + customerHistories.length + ' customer history entries');
  console.log('   • ' + solutionIndexEntries.length + ' solution index entries');
  console.log('\n?? Ready to demo Veto!\n');
}

if (require.main === module) {
  seedHindsight().catch(console.error);
}

module.exports = { seedHindsight };
