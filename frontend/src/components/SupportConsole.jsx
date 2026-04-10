import React, { useState, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Fade from '@mui/material/Fade';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
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

export function SupportConsole() {
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [draftResponse, setDraftResponse] = useState('');
  const [showTicketCloseModal, setShowTicketCloseModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

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
  }, []);

  const handleCloseTicket = () => setShowTicketCloseModal(true);

  const handleTicketCloseSubmit = (closeData) => {
    setShowTicketCloseModal(false);
  };

  const metrics = useMemo(() => ({
    mdrr: '42%',
    ttr_reduction: '61%',
    csat_uplift: '+0.3',
    efficiency: '+38%',
  }), []);

  const metricItems = [
    { label: 'MDRR', value: metrics.mdrr, desc: 'Memory-Driven Resolution Rate', icon: <InsightsIcon /> },
    { label: 'TTR Reduction', value: metrics.ttr_reduction, desc: 'Avg. Time-to-Resolution', icon: <TrendingDownIcon /> },
    { label: 'CSAT Uplift', value: metrics.csat_uplift, desc: 'Customer Satisfaction Index', icon: <TrendingUpIcon /> },
    { label: 'Efficiency', value: metrics.efficiency, desc: 'Tickets per Agent/Shift', icon: <SpeedIcon /> },
  ];

  if (!activeCustomer) {
    return (
      <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', px: 4 }}>
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
          </Stack>

          <Stack spacing={1} sx={{ width: '100%' }}>
            {mockCustomers.map(customer => (
              <CustomerCard
                key={customer.id}
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
            ))}
          </Stack>
        </Stack>

        <DashboardDialog open={showDashboard} onClose={() => setShowDashboard(false)} metrics={metricItems} />
      </Stack>
    );
  }

  return (
    <Stack direction="row" sx={{ height: '100%' }}>
      {/* Sidebar */}
      <SidebarContainer>
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
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeTicket ? (
          <>
            {/* Ticket Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack>
                  <Typography variant="h3">{activeCustomer.contact_name}</Typography>
                  <Typography variant="body2" color="text.secondary">{activeCustomer.company}</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip label={`#${activeTicket.id}`} size="small" sx={{ bgcolor: 'grey.700', color: 'text.secondary', fontSize: '0.7rem' }} />
                  <Chip label={activeTicket.issue_category.replace(/_/g, ' ')} size="small" variant="outlined" sx={{ borderColor: 'divider', color: 'text.secondary', fontSize: '0.7rem', textTransform: 'capitalize' }} />
                  <Typography variant="overline" color="text.disabled">
                    {new Date(activeTicket.opened_at).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Thread */}
            <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
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
            <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={1.5}>
                <DraftTextarea
                  value={draftResponse}
                  onChange={handleDraftChange}
                  placeholder="Type your response..."
                  rows={4}
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
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
              <Box sx={{ p: 3, pt: 0, maxHeight: '50vh', overflowY: 'auto' }}>
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
            )}
          </>
        ) : (
          <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" color="text.disabled">Select a customer and ticket to view details</Typography>
          </Stack>
        )}
      </Box>

      {/* Right Column */}
      <Box sx={{ width: 360, borderLeft: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflowY: 'auto', p: 2.5 }}>
        {briefLoading ? (
          <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', pt: 5 }}>Loading customer brief...</Typography>
        ) : brief ? (
          <CustomerBrief brief={brief} />
        ) : (
          <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', pt: 5 }}>No customer selected</Typography>
        )}
      </Box>

      {/* Modals */}
      <DashboardDialog open={showDashboard} onClose={() => setShowDashboard(false)} metrics={metricItems} />

      {showTicketCloseModal && (
        <TicketClose
          onSubmit={handleTicketCloseSubmit}
          onCancel={() => setShowTicketCloseModal(false)}
          initialDraft={draftResponse}
          customer={activeCustomer}
        />
      )}
    </Stack>
  );
}

function DashboardDialog({ open, onClose, metrics }) {
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
            By leveraging the <strong>Unified Failure Memory</strong>, the support organization is preventing approximately <strong>1,200 redundant interactions per month</strong>, directly reducing churn risk for Enterprise accounts.
          </Typography>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}