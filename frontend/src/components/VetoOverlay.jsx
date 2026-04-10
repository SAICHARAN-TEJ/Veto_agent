import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Divider from '@mui/material/Divider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export function VetoOverlay({ vetoed, reason, failedOn, ticketRefs, suggestion, confidence, onUseSuggestion }) {
  if (!vetoed) return null;

  const handleUseSuggestion = () => {
    if (suggestion) {
      const professionalText = "Hi,\n\nLet's try a different approach. " + suggestion.steps + "\n\n" + suggestion.reasoning;
      onUseSuggestion(professionalText);
    }
  };

  return (
    <Stack spacing={2}>
      {/* Veto Alert */}
      <Alert
        severity="error"
        sx={{
          bgcolor: 'rgba(217, 79, 79, 0.08)',
          border: '1px solid',
          borderColor: 'error.main',
          borderRadius: '12px',
          p: 2,
          '.MuiAlert-icon': {
            color: 'error.main',
          },
        }}
        icon={<span style={{ fontSize: '1.5rem', fontWeight: 700 }}>!</span>}
      >
        <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>
          Memory Conflict: Solution Already Failed
        </AlertTitle>
        <Typography variant="body2" color="text.primary" sx={{ mb: 1.5 }}>
          {reason}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={`Confidence: ${Math.round(confidence * 100)}%`}
            size="small"
            sx={{ bgcolor: 'rgba(217,79,79,0.2)', color: 'error.main', fontSize: '0.7rem' }}
          />
          {failedOn && failedOn.length > 0 && (
            <Chip
              label={`Failure Date: ${failedOn.join(', ')}`}
              size="small"
              sx={{ bgcolor: 'rgba(217,79,79,0.2)', color: 'error.main', fontSize: '0.7rem' }}
            />
          )}
          {ticketRefs && ticketRefs.length > 0 && (
            <Chip
              label={`Ref: ${ticketRefs.map(t => '#' + t).join(', ')}`}
              size="small"
              sx={{ bgcolor: 'rgba(217,79,79,0.2)', color: 'error.main', fontSize: '0.7rem' }}
            />
          )}
        </Stack>
      </Alert>

      {/* Alternative Suggestion */}
      {suggestion && (
        <Paper
          sx={{
            p: 2.5,
            bgcolor: 'rgba(76, 175, 125, 0.08)',
            border: '1px solid',
            borderColor: 'success.main',
            borderRadius: '12px',
            boxShadow: 'none',
          }}
          elevation={0}
        >
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="overline" color="success.main" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>
                AI Suggested Alternative
              </Typography>
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
                {suggestion.solution_name}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.primary">
              {suggestion.steps}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {suggestion.reasoning}
            </Typography>

            <Divider sx={{ my: 0.5 }} />

            <Button
              variant="contained"
              onClick={handleUseSuggestion}
              startIcon={<ContentCopyIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                bgcolor: 'success.main',
                color: 'background.default',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'none',
                borderRadius: '8px',
                py: 1.2,
                '&:hover': {
                  bgcolor: 'success.dark',
                },
              }}
            >
              Use this suggestion
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
