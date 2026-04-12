import { create } from 'zustand';

const DEMO_TICKETS = [
  {
    id: 'TK-001',
    company: 'Meridian Corp',
    issue: 'SSO login loop — users unable to authenticate',
    tag: 'Authentication',
    status: 'active',
    history: [
      { agent: 'J. Park', message: 'Have you tried clearing your browser cache?', ts: '2026-03-14 09:10', outcome: 'failed' },
      { agent: 'A. Chen', message: 'Please clear browser cache and cookies.', ts: '2026-03-21 14:22', outcome: 'failed' },
      { agent: 'L. Torres', message: 'Try clearing cache in incognito mode.', ts: '2026-04-01 11:05', outcome: 'failed' },
    ],
    customer: {
      id: 'meridian-corp',
      name: 'Meridian Corp',
      since: '2023-02-15',
      plan: 'Enterprise',
      openTickets: 3,
      environment: { os: 'Windows 11', browser: 'Chrome 122', sso: 'Okta', planTier: 'Enterprise' },
      frustrationScore: 87,
      failedSolutions: [
        { solution: 'Clear browser cache', count: 3, lastAttempt: '2026-04-01' },
        { solution: 'Disable browser extensions', count: 1, lastAttempt: '2026-03-21' },
        { solution: 'Reset password', count: 1, lastAttempt: '2026-03-14' },
      ],
    },
  },
  {
    id: 'TK-002',
    company: 'Praxis Systems',
    issue: 'API rate limiting errors on bulk import',
    tag: 'API',
    status: 'active',
    history: [],
    customer: {
      id: 'praxis-systems',
      name: 'Praxis Systems',
      since: '2024-06-01',
      plan: 'Pro',
      openTickets: 1,
      environment: { os: 'macOS 14', browser: 'Safari 17', sso: 'Google', planTier: 'Pro' },
      frustrationScore: 34,
      failedSolutions: [],
    },
  },
  {
    id: 'TK-003',
    company: 'Volta Analytics',
    issue: 'Dashboard not loading after recent update',
    tag: 'Dashboard',
    status: 'resolved',
    history: [],
    customer: {
      id: 'volta-analytics',
      name: 'Volta Analytics',
      since: '2025-01-10',
      plan: 'Starter',
      openTickets: 0,
      environment: { os: 'Ubuntu 22', browser: 'Firefox 123', sso: 'None', planTier: 'Starter' },
      frustrationScore: 12,
      failedSolutions: [],
    },
  },
  {
    id: 'TK-004',
    company: 'Nexus Financial',
    issue: 'Two-factor auth codes not being received',
    tag: 'Authentication',
    status: 'flagged',
    history: [],
    customer: {
      id: 'nexus-financial',
      name: 'Nexus Financial',
      since: '2022-09-20',
      plan: 'Enterprise',
      openTickets: 2,
      environment: { os: 'Windows 10', browser: 'Edge 122', sso: 'Azure AD', planTier: 'Enterprise' },
      frustrationScore: 61,
      failedSolutions: [
        { solution: 'Resend verification email', count: 2, lastAttempt: '2026-04-10' },
      ],
    },
  },
];

export const useVetoStore = create((set, get) => ({
  // Tickets
  tickets: DEMO_TICKETS,
  activeTicketId: 'TK-001',
  filter: 'all',

  // Composer
  draft: '',

  // VETO overlay
  overlayVisible: false,
  conflictData: null,

  // Memory trace log
  traceLog: [],

  // Actions
  setActiveTicket: (id) => set({ activeTicketId: id, draft: '', overlayVisible: false, conflictData: null, traceLog: [] }),
  setFilter: (filter) => set({ filter }),
  setDraft: (draft) => set({ draft }),
  setTickets: (updater) => set((state) => ({
    tickets: typeof updater === 'function' ? updater(state.tickets) : updater,
  })),

  showOverlay: (data) => set({ overlayVisible: true, conflictData: data }),
  hideOverlay: () => set({ overlayVisible: false, conflictData: null }),

  addTraceEntry: (entry) => set((s) => ({ traceLog: [...s.traceLog, { ...entry, ts: new Date().toLocaleTimeString('en-GB', { hour12: false }) }] })),
  clearTrace: () => set({ traceLog: [] }),

  useRecommended: () => {
    const { conflictData } = get();
    if (!conflictData) return;
    set({ draft: conflictData.recommended, overlayVisible: false });
  },

  override: () => set({ overlayVisible: false }),

  getActiveTicket: () => {
    const { tickets, activeTicketId } = get();
    return tickets.find((t) => t.id === activeTicketId) || null;
  },

  getFilteredTickets: () => {
    const { tickets, filter } = get();
    if (filter === 'all') return tickets;
    return tickets.filter((t) => t.status === filter);
  },
}));
