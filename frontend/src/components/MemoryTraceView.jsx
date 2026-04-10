import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

/*
  MemoryTraceView — Custom vertical trace replacing MUI Lab Timeline.
  Shows each step of the AI reasoning process with memory references.
*/

const stageConfig = {
  before: { color: '#94A3B8', label: 'EXTRACTION' },
  memory_invocation: { color: '#38BDF8', label: 'MEMORY RECALL' },
  after_memory: { color: '#10B981', label: 'REFINEMENT' },
};

export function MemoryTraceView({ trace }) {
  if (!trace || trace.length === 0) return null;

  const finalConfidence = Math.round((trace[trace.length - 1]?.confidence || 0) * 100);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.65rem' }}>
          Memory Recall Trace
        </Typography>
        <Stack direction="row" spacing={0.8}>
          <Chip
            label={finalConfidence + '% confidence'}
            size="small"
            sx={{
              height: 20,
              bgcolor: 'rgba(16,185,129,0.12)',
              color: 'var(--emerald-400)',
              border: '1px solid rgba(16,185,129,0.25)',
              fontWeight: 700,
              fontSize: '0.55rem',
            }}
          />
        </Stack>
      </Stack>

      {/* Custom trace */}
      <Stack spacing={0}>
        {trace.map((step, index) => {
          const isLast = index === trace.length - 1;
          const stageKey = step.stage || 'before';
          const config = stageConfig[stageKey] || { color: '#94A3B8', label: step.stage.replace(/_/g, ' ').toUpperCase() };

          return (
            <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
              {/* Vertical line + dot */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: config.color,
                    border: '2px solid var(--bg-raised)',
                    boxShadow: '0 0 0 2px ' + config.color + '30',
                    flexShrink: 0,
                    mt: '3px',
                  }}
                />
                {!isLast && (
                  <Box
                    sx={{
                      width: 1,
                      flex: 1,
                      bgcolor: 'var(--border-default)',
                      minHeight: 16,
                    }}
                  />
                )}
              </Box>

              {/* Content */}
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 1.5,
                  mb: isLast ? 0 : 1,
                  borderRadius: 'var(--radius-md)',
                  bgcolor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Stack spacing={0.8}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={config.label}
                      size="small"
                      sx={{
                        height: 18,
                        bgcolor: config.color + '18',
                        color: config.color,
                        border: '1px solid ' + config.color + '30',
                        fontWeight: 700,
                        fontSize: '0.5rem',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.55rem' }}>
                      {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                    {step.description}
                  </Typography>

                  {step.rationale && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.6,
                        borderRadius: 'var(--radius-sm)',
                        bgcolor: 'rgba(148,163,184,0.04)',
                        borderLeft: '2px solid',
                        borderLeftColor: 'var(--emerald-500)',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                        <strong style={{ color: 'var(--text-secondary)' }}>Why:</strong> {step.rationale}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontStyle: 'italic', fontSize: '0.65rem' }}>
                    {step.result_summary}
                  </Typography>

                  {/* Memory reference */}
                  {step.memory_ref && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.2,
                        borderRadius: 'var(--radius-md)',
                        bgcolor: 'rgba(16, 185, 129, 0.04)',
                        border: '1px solid rgba(16, 185, 129, 0.12)',
                      }}
                    >
                      <Stack spacing={0.4}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={0.6} alignItems="center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                            <Typography variant="caption" sx={{ color: 'var(--emerald-400)', fontWeight: 700, fontSize: '0.58rem' }}>
                              Memory Reference
                            </Typography>
                          </Stack>
                          <Chip
                            label={Math.round(step.memory_ref.similarity * 100) + '% match'}
                            size="small"
                            sx={{
                              height: 16,
                              bgcolor: 'rgba(16,185,129,0.15)',
                              color: 'var(--emerald-400)',
                              fontWeight: 700,
                              fontSize: '0.5rem',
                            }}
                          />
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontFamily: 'var(--font-mono)' }}>
                          {step.memory_ref.memory_id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.62rem' }}>
                          "{step.memory_ref.excerpt}"
                        </Typography>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Paper>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
