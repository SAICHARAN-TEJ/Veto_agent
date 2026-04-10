import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

/*
  MemoryEvolution — Shows how the agent improves over successive interactions.
  The key "wow" feature for judges: a visual progression from generic → personalized.
*/

const evolutionSteps = [
  {
    interaction: 1,
    label: 'First Contact',
    confidence: 12,
    memoryDepth: 0,
    description: 'No prior context. Agent suggests standard cache-clearing script.',
    response: '"Please try clearing your browser cache and cookies, then attempt to log in again."',
    outcome: 'failed',
    insight: 'Generic response — no customer awareness.',
  },
  {
    interaction: 2,
    label: 'Memory Seed',
    confidence: 35,
    memoryDepth: 1,
    description: 'First failure is recorded. Memory layer now tracks this solution as attempted-and-failed for this customer.',
    response: '"I can see from our records that cache clearing was already tried. Let me check your SSO configuration instead."',
    outcome: 'partial',
    insight: 'Agent avoids one known failure path.',
  },
  {
    interaction: 3,
    label: 'Pattern Recognition',
    confidence: 62,
    memoryDepth: 3,
    description: 'Multiple failures indexed. System cross-references similar customer environments to surface high-probability fixes.',
    response: '"Based on success patterns in similar Okta-SSO setups, I recommend revoking the SAML session from your admin panel."',
    outcome: 'resolved',
    insight: 'Environment-aware suggestion from memory index.',
  },
  {
    interaction: 5,
    label: 'Full Context',
    confidence: 88,
    memoryDepth: 7,
    description: 'Deep customer profile. Agent knows frustration level, past resolutions, environment quirks, and preferred communication style.',
    response: '"Hi Marcus — I see this looks like the redirect issue from October. The SAML revoke worked last time, so let me apply that immediately rather than re-running diagnostics."',
    outcome: 'resolved',
    insight: 'Proactive, personalized, zero wasted steps.',
  },
];

const outcomeColors = {
  failed: '#EF4444',
  partial: '#F59E0B',
  resolved: '#10B981',
};

export function MemoryEvolution() {
  const [activeStep, setActiveStep] = useState(0);
  const step = evolutionSteps[activeStep];

  return (
    <Box>
      <Stack spacing={2.5}>
        <Box>
          <Typography
            variant="overline"
            sx={{ color: 'var(--emerald-400)', display: 'block', mb: 0.5 }}
          >
            Memory Evolution
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Watch the Agent Get Smarter
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
            Each interaction builds deeper context. The same customer gets fundamentally better support over time.
          </Typography>
        </Box>

        {/* Step selector */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {evolutionSteps.map((s, i) => (
            <Box
              key={i}
              onClick={() => setActiveStep(i)}
              sx={{
                px: 1.8,
                py: 0.9,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: i === activeStep ? 'primary.main' : 'var(--border-default)',
                bgcolor: i === activeStep ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  borderColor: i === activeStep ? 'primary.main' : 'var(--border-strong)',
                  bgcolor: i === activeStep ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.06)',
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: i === activeStep ? 'primary.main' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                }}
              >
                Interaction {s.interaction}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Active step detail */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-default)',
            bgcolor: 'var(--bg-raised)',
            animation: 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
          key={activeStep}
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {step.label}
                </Typography>
                <Chip
                  label={step.outcome.toUpperCase()}
                  size="small"
                  sx={{
                    height: 22,
                    bgcolor: outcomeColors[step.outcome] + '18',
                    color: outcomeColors[step.outcome],
                    border: '1px solid ' + outcomeColors[step.outcome] + '40',
                    fontWeight: 700,
                    fontSize: '0.6rem',
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                {/* Confidence arc */}
                <Stack alignItems="center" spacing={0.3}>
                  <Box sx={{ position: 'relative', width: 40, height: 40 }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="3" />
                      <circle
                        cx="20" cy="20" r="16" fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeDasharray={100.5}
                        strokeDashoffset={100.5 - (100.5 * step.confidence) / 100}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                      />
                    </svg>
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.6rem',
                        color: 'primary.main',
                      }}
                    >
                      {step.confidence}%
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.55rem' }}>
                    Confidence
                  </Typography>
                </Stack>

                {/* Memory depth */}
                <Stack alignItems="center" spacing={0.3}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      bgcolor: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--sky-400)', fontSize: '0.75rem' }}>
                      {step.memoryDepth}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.55rem' }}>
                    Memories
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {step.description}
            </Typography>

            {/* Simulated response */}
            <Paper
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: 'var(--radius-lg)',
                bgcolor: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.12)',
                borderLeft: '3px solid',
                borderLeftColor: 'primary.main',
              }}
            >
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 0.5 }}>
                Agent Response
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'var(--text-primary)', fontStyle: 'italic', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.6 }}
              >
                {step.response}
              </Typography>
            </Paper>

            {/* Insight */}
            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
              {step.insight}
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
