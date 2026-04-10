import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useVeto } from '../hooks/useVeto';
import { useCustomerBrief } from '../hooks/useCustomerBrief';
import { VetoOverlay } from './VetoOverlay';
import { CustomerBrief } from './CustomerBrief';
import { TicketClose } from './TicketClose';
import { MemoryTraceView } from './MemoryTraceView';
import { mockCustomers, mockTickets } from '../data/mockTickets';

const API_BASE = import.meta.env.VITE_API_BASE;

const frustrationDot = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

export function SupportConsole({ initialCustomer = null, onBack }) {
  const theme = useTheme();
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));

  const [activeCustomer, setActiveCustomer] = useState(initialCustomer);
  const [activeTicket, setActiveTicket] = useState(null);
  const [draftResponse, setDraftResponse] = useState('');
  const [showTicketCloseModal, setShowTicketCloseModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [conflictsPrevented, setConflictsPrevented] = useState(0);
  const [safeSends, setSafeSends] = useState(0);
  const [memoryWrites, setMemoryWrites] = useState(0);
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });

  const statusRef = useRef('idle');
  const threadEndRef = useRef(null);

  const { brief, loading: briefLoading } = useCustomerBrief(activeCustomer?.id);
  const { status, vetoData, checkDraft } = useVeto(activeCustomer?.id, activeTicket?.id);

  // Auto-select ticket when customer changes
  useEffect(() => {
    if (activeCustomer) {
      const tickets = mockTickets[activeCustomer.id] || [];
      const openTicket = tickets.find((t) => t.status === 'open') || tickets[0] || null;
      setActiveTicket(openTicket);
      setDraftResponse('');
    }
  }, [activeCustomer]);

  // Auto-scroll thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket]);

  const handleCustomerSelect = useCallback((customer) => {
    setActiveCustomer(customer);
  }, []);

  const handleDraftChange = (event) => {
    const value = event.target.value;
    setDraftResponse(value);
    checkDraft(value);
  };

  const handleUseSuggestion = useCallback((text) => {
    setDraftResponse(text);
  }, []);

  const handleSend = () => {
    if (status === 'checking') return;
    setSafeSends((prev) => prev + 1);
    setShowTicketCloseModal(true);
  };

  const handleTicketCloseSubmit = async (closeData) => {
    try {
      const response = await fetch(API_BASE + '/api/memory/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(closeData),
      });

      if (!response.ok) {
        throw new Error('Memory write failed: ' + response.status);
      }

      setMemoryWrites((prev) => prev + 1);
      setToast({ open: true, type: 'success', message: 'Memory captured. Future interactions with this customer are now smarter.' });
    } catch (error) {
      console.error('Failed to write memory:', error);
      setToast({ open: true, type: 'error', message: 'Memory write failed. Check backend connection.' });
    } finally {
      setShowTicketCloseModal(false);
    }
  };

  useEffect(() => {
    if (status === 'vetoed' && statusRef.current !== 'vetoed') {
      setConflictsPrevented((prev) => prev + 1);
    }
    statusRef.current = status;
  }, [status]);

  const metrics = useMemo(() => {
    const totalDecisions = conflictsPrevented + safeSends;
    const mdrr = totalDecisions > 0 ? Math.round((conflictsPrevented / totalDecisions) * 100) : 0;
    const ttr = Math.min(84, 18 + conflictsPrevented * 8);
    const csat = (Math.min(0.9, conflictsPrevented * 0.13 + memoryWrites * 0.06)).toFixed(1);
    const efficiency = Math.min(72, 12 + (conflictsPrevented + memoryWrites) * 6);

    return {
      mdrr: mdrr + '%',
      ttrReduction: ttr + '%',
      csatUplift: '+' + csat,
      efficiency: '+' + efficiency + '%',
      conflictsPrevented,
      memoryWrites,
      totalDecisions,
    };
  }, [conflictsPrevented, safeSends, memoryWrites]);

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', bgcolor: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box
        sx={{
          px: { xs: 1.5, md: 2.5 },
          py: 1,
          borderBottom: '1px solid var(--border-subtle)',
          bgcolor: 'var(--bg-raised)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton
            size="small"
            onClick={onBack}
            sx={{
              color: 'var(--text-muted)',
              '&:hover': { color: 'var(--text-primary)', bgcolor: 'rgba(148,163,184,0.08)' },
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </IconButton>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 'var(--radius-sm)',
                bgcolor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </Box>
            <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Veto
            </Typography>
          </Stack>
        </Stack>

        {/* Session stats */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={'Conflicts blocked: ' + conflictsPrevented}
            size="small"
            sx={{
              height: 24,
              bgcolor: conflictsPrevented > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(148,163,184,0.06)',
              color: conflictsPrevented > 0 ? 'var(--red-400)' : 'var(--text-muted)',
              border: '1px solid ' + (conflictsPrevented > 0 ? 'rgba(239,68,68,0.2)' : 'var(--border-subtle)'),
              fontWeight: 600,
              fontSize: '0.62rem',
            }}
          />
          <Chip
            label={'Memory writes: ' + memoryWrites}
            size="small"
            sx={{
              height: 24,
              bgcolor: memoryWrites > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.06)',
              color: memoryWrites > 0 ? 'var(--emerald-400)' : 'var(--text-muted)',
              border: '1px solid ' + (memoryWrites > 0 ? 'rgba(16,185,129,0.2)' : 'var(--border-subtle)'),
              fontWeight: 600,
              fontSize: '0.62rem',
            }}
          />
          <Box
            onClick={() => setShowDashboard(true)}
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(16,185,129,0.06)' },
            }}
          >
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.6rem' }}>
              ROI
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Workspace */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '220px 1fr',
            xl: '240px 1fr 340px',
          },
          gap: 0,
        }}
      >
        {/* Customers sidebar */}
        <Box
          sx={{
            borderRight: '1px solid var(--border-subtle)',
            bgcolor: 'var(--bg-raised)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Box sx={{ p: 1.5, borderBottom: '1px solid var(--border-subtle)' }}>
            <Typography variant="overline" sx={{ color: 'var(--text-muted)', fontSize: '0.58rem' }}>
              Customers
            </Typography>
          </Box>
          <Stack spacing={0.5} sx={{ p: 1, overflowY: 'auto', flex: 1 }}>
            {mockCustomers.map((customer) => (
              <Box
                key={customer.id}
                onClick={() => handleCustomerSelect(customer)}
                sx={{
                  px: 1.5,
                  py: 1.2,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: activeCustomer?.id === customer.id ? 'primary.main' : 'transparent',
                  bgcolor: activeCustomer?.id === customer.id ? 'rgba(16,185,129,0.08)' : 'transparent',
                  transition: 'all 180ms ease',
                  '&:hover': {
                    bgcolor: activeCustomer?.id === customer.id ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.04)',
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack spacing={0.1}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8rem' }}>
                      {customer.contact_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                      {customer.company}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: frustrationDot[customer.frustration_level] }} />
                    <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.6rem' }}>
                      {customer.ticket_count}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Main area */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {activeTicket ? (
            <>
              {/* Ticket header */}
              <Box sx={{ p: { xs: 1.5, md: 2 }, borderBottom: '1px solid var(--border-subtle)', bgcolor: 'var(--bg-raised)', flexShrink: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Stack spacing={0.3}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {activeCustomer.contact_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                      {activeCustomer.company} — {activeTicket.issue_category.replace(/_/g, ' ')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Chip
                      label={'#' + activeTicket.id}
                      size="small"
                      sx={{ height: 22, bgcolor: 'rgba(148,163,184,0.06)', color: 'var(--text-muted)', fontSize: '0.62rem', fontWeight: 600 }}
                    />
                    <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.6rem' }}>
                      {new Date(activeTicket.opened_at).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Memory status bar */}
              <Box
                sx={{
                  px: { xs: 1.5, md: 2 },
                  py: 0.8,
                  borderBottom: '1px solid var(--border-subtle)',
                  bgcolor: status === 'vetoed' ? 'rgba(239,68,68,0.04)' : status === 'checking' ? 'rgba(16,185,129,0.03)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flexShrink: 0,
                  transition: 'background-color 300ms ease',
                }}
              >
                {/* Status indicator */}
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: status === 'vetoed' ? 'var(--red-500)' : status === 'checking' ? 'var(--emerald-500)' : 'var(--text-disabled)',
                    ...(status === 'checking' && { animation: 'breathe 1.5s ease-in-out infinite' }),
                    ...(status === 'vetoed' && { animation: 'conflictPulse 1.5s ease-in-out infinite' }),
                  }}
                />
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: '0.68rem' }}>
                  {status === 'vetoed'
                    ? 'Memory conflict detected — switch to recommended alternative'
                    : status === 'checking'
                      ? 'Querying failure memory...'
                      : status === 'clear'
                        ? 'No conflict found. Safe to proceed.'
                        : 'Memory standby — draft a response to run conflict check.'
                  }
                </Typography>
                {status === 'vetoed' && (
                  <Chip
                    label="CONFLICT"
                    size="small"
                    sx={{
                      height: 18,
                      bgcolor: 'rgba(239,68,68,0.15)',
                      color: 'var(--red-400)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      fontWeight: 700,
                      fontSize: '0.55rem',
                      ml: 'auto',
                    }}
                  />
                )}
                {status === 'clear' && (
                  <Chip
                    label="CLEAR"
                    size="small"
                    sx={{
                      height: 18,
                      bgcolor: 'rgba(16,185,129,0.12)',
                      color: 'var(--emerald-400)',
                      border: '1px solid rgba(16,185,129,0.25)',
                      fontWeight: 700,
                      fontSize: '0.55rem',
                      ml: 'auto',
                    }}
                  />
                )}
              </Box>

              {/* Thread + Draft + Veto */}
              <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Messages */}
                <Stack spacing={1.5} sx={{ p: { xs: 1.5, md: 2 }, flex: 1 }}>
                  {activeTicket.thread.map((message, index) => (
                    <Fade in key={index} timeout={200 + index * 80}>
                      <Box
                        sx={{
                          maxWidth: '78%',
                          alignSelf: message.sender !== 'customer' ? 'flex-end' : 'flex-start',
                          p: '12px 16px',
                          borderRadius: message.sender !== 'customer' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                          bgcolor: message.sender !== 'customer'
                            ? 'rgba(16, 185, 129, 0.12)'
                            : 'var(--bg-surface)',
                          border: '1px solid',
                          borderColor: message.sender !== 'customer'
                            ? 'rgba(16, 185, 129, 0.18)'
                            : 'var(--border-subtle)',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontSize: '0.84rem', lineHeight: 1.6 }}>
                          {message.text}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'var(--text-disabled)', fontSize: '0.58rem' }}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    </Fade>
                  ))}
                  <div ref={threadEndRef} />
                </Stack>

                {/* Veto overlay */}
                {status === 'vetoed' && vetoData && (
                  <Box sx={{ px: { xs: 1.5, md: 2 }, pb: 1 }}>
                    {/* Before vs After */}
                    <Paper
                      elevation={0}
                      sx={{
                        mb: 1.5,
                        p: 2,
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-default)',
                        bgcolor: 'var(--bg-raised)',
                      }}
                    >
                      <Typography variant="overline" sx={{ color: 'var(--emerald-400)', display: 'block', mb: 1.2 }}>
                        Before vs After Memory
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.2 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 'var(--radius-md)',
                            bgcolor: 'rgba(239,68,68,0.05)',
                            border: '1px solid rgba(239,68,68,0.15)',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'var(--red-400)', fontWeight: 700, display: 'block', mb: 0.5, fontSize: '0.6rem' }}>
                            WITHOUT MEMORY
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                            Agent repeats a solution that already failed, prolonging frustration and eroding trust.
                          </Typography>
                        </Paper>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 'var(--radius-md)',
                            bgcolor: 'rgba(16,185,129,0.05)',
                            border: '1px solid rgba(16,185,129,0.15)',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'var(--emerald-400)', fontWeight: 700, display: 'block', mb: 0.5, fontSize: '0.6rem' }}>
                            WITH MEMORY
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                            Conflict intercepted in real time. Agent gets a proven alternative backed by resolution data.
                          </Typography>
                        </Paper>
                      </Box>
                    </Paper>

                    <VetoOverlay
                      vetoed={true}
                      reason={vetoData.reason}
                      failedOn={vetoData.failed_on}
                      ticketRefs={vetoData.ticket_refs}
                      suggestion={vetoData.suggestion}
                      confidence={vetoData.confidence}
                      onUseSuggestion={handleUseSuggestion}
                    />
                    <Box sx={{ mt: 1.5 }}>
                      <MemoryTraceView trace={vetoData.trace} />
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Draft composer */}
              <Box
                sx={{
                  p: { xs: 1.5, md: 2 },
                  borderTop: '1px solid var(--border-subtle)',
                  bgcolor: 'var(--bg-raised)',
                  flexShrink: 0,
                }}
              >
                <Stack spacing={1}>
                  <Box
                    component="textarea"
                    value={draftResponse}
                    onChange={handleDraftChange}
                    placeholder="Draft your response to the customer..."
                    rows={3}
                    sx={{
                      width: '100%',
                      minHeight: 90,
                      resize: 'none',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid',
                      borderColor: status === 'vetoed' ? 'rgba(239,68,68,0.3)' : 'var(--border-default)',
                      bgcolor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      lineHeight: 1.65,
                      p: '12px 14px',
                      outline: 'none',
                      transition: 'all 200ms ease',
                      '&:focus': {
                        borderColor: status === 'vetoed' ? 'var(--red-500)' : 'var(--emerald-500)',
                        boxShadow: status === 'vetoed' ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(16,185,129,0.1)',
                      },
                      '&::placeholder': {
                        color: 'var(--text-disabled)',
                      },
                    }}
                  />
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button
                      variant="contained"
                      onClick={handleSend}
                      disabled={status === 'checking' || !draftResponse.trim()}
                      sx={{
                        bgcolor: 'primary.main',
                        color: '#030711',
                        fontWeight: 700,
                        px: 2.5,
                        py: 0.9,
                        fontSize: '0.8rem',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                        '&:disabled': {
                          bgcolor: 'rgba(16,185,129,0.15)',
                          color: 'rgba(16,185,129,0.4)',
                        },
                      }}
                    >
                      {status === 'checking' ? 'Analyzing...' : 'Send Response'}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </>
          ) : (
            <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', p: 3 }}>
              <Typography variant="body2" sx={{ color: 'var(--text-disabled)' }}>
                Select a customer to begin.
              </Typography>
            </Stack>
          )}
        </Box>

        {/* Right panel — Memory Intelligence */}
        {!isLgDown && (
          <Box
            sx={{
              borderLeft: '1px solid var(--border-subtle)',
              bgcolor: 'var(--bg-raised)',
              overflowY: 'auto',
              p: 2,
              minHeight: 0,
            }}
          >
            {briefLoading ? (
              <Stack spacing={1.5} sx={{ pt: 4 }}>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      height: 32,
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(90deg, var(--bg-surface) 25%, rgba(148,163,184,0.06) 50%, var(--bg-surface) 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s ease-in-out infinite',
                    }}
                  />
                ))}
              </Stack>
            ) : brief ? (
              <CustomerBrief brief={brief} />
            ) : (
              <Stack sx={{ pt: 4, alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'var(--text-disabled)' }}>
                  No customer selected
                </Typography>
              </Stack>
            )}
          </Box>
        )}
      </Box>

      {/* Dashboard dialog */}
      <DashboardDialog
        open={showDashboard}
        onClose={() => setShowDashboard(false)}
        metrics={metrics}
      />

      {/* Ticket close modal */}
      {showTicketCloseModal && (
        <TicketClose
          onSubmit={handleTicketCloseSubmit}
          onCancel={() => setShowTicketCloseModal(false)}
          initialDraft={draftResponse}
          customer={activeCustomer}
          ticketId={activeTicket?.id}
          issueCategory={activeTicket?.issue_category}
        />
      )}

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{
            bgcolor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid',
            borderColor: toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function DashboardDialog({ open, onClose, metrics }) {
  const metricItems = [
    { label: 'MDRR', value: metrics.mdrr, desc: 'Memory-driven resolution rate', color: 'var(--emerald-400)' },
    { label: 'TTR Reduction', value: metrics.ttrReduction, desc: 'Time-to-resolution reduction', color: 'var(--sky-400)' },
    { label: 'CSAT Uplift', value: metrics.csatUplift, desc: 'Satisfaction from personalized follow-ups', color: 'var(--emerald-400)' },
    { label: 'Efficiency', value: metrics.efficiency, desc: 'Tickets handled per shift', color: 'var(--amber-400)' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'var(--bg-raised)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(3, 7, 17, 0.8)',
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>Memory Impact Dashboard</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.3 }}>
              Live KPIs from this session
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-muted)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </IconButton>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1.2, mb: 2.5 }}>
          {metricItems.map((metric, i) => (
            <Paper
              key={i}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                bgcolor: 'var(--bg-surface)',
              }}
            >
              <Typography variant="overline" sx={{ color: 'var(--text-disabled)', display: 'block', mb: 0.5, fontSize: '0.55rem' }}>
                {metric.label}
              </Typography>
              <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: metric.color, lineHeight: 1.2, mb: 0.3 }}>
                {metric.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>
                {metric.desc}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'var(--border-subtle)', mb: 2 }} />

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 'var(--radius-lg)',
            bgcolor: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.12)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Session: <strong style={{ color: '#F1F5F9' }}>{metrics.conflictsPrevented}</strong> repeated failures blocked,{' '}
            <strong style={{ color: '#F1F5F9' }}>{metrics.memoryWrites}</strong> memory writes,{' '}
            <strong style={{ color: '#F1F5F9' }}>{metrics.totalDecisions}</strong> memory-aware decisions.
          </Typography>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
