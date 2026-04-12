import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export function VetoOverlay({ vetoed, reason, failedOn, ticketRefs, suggestion, confidence, onUseSuggestion }) {
  if (!vetoed) return null;

  const handleUseSuggestion = () => {
    if (suggestion) {
      const text = "Hi,\n\nLet's try a different approach. " + suggestion.steps + "\n\n" + suggestion.reasoning;
      onUseSuggestion(text);
    }
  };

  const confidencePct = Math.round(confidence * 100);

  return (
    <Stack spacing={1.5} className="animate-slide-up">
      {/* Conflict banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 'var(--radius-lg)',
          bgcolor: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid rgba(239, 68, 68, 0.18)',
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-sm)',
                bgcolor: 'rgba(239, 68, 68, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--red-400)', fontSize: '0.82rem' }}>
                Memory Conflict: Solution Already Failed
              </Typography>
            </Box>
            <Chip
              label={confidencePct + '% match'}
              size="small"
              sx={{
                height: 20,
                bgcolor: 'rgba(239,68,68,0.12)',
                color: 'var(--red-400)',
                border: '1px solid rgba(239,68,68,0.25)',
                fontWeight: 700,
                fontSize: '0.58rem',
              }}
            />
          </Stack>

          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6 }}>
            {reason}
          </Typography>

          {/* Failure timeline */}
          {failedOn && failedOn.length > 0 && (
            <Stack direction="row" spacing={0.8} alignItems="center" sx={{ flexWrap: 'wrap' }}>
              {failedOn.map((date, i) => (
                <React.Fragment key={i}>
                  <Chip
                    label={date + ' — Failed'}
                    size="small"
                    sx={{
                      height: 20,
                      bgcolor: 'rgba(239,68,68,0.08)',
                      color: 'var(--red-300)',
                      fontSize: '0.58rem',
                      fontWeight: 600,
                    }}
                  />
                  {i < failedOn.length - 1 && (
                    <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.7rem' }}>
                      →
                    </Typography>
                  )}
                </React.Fragment>
              ))}
              <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.7rem' }}>
                →
              </Typography>
              <Chip
                label="NOW — Intercepted"
                size="small"
                sx={{
                  height: 20,
                  bgcolor: 'rgba(16,185,129,0.12)',
                  color: 'var(--emerald-400)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                }}
              />
            </Stack>
          )}

          {ticketRefs && ticketRefs.length > 0 && (
            <Stack direction="row" spacing={0.5}>
              {ticketRefs.map((ref, i) => (
                <Chip
                  key={i}
                  label={'#' + ref}
                  size="small"
                  sx={{
                    height: 18,
                    bgcolor: 'rgba(148,163,184,0.06)',
                    color: 'var(--text-muted)',
                    fontSize: '0.55rem',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Alternative suggestion */}
      {suggestion && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 'var(--radius-lg)',
            bgcolor: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}
        >
          <Stack spacing={1.2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  bgcolor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: 'var(--emerald-400)', display: 'block', fontSize: '0.55rem', lineHeight: 1.2 }}>
                  Memory-Backed Alternative
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                  {suggestion.solution_name}
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6 }}>
              {suggestion.steps}
            </Typography>

            <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.72rem' }}>
              {suggestion.reasoning}
            </Typography>

            <Divider sx={{ borderColor: 'var(--border-subtle)' }} />

            <Button
              variant="contained"
              onClick={handleUseSuggestion}
              sx={{
                bgcolor: 'primary.main',
                color: '#030711',
                fontWeight: 700,
                fontSize: '0.78rem',
                py: 1,
                borderRadius: 'var(--radius-md)',
                alignSelf: 'flex-start',
                '&:hover': {
                  bgcolor: 'primary.light',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
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
