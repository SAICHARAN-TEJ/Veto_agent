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
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export function TicketClose({ onSubmit, onCancel, initialDraft, customer }) {
  const [outcome, setOutcome] = useState('resolved');
  const [solutionUsed, setSolutionUsed] = useState(initialDraft || '');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [frustrationSignal, setFrustrationSignal] = useState('low');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);

    const memoryData = {
      customer_id: customer?.id,
      ticket_id: 'placeholder',
      solution: solutionUsed,
      outcome,
      resolution_notes: resolutionNotes,
      frustration_signal: frustrationSignal,
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log('Writing memory:', memoryData);
    }
    onSubmit(memoryData);
  };

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(11,15,21,0.85)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: '1.25rem',
          pb: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        Close Ticket for {customer?.contact_name}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Stack spacing={3}>
          {/* Outcome */}
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 1.5,
                fontSize: '0.9rem',
              }}
            >
              Resolution Outcome
            </FormLabel>
            <RadioGroup
              row
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              sx={{
                '& .MuiFormControlLabel-root': {
                  mr: 3,
                },
              }}
            >
              <FormControlLabel value="resolved" control={<Radio />} label="Resolved" />
              <FormControlLabel value="failed" control={<Radio />} label="Failed" />
              <FormControlLabel value="escalated" control={<Radio />} label="Escalated" />
            </RadioGroup>
          </FormControl>

          <Divider />

          {/* Solution Used */}
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 1,
                fontSize: '0.9rem',
              }}
            >
              Solution Used
            </FormLabel>
            <TextField
              multiline
              rows={3}
              value={solutionUsed}
              onChange={(e) => setSolutionUsed(e.target.value)}
              placeholder="Describe what was tried..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  borderRadius: '10px',
                },
              }}
            />
          </FormControl>

          {/* Resolution Notes */}
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 1,
                fontSize: '0.9rem',
              }}
            >
              Resolution Notes
            </FormLabel>
            <TextField
              multiline
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Any additional details..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  borderRadius: '10px',
                },
              }}
            />
          </FormControl>

          <Divider />

          {/* Frustration Signal */}
          <FormControl fullWidth>
            <FormLabel
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 1.5,
                fontSize: '0.9rem',
              }}
            >
              Customer Frustration Signal
            </FormLabel>
            <RadioGroup
              row
              value={frustrationSignal}
              onChange={(e) => setFrustrationSignal(e.target.value)}
              sx={{
                '& .MuiFormControlLabel-root': {
                  mr: 3,
                },
              }}
            >
              <FormControlLabel value="low" control={<Radio />} label="Low" />
              <FormControlLabel value="medium" control={<Radio />} label="Medium" />
              <FormControlLabel value="high" control={<Radio />} label="High" />
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 1,
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.08)',
            },
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
            color: 'background.default',
            fontWeight: 700,
            px: 3,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&:disabled': {
              opacity: 0.5,
            },
          }}
        >
          {submitting ? 'Closing...' : 'Close Ticket'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}