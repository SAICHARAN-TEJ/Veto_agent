import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function TicketClose({ onSubmit, onCancel, initialDraft, customer, ticketId, issueCategory }) {
  const [outcome, setOutcome] = useState('resolved');
  const [solutionUsed, setSolutionUsed] = useState(initialDraft || '');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [frustrationSignal, setFrustrationSignal] = useState('low');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);

    const memoryData = {
      customer_id: customer?.id,
      ticket_id: ticketId || 'unknown_ticket',
      solutions_attempted: [solutionUsed],
      outcome,
      issue_category: issueCategory || 'agent_resolution',
      resolution_notes: resolutionNotes,
      frustration_signal: frustrationSignal,
    };

    // Brief flash to show memory write animation
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(memoryData);
    }, 600);
  };

  if (submitted) {
    return (
      <Dialog
        open={true}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'var(--bg-raised)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(16,185,129,0.2)',
            overflow: 'hidden',
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(8px)',
              bgcolor: 'rgba(3,7,17,0.85)',
            },
          },
        }}
      >
        <DialogContent sx={{ p: 5, textAlign: 'center' }}>
          <Box
            className="animate-memory-write"
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'rgba(16,185,129,0.12)',
              border: '2px solid var(--emerald-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>
            Memory Written
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', maxWidth: 360, mx: 'auto', lineHeight: 1.7 }}>
            This resolution is now part of the corporate memory. Future interactions with{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{customer?.contact_name}</strong>{' '}
            will benefit from this context.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'var(--bg-raised)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-default)',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(3,7,17,0.85)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1rem',
          pb: 1,
          borderBottom: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
      >
        Capture Resolution — {customer?.contact_name}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Stack spacing={2.5}>
          {/* What gets written */}
          <Box
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 'var(--radius-md)',
              bgcolor: 'rgba(16,185,129,0.04)',
              border: '1px solid rgba(16,185,129,0.1)',
            }}
          >
            <Stack direction="row" spacing={0.8} alignItems="center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                This closing form writes to the corporate memory. Choose the outcome carefully — it shapes future conflict detection.
              </Typography>
            </Stack>
          </Box>

          {/* Outcome */}
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: 'var(--text-primary)',
                fontWeight: 600,
                mb: 1,
                fontSize: '0.85rem',
              }}
            >
              Resolution Outcome
            </FormLabel>
            <RadioGroup
              row
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              sx={{ '& .MuiFormControlLabel-root': { mr: 2.5 } }}
            >
              <FormControlLabel
                value="resolved"
                control={<Radio sx={{ color: 'var(--emerald-500)', '&.Mui-checked': { color: 'var(--emerald-500)' } }} />}
                label={<Typography variant="body2" sx={{ fontSize: '0.82rem' }}>Resolved</Typography>}
              />
              <FormControlLabel
                value="failed"
                control={<Radio sx={{ color: 'var(--red-500)', '&.Mui-checked': { color: 'var(--red-500)' } }} />}
                label={<Typography variant="body2" sx={{ fontSize: '0.82rem' }}>Failed</Typography>}
              />
              <FormControlLabel
                value="escalated"
                control={<Radio sx={{ color: 'var(--amber-500)', '&.Mui-checked': { color: 'var(--amber-500)' } }} />}
                label={<Typography variant="body2" sx={{ fontSize: '0.82rem' }}>Escalated</Typography>}
              />
            </RadioGroup>
          </FormControl>

          <Divider sx={{ borderColor: 'var(--border-subtle)' }} />

          {/* Solution Used */}
          <FormControl fullWidth>
            <FormLabel sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 0.8, fontSize: '0.85rem' }}>
              Solution Applied
            </FormLabel>
            <TextField
              multiline
              rows={2}
              value={solutionUsed}
              onChange={(e) => setSolutionUsed(e.target.value)}
              placeholder="What was tried..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  '& fieldset': { borderColor: 'var(--border-default)' },
                  '&:hover fieldset': { borderColor: 'var(--border-strong)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--emerald-500)' },
                },
              }}
            />
          </FormControl>

          {/* Resolution Notes */}
          <FormControl fullWidth>
            <FormLabel sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 0.8, fontSize: '0.85rem' }}>
              Notes
            </FormLabel>
            <TextField
              multiline
              rows={2}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Additional context..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  '& fieldset': { borderColor: 'var(--border-default)' },
                  '&:hover fieldset': { borderColor: 'var(--border-strong)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--emerald-500)' },
                },
              }}
            />
          </FormControl>

          <Divider sx={{ borderColor: 'var(--border-subtle)' }} />

          {/* Frustration Signal */}
          <FormControl fullWidth>
            <FormLabel sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
              Customer Frustration Signal
            </FormLabel>
            <RadioGroup
              row
              value={frustrationSignal}
              onChange={(e) => setFrustrationSignal(e.target.value)}
              sx={{ '& .MuiFormControlLabel-root': { mr: 2.5 } }}
            >
              <FormControlLabel
                value="low"
                control={<Radio sx={{ color: 'var(--emerald-500)', '&.Mui-checked': { color: 'var(--emerald-500)' } }} />}
                label={<Typography variant="body2" sx={{ fontSize: '0.82rem' }}>Low</Typography>}
              />
              <FormControlLabel
                value="medium"
                control={<Radio sx={{ color: 'var(--amber-500)', '&.Mui-checked': { color: 'var(--amber-500)' } }} />}
                label={<Typography variant="body2" sx={{ fontSize: '0.82rem' }}>Medium</Typography>}
              />
              <FormControlLabel
                value="high"
                control={<Radio sx={{ color: 'var(--red-500)', '&.Mui-checked': { color: 'var(--red-500)' } }} />}
                label={<Typography variant="body2" sx={{ fontSize: '0.82rem' }}>High</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: '1px solid var(--border-subtle)',
          gap: 1,
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            color: 'var(--text-secondary)',
            '&:hover': { bgcolor: 'rgba(148,163,184,0.06)' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !solutionUsed.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: '#030711',
            fontWeight: 700,
            px: 3,
            '&:hover': { bgcolor: 'primary.light' },
            '&:disabled': { bgcolor: 'rgba(16,185,129,0.15)', color: 'rgba(16,185,129,0.4)' },
          }}
        >
          {submitting ? 'Writing...' : 'Close & Write Memory'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
