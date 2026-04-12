import { create } from 'zustand';

/**
 * VETO Dashboard Store (Zustand)
 * Centralized state for the 3-panel dashboard: SupportConsole, CustomerBrief, VetoOverlay
 */
const useDashboardStore = create((set, get) => ({
  // ── Customer & Ticket Selection ──
  selectedCustomerId: null,
  selectedTicketId: null,
  
  selectCustomer: (customerId) => set({
    selectedCustomerId: customerId,
    selectedTicketId: null,
    vetoStatus: 'idle',
    vetoData: null,
    draftText: '',
    memoryTraces: [],
  }),
  
  selectTicket: (ticketId) => set({
    selectedTicketId: ticketId,
    vetoStatus: 'idle',
    vetoData: null,
    draftText: '',
  }),

  // ── Draft Compose ──
  draftText: '',
  setDraftText: (text) => set({ draftText: text }),

  // ── VETO Status ──
  vetoStatus: 'idle', // idle | checking | vetoed | clear
  vetoData: null,
  
  setVetoResult: (status, data = null) => set({
    vetoStatus: status,
    vetoData: data,
  }),

  // ── Memory Traces ──
  memoryTraces: [],
  addMemoryTrace: (trace) => set((state) => ({
    memoryTraces: [...state.memoryTraces, { ...trace, timestamp: Date.now() }],
  })),
  clearMemoryTraces: () => set({ memoryTraces: [] }),

  // ── Ticket Close / Resolution ──
  ticketCloseOpen: false,
  openTicketClose: () => set({ ticketCloseOpen: true }),
  closeTicketClose: () => set({ ticketCloseOpen: false }),
  
  // ── Notification / Toast ──
  notification: null,
  showNotification: (message, severity = 'info') => {
    set({ notification: { message, severity, id: Date.now() } });
    setTimeout(() => set({ notification: null }), 4000);
  },

  // ── Loading States ──
  isCheckingVeto: false,
  isSavingMemory: false,
  setIsCheckingVeto: (val) => set({ isCheckingVeto: val }),
  setIsSavingMemory: (val) => set({ isSavingMemory: val }),
}));

export default useDashboardStore;
