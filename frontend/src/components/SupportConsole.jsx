import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useVeto } from '../hooks/useVeto';
import { useCustomerBrief } from '../hooks/useCustomerBrief';
import { VetoOverlay } from './VetoOverlay';
import { CustomerBrief } from './CustomerBrief';
import { TicketClose } from './TicketClose';
import { MemoryTraceView } from './MemoryTraceView';
import { mockCustomers, mockTickets } from '../data/mockTickets';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 300,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const CustomerCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isActive }) => ({
  padding: '14px 16px',
  cursor: 'pointer',
  borderRadius: '10px',
  border: `1px solid ${isActive ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: isActive ? 'rgba(196, 149, 106, 0.08)' : 'transparent',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: isActive ? 'rgba(196, 149, 106, 0.08)' : theme.palette.grey[700],
    borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
  },
}));

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isAgent',
})(({ theme, isAgent }) => ({
  padding: '14px 18px',
  borderRadius: isAgent ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
  maxWidth: '72%',
  alignSelf: isAgent ? 'flex-end' : 'flex-start',
  backgroundColor: isAgent ? theme.palette.primary.dark : theme.palette.grey[700],
  color: isAgent ? theme.palette.grey[50] : theme.palette.text.primary,
  border: isAgent ? 'none' : `1px solid ${theme.palette.divider}`,
  boxShadow: isAgent ? '0 2px 8px rgba(196, 149, 106, 0.15)' : 'none',
}));

const DraftTextarea = styled('textarea')(({ theme }) => ({
  width: '100%',
  padding: '16px',
  backgroundColor: theme.palette.grey[700],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: '0.9375rem',
  lineHeight: 1.6,
  resize: 'none',
  minHeight: 130,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  outline: 'none',
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px rgba(196, 149, 106, 0.12)`,
  },
  '&::placeholder': {
    color: theme.palette.text.disabled,
  },
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: '28px 24px',
  borderRadius: '14px',
  backgroundColor: theme.palette.grey[700],
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
}));

const frustrationColors = {
  high: '#D94F4F',
  medium: '#E5A84B',
  low: '#4CAF7D',
};

const API_BASE = import.meta.env.VITE_API_BASE;

export function SupportConsole() {
  const theme = useTheme();
  const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [draftResponse, setDraftResponse] = useState('');
  const [showTicketCloseModal, setShowTicketCloseModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [memoryWins, setMemoryWins] = useState(0);
  const [conflictsPrevented, setConflictsPrevented] = useState(0);
  const [safeSends, setSafeSends] = useState(0);
  const [demoStep, setDemoStep] = useState(1);
  const [showWinToast, setShowWinToast] = useState(false);
  const lastStatusRef = useRef('idle');

  const { brief, loading: briefLoading } = useCustomerBrief(activeCustomer?.id);
  const { status, vetoData, checkDraft } = useVeto(activeCustomer?.id, activeTicket?.id);

  const handleCustomerSelect = useCallback((customer) => {
    setActiveCustomer(customer);
    const customerTickets = mockTickets[customer.id] || [];
    const openTicket = customerTickets.find(t => t.status === 'open') || customerTickets[0];
    setActiveTicket(openTicket || null);
    setDraftResponse('');
  }, []);

  const handleDraftChange = (e) => {
    const value = e.target.value;
    setDraftResponse(value);
    checkDraft(value);
  };

  const handleUseSuggestion = useCallback((text) => {
    setDraftResponse(text);
    setDemoStep(3);
  }, []);

  const handleCloseTicket = () => {
    if (status === 'clear') {
      setSafeSends(prev => prev + 1);
    }
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

      setMemoryWins(prev => prev + 1);
      setDemoStep(4);
      setShowWinToast(true);
    } catch (error) {
      console.error('Failed to write memory:', error);
    } finally {
      setShowTicketCloseModal(false);
    }
  };

  useEffect(() => {
    if (status === 'vetoed' && lastStatusRef.current !== 'vetoed') {
      setConflictsPrevented(prev => prev + 1);
      setDemoStep(2);
    }
    if (status === 'checking' && demoStep < 2) {
      setDemoStep(1);
    }
    if (status === 'clear' && draftResponse.trim()) {
      setDemoStep(prev => (prev < 3 ? 3 : prev));
    }
    lastStatusRef.current = status;
  }, [status, draftResponse, demoStep]);

  const metrics = useMemo(() => {
    const totalDecisions = conflictsPrevented + safeSends;
    const mdrrValue = totalDecisions > 0
      ? Math.round((conflictsPrevented / totalDecisions) * 100)
      : 0;
    const ttrReduction = Math.min(85, 20 + conflictsPrevented * 9);
    const csatUplift = (Math.min(0.9, conflictsPrevented * 0.15 + memoryWins * 0.05)).toFixed(1);
    const efficiencyGain = Math.min(70, 10 + (conflictsPrevented + memoryWins) * 7);

    return {
      mdrr: `${mdrrValue}%`,
      ttr_reduction: `${ttrReduction}%`,
      csat_uplift: `+${csatUplift}`,
      efficiency: `+${efficiencyGain}%`,
    };
  }, [conflictsPrevented, safeSends, memoryWins]);

  const metricItems = [
    { label: 'MDRR', value: metrics.mdrr, desc: 'Memory-Driven Resolution Rate', icon: <InsightsIcon /> },
    { label: 'TTR Reduction', value: metrics.ttr_reduction, desc: 'Avg. Time-to-Resolution', icon: <TrendingDownIcon /> },
    { label: 'CSAT Uplift', value: metrics.csat_uplift, desc: 'Customer Satisfaction Index', icon: <TrendingUpIcon /> },
    { label: 'Efficiency', value: metrics.efficiency, desc: 'Tickets per Agent/Shift', icon: <SpeedIcon /> },
  ];
  const sessionStats = {
    conflictsPrevented,
    memoryWins,
    safeSends,
    totalDecisions: conflictsPrevented + safeSends,
  };

  if (!activeCustomer) {
    return (
      <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 4 }, py: 3 }}>
        <Stack spacing={4} sx={{ maxWidth: 640, width: '100%', alignItems: 'center' }}>
          <Paper
            onClick={() => setShowDashboard(true)}
            sx={{
              width: '100%',
              p: 2,
              cursor: 'pointer',
              bgcolor: 'grey.700',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.dark', bgcolor: 'rgba(196,149,106,0.06)' },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="caption" color="primary.main">
                View Memory ROI Dashboard →
              </Typography>
              <Stack direction="row" spacing={2}>
                {Object.entries({ MDRR: metrics.mdrr, TTR: metrics.ttr_reduction, CSAT: metrics.csat_uplift }).map(([k, v]) => (
                  <Typography key={k} variant="overline" color="text.secondary">
                    {k}: {v}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Stack spacing={1.5} sx={{ textAlign: 'center' }}>
            <Typography variant="h1" sx={{ background: 'linear-gradient(135deg, #E8E4DF 0%, #C4956A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Veto
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select a customer to begin intercepting redundant solutions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
              This demo shows the before-and-after moment: generic support repeats failed steps, memory-driven support pivots instantly.
            </Typography>
          </Stack>

          <Stack spacing={1} sx={{ width: '100%' }}>
            {mockCustomers.map((customer, index) => (
              <Grow in key={customer.id} timeout={220 + index * 90}>
                <CustomerCard
                  isActive={false}
                  onClick={() => handleCustomerSelect(customer)}
                  elevation={0}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack>
                      <Typography variant="subtitle2" color="text.primary">
                        {customer.contact_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.company}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FiberManualRecordIcon sx={{ fontSize: 10, color: frustrationColors[customer.frustration_level], filter: `drop-shadow(0 0 4px ${frustrationColors[customer.frustration_level]})` }} />
                      <Chip label={customer.ticket_count} size="small" sx={{ height: 22, fontSize: '0.7rem', bgcolor: 'grey.600', color: 'text.secondary' }} />
                    </Stack>
                  </Stack>
                </CustomerCard>
              </Grow>
            ))}
          </Stack>
        </Stack>

        <DashboardDialog open={showDashboard} onClose={() => setShowDashboard(false)} metrics={metricItems} sessionStats={sessionStats} />
      </Stack>
    );
  }

  return (
    <Stack direction={isMdDown ? 'column' : 'row'} sx={{ height: '100%' }}>
      {/* Sidebar */}
      <SidebarContainer
        sx={{
          width: isMdDown ? '100%' : isLgDown ? 260 : 300,
          borderRight: isMdDown ? 'none' : '1px solid',
          borderBottom: isMdDown ? '1px solid' : 'none',
          borderColor: 'divider',
          maxHeight: isMdDown ? 260 : 'none',
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" color="text.disabled" sx={{ mb: 0 }}>
              Customers
            </Typography>
            <Chip
              label="ROI"
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => setShowDashboard(true)}
              sx={{ height: 24, fontSize: '0.65rem', cursor: 'pointer' }}
            />
          </Stack>
        </Box>
        <Stack spacing={0.5} sx={{ p: 1.5, flex: 1, overflowY: 'auto' }}>
          {mockCustomers.map(customer => (
            <CustomerCard
              key={customer.id}
              isActive={activeCustomer?.id === customer.id}
              onClick={() => handleCustomerSelect(customer)}
              elevation={0}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack>
                  <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600 }}>
                    {customer.contact_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {customer.company}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FiberManualRecordIcon sx={{ fontSize: 9, color: frustrationColors[customer.frustration_level], filter: `drop-shadow(0 0 4px ${frustrationColors[customer.frustration_level]})` }} />
                  <Chip label={customer.ticket_count} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'grey.600', color: 'text.secondary', minWidth: 28 }} />
                </Stack>
              </Stack>
            </CustomerCard>
          ))}
        </Stack>
      </SidebarContainer>

      {/* Center Column */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {activeTicket ? (
          <>
            <Paper
              elevation={0}
              sx={{
                mx: { xs: 2, md: 3 },
                mt: { xs: 2, md: 2.5 },
                p: { xs: 1.5, md: 2 },
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'rgba(196,149,106,0.06)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                <Stack>
                  <Typography variant="overline" color="primary.main" sx={{ lineHeight: 1.2 }}>
                    60-Second Demo Script
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                    {demoStep === 1 && 'Step 1: Type a known failed solution to trigger memory check.'}
                    {demoStep === 2 && 'Step 2: Conflict detected. Show how memory blocks repeated failure.'}
                    {demoStep === 3 && 'Step 3: Apply memory-backed alternative and send response.'}
                    {demoStep >= 4 && 'Step 4: Close ticket and store the outcome to strengthen memory.'}
                  </Typography>
                </Stack>
                <Chip
                  label={`STEP ${Math.min(demoStep, 4)} / 4`}
                  size="small"
                  sx={{ bgcolor: 'primary.main', color: 'background.default', fontWeight: 700 }}
                />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(Math.min(demoStep, 4) / 4) * 100}
                sx={{
                  mt: 1.2,
                  height: 7,
                  borderRadius: 8,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main',
                  },
                }}
              />
            </Paper>

            {/* Ticket Header */}
            <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack>
                  <Typography variant="h3">{activeCustomer.contact_name}</Typography>
                  <Typography variant="body2" color="text.secondary">{activeCustomer.company}</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <Chip label={`#${activeTicket.id}`} size="small" sx={{ bgcolor: 'grey.700', color: 'text.secondary', fontSize: '0.7rem' }} />
                  <Chip label={activeTicket.issue_category.replace(/_/g, ' ')} size="small" variant="outlined" sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '0.7rem', textTransform: 'capitalize' }} />
                  <Typography variant="overline" color="text.disabled">
                    {new Date(activeTicket.opened_at).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Thread */}
            <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
              {activeTicket.thread.map((msg, index) => (
                <Fade in key={index} timeout={300 + index * 100}>
                  <MessageBubble isAgent={msg.sender !== 'customer'} elevation={0}>
                    <Typography variant="body1">{msg.text}</Typography>
                    <Typography variant="overline" sx={{ mt: 1, display: 'block', textAlign: 'right', opacity: 0.5, fontSize: '0.6rem' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </MessageBubble>
                </Fade>
              ))}
            </Stack>

            {/* Draft Area */}
            <Box sx={{ p: { xs: 2, md: 3 }, borderTop: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={1.5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: status === 'vetoed' ? 'error.dark' : 'divider',
                    bgcolor: status === 'vetoed' ? 'rgba(217,79,79,0.08)' : 'rgba(196,149,106,0.06)',
                    transition: 'all 220ms ease',
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <AutoAwesomeIcon sx={{ color: status === 'vetoed' ? 'error.main' : 'primary.main', fontSize: 18 }} />
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                      {status === 'vetoed'
                        ? 'Memory caught a repeated failed solution. Use the suggested pivot below.'
                        : status === 'clear'
                          ? 'No failed-memory conflict detected. Safe to continue with this response.'
                          : 'Type your response to trigger real-time memory conflict detection.'}
                    </Typography>
                  </Stack>
                </Paper>

                <DraftTextarea
                  value={draftResponse}
                  onChange={handleDraftChange}
                  placeholder="Type your response..."
                  rows={4}
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1, flexWrap: 'wrap' }}>
                  <Box>
                    {status === 'checking' && (
                      <Typography variant="caption" color="primary.main" sx={{ animation: 'pulseGlow 1.5s infinite' }}>
                        Querying Failure Memory...
                      </Typography>
                    )}
                    {status === 'vetoed' && (
                      <Chip label="MEMORY CONFLICT DETECTED" size="small" sx={{ bgcolor: 'rgba(217,79,79,0.15)', color: 'error.main', border: '1px solid', borderColor: 'error.dark', fontWeight: 700, fontSize: '0.65rem' }} />
                    )}
                    {status === 'clear' && (
                      <Typography variant="caption" color="success.main">✓ Memory Clear</Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={`Conflicts Prevented: ${conflictsPrevented}`}
                      size="small"
                      sx={{ bgcolor: 'rgba(217,79,79,0.16)', color: 'error.main', border: '1px solid', borderColor: 'error.dark', fontSize: '0.65rem' }}
                    />
                    <Chip
                      label={`Memory Writes: ${memoryWins}`}
                      size="small"
                      sx={{ bgcolor: 'rgba(76,175,125,0.16)', color: 'success.main', border: '1px solid', borderColor: 'success.dark', fontSize: '0.65rem' }}
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    onClick={handleCloseTicket}
                    disabled={status === 'checking'}
                    endIcon={<SendIcon sx={{ fontSize: '16px !important' }} />}
                    sx={{ borderRadius: '10px', px: 3, py: 1.2 }}
                  >
                    {status === 'checking' ? 'Analyzing...' : 'Send Response'}
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {/* Veto + Trace */}
            {status === 'vetoed' && vetoData && (
              <Fade in timeout={260}>
                <Box sx={{ p: { xs: 2, md: 3 }, pt: 0, maxHeight: '50vh', overflowY: 'auto' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'grey.700',
                  }}
                >
                  <Typography variant="overline" color="primary.main" sx={{ display: 'block', mb: 1 }}>
                    Before vs After Memory
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
                    <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'error.dark', bgcolor: 'rgba(217,79,79,0.08)' }}>
                      <Typography variant="caption" color="error.main" sx={{ fontWeight: 700, display: 'block', mb: 0.6 }}>
                        WITHOUT MEMORY
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Agent repeats a previously failed step, increasing customer frustration and ticket churn.
                      </Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'success.dark', bgcolor: 'rgba(76,175,125,0.08)' }}>
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, display: 'block', mb: 0.6 }}>
                        WITH MEMORY
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Conflict is intercepted in real time and replaced with a higher-probability solution.
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
                <MemoryTraceView trace={vetoData.trace} />
                </Box>
              </Fade>
            )}
          </>
        ) : (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" color="text.disabled">Select a customer and ticket to view details</Typography>
          </Stack>
        )}
      </Box>

      {/* Right Column */}
      {!isMdDown && (
        <Box sx={{ width: 360, borderLeft: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflowY: 'auto', p: 2.5 }}>
        {briefLoading ? (
          <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', pt: 5 }}>Loading customer brief...</Typography>
        ) : brief ? (
          <CustomerBrief brief={brief} />
        ) : (
          <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', pt: 5 }}>No customer selected</Typography>
        )}
        </Box>
      )}

      {/* Modals */}
      <DashboardDialog open={showDashboard} onClose={() => setShowDashboard(false)} metrics={metricItems} sessionStats={sessionStats} />

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

      <Snackbar
        open={showWinToast}
        autoHideDuration={2300}
        onClose={() => setShowWinToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          onClose={() => setShowWinToast(false)}
          sx={{ bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'success.dark' }}
        >
          Memory saved successfully. Wins captured: {memoryWins}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

function DashboardDialog({ open, onClose, metrics, sessionStats }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid', borderColor: 'divider' } }}
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(8px)', bgcolor: 'rgba(11,15,21,0.85)' } } }}
    >
      <DialogContent sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h3">Memory Intelligence ROI</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 2.5, mb: 4 }}>
          {metrics.map((m, i) => (
            <MetricCard key={i} elevation={0}>
              <Box sx={{ color: 'primary.main', mb: 1.5 }}>{m.icon}</Box>
              <Typography variant="overline" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>{m.label}</Typography>
              <Typography variant="h2" color="primary.main" sx={{ fontWeight: 800, mb: 0.5 }}>{m.value}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{m.desc}</Typography>
            </MetricCard>
          ))}
        </Box>

        <Paper sx={{ p: 2.5, bgcolor: 'rgba(196,149,106,0.06)', borderRadius: '12px', borderLeft: '4px solid', borderLeftColor: 'primary.main', boxShadow: 'none' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Session impact: <strong>{sessionStats.conflictsPrevented}</strong> repeated failures prevented, <strong>{sessionStats.memoryWins}</strong> memories written,
            and <strong>{sessionStats.totalDecisions}</strong> memory-aware decisions made in this demo run.
          </Typography>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
