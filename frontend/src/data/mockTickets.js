export const mockCustomers = [
  { id: 'cust_brightloop_001', company: 'Brightloop', contact_name: 'Marcus Tan', ticket_count: 2, frustration_level: 'high' },
  { id: 'cust_meridian_002', company: 'Meridian Health', contact_name: 'Priya Desai', ticket_count: 3, frustration_level: 'medium' },
  { id: 'cust_flux_003', company: 'Flux Robotics', contact_name: 'Carlos Mendez', ticket_count: 2, frustration_level: 'low' },
  { id: 'cust_verdigris_004', company: 'Verdigris Labs', contact_name: 'Aisha Patel', ticket_count: 1, frustration_level: 'medium' },
  { id: 'cust_coastline_005', company: 'Coastline Capital', contact_name: 'James Wu', ticket_count: 2, frustration_level: 'low' }
];

export const mockTickets = {
  'cust_brightloop_001': [
    {
      id: 'ticket_4934',
      customer_id: 'cust_brightloop_001',
      company: 'Brightloop',
      contact_name: 'Marcus Tan',
      issue_category: 'sso_redirect_loop',
      issue_description: 'SSO login keeps redirecting in a loop. Cannot access dashboard.',
      opened_at: '2024-10-17T14:32:00Z',
      status: 'open',
      thread: [
        { sender: 'customer', text: "Hi, I'm still having issues logging in via SSO. It just keeps redirecting me back to the login page. This is the second time this has happened.", timestamp: '2024-10-17T14:32:00Z' },
        { sender: 'agent', text: 'Hi Marcus, I see you reported this same issue on October 3rd. Let me look into your account.', timestamp: '2024-10-17T14:45:00Z' },
        { sender: 'customer', text: "Yes, I already tried clearing my browser cache twice and it still isn't working. I really need to access our dashboard urgently.", timestamp: '2024-10-17T14:48:00Z' }
      ]
    }
  ],
  'cust_meridian_002': [
    {
      id: 'ticket_5210',
      customer_id: 'cust_meridian_002',
      company: 'Meridian Health',
      contact_name: 'Priya Desai',
      issue_category: 'sso_redirect_loop',
      issue_description: 'Cannot complete SSO authentication flow',
      opened_at: '2024-11-01T11:20:00Z',
      status: 'open',
      thread: [
        { sender: 'customer', text: 'Our team still cannot log in through Okta SSO. We tried resetting passwords but that did not help.', timestamp: '2024-11-01T11:20:00Z' },
        { sender: 'agent', text: 'Thanks for reaching out Priya. I will check your SSO configuration.', timestamp: '2024-11-01T11:35:00Z' }
      ]
    }
  ],
  'cust_flux_003': [
    {
      id: 'ticket_4701',
      customer_id: 'cust_flux_003',
      company: 'Flux Robotics',
      contact_name: 'Carlos Mendez',
      issue_category: 'api_rate_limit',
      issue_description: 'API calls being rate limited frequently',
      opened_at: '2024-10-05T13:30:00Z',
      status: 'open',
      thread: [
        { sender: 'customer', text: "We're getting rate limit errors again from our integration. Our polling frequency is already set to 10 seconds.", timestamp: '2024-10-05T13:30:00Z' },
        { sender: 'agent', text: 'Hi Carlos, let me check your API usage patterns.', timestamp: '2024-10-05T13:45:00Z' }
      ]
    }
  ],
  'cust_verdigris_004': [
    {
      id: 'ticket_5001',
      customer_id: 'cust_verdigris_004',
      company: 'Verdigris Labs',
      contact_name: 'Aisha Patel',
      issue_category: 'csv_export_fail',
      issue_description: 'CSV export not downloading',
      opened_at: '2024-10-19T15:22:00Z',
      status: 'open',
      thread: [
        { sender: 'customer', text: 'When I try to export our data to CSV, nothing happens. The button just spins and then times out.', timestamp: '2024-10-19T15:22:00Z' },
        { sender: 'agent', text: 'Sorry to hear that Aisha. What browser are you using?', timestamp: '2024-10-19T15:30:00Z' },
        { sender: 'customer', text: 'Safari on macOS. I already tried clearing the cache and it still does not work.', timestamp: '2024-10-19T15:35:00Z' }
      ]
    }
  ],
  'cust_coastline_005': [
    {
      id: 'ticket_4890',
      customer_id: 'cust_coastline_005',
      company: 'Coastline Capital',
      contact_name: 'James Wu',
      issue_category: 'sso_redirect_loop',
      issue_description: 'Azure AD SSO login loop',
      opened_at: '2024-10-10T08:45:00Z',
      status: 'open',
      thread: [
        { sender: 'customer', text: 'Getting stuck in an infinite redirect loop when trying to sign in through Azure AD.', timestamp: '2024-10-10T08:45:00Z' },
        { sender: 'agent', text: 'Hi James, I will investigate your Azure AD integration settings.', timestamp: '2024-10-10T09:00:00Z' }
      ]
    }
  ]
};