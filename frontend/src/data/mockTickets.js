export const mockCustomers = [
  {
    id: 'cust_brightloop_001',
    company: 'Brightloop',
    contact_name: 'Marcus Tan',
    ticket_count: 2,
    frustration_level: 'high',
  },
  {
    id: 'cust_meridian_002',
    company: 'Meridian Health',
    contact_name: 'Priya Desai',
    ticket_count: 3,
    frustration_level: 'medium',
  },
  {
    id: 'cust_flux_003',
    company: 'Flux Robotics',
    contact_name: 'Carlos Mendez',
    ticket_count: 2,
    frustration_level: 'low',
  },
  {
    id: 'cust_verdigris_004',
    company: 'Verdigris Labs',
    contact_name: 'Aisha Patel',
    ticket_count: 1,
    frustration_level: 'medium',
  },
  {
    id: 'cust_coastline_005',
    company: 'Coastline Capital',
    contact_name: 'James Wu',
    ticket_count: 2,
    frustration_level: 'low',
  },
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
        {
          sender: 'customer',
          text: "Hi, I'm still having issues logging in via SSO. It just keeps redirecting me back to the login page over and over. This is the second time this has happened in two weeks.",
          timestamp: '2024-10-17T14:32:00Z',
        },
        {
          sender: 'agent',
          text: 'Hi Marcus, I can see you reported this same issue on October 3rd. Let me pull up your account details and check the current state of your SSO configuration.',
          timestamp: '2024-10-17T14:45:00Z',
        },
        {
          sender: 'customer',
          text: "Yes, and last time the agent told me to clear my browser cache. I already did that twice this time and it still isn't working. I need to access our analytics dashboard before our quarterly review tomorrow.",
          timestamp: '2024-10-17T14:48:00Z',
        },
        {
          sender: 'agent',
          text: 'I completely understand the urgency. Let me investigate this further rather than repeating the same steps. Give me a moment to look at your Okta session logs.',
          timestamp: '2024-10-17T14:52:00Z',
        },
      ],
    },
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
        {
          sender: 'customer',
          text: 'Our entire compliance team still cannot log in through Okta SSO. We tried resetting passwords as your previous agent suggested, but that had no effect. This is affecting our ability to submit regulatory filings.',
          timestamp: '2024-11-01T11:20:00Z',
        },
        {
          sender: 'agent',
          text: "Thanks for reaching out, Priya. I'm sorry to hear the password resets didn't help. Let me check your SSO configuration and recent Okta logs to find a different path forward.",
          timestamp: '2024-11-01T11:35:00Z',
        },
        {
          sender: 'customer',
          text: 'Please do. We have a compliance deadline next week and six team members are locked out. We need this resolved today if possible.',
          timestamp: '2024-11-01T11:42:00Z',
        },
      ],
    },
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
        {
          sender: 'customer',
          text: "We're getting rate limit errors from our integration again. We already reduced our polling frequency to 10-second intervals last month per your recommendation, but the 429s have come back.",
          timestamp: '2024-10-05T13:30:00Z',
        },
        {
          sender: 'agent',
          text: "Hi Carlos, thanks for the context. Let me check your API usage patterns and see if there's a different approach we should take rather than just adjusting the polling interval again.",
          timestamp: '2024-10-05T13:45:00Z',
        },
      ],
    },
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
        {
          sender: 'customer',
          text: 'When I try to export our experiment data to CSV, nothing happens. The download button just spins for about 30 seconds and then times out with no file saved.',
          timestamp: '2024-10-19T15:22:00Z',
        },
        {
          sender: 'agent',
          text: 'Sorry to hear that, Aisha. What browser are you using?',
          timestamp: '2024-10-19T15:30:00Z',
        },
        {
          sender: 'customer',
          text: "Safari on macOS. I already tried clearing the browser cache after reading about it in your help docs, and it still doesn't work. The dataset is about 12,000 rows if that matters.",
          timestamp: '2024-10-19T15:35:00Z',
        },
      ],
    },
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
        {
          sender: 'customer',
          text: 'Getting stuck in an infinite redirect loop when trying to sign in through Azure AD. This started happening after our IT team updated our conditional access policies last week.',
          timestamp: '2024-10-10T08:45:00Z',
        },
        {
          sender: 'agent',
          text: "Hi James, that's helpful context about the conditional access change. Let me investigate your Azure AD integration settings and check if the policy update could be causing the loop.",
          timestamp: '2024-10-10T09:00:00Z',
        },
        {
          sender: 'customer',
          text: 'Thanks. Our IT admin said they can jump on a call if you need to walk through the Azure AD config together.',
          timestamp: '2024-10-10T09:08:00Z',
        },
      ],
    },
  ],
};