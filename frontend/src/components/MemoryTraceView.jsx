import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Divider from '@mui/material/Divider';

const stageColors = {
  extraction: 'primary.main',
  query: 'info.main',
  analysis: 'warning.main',
  conclusion: 'success.main',
  default: 'grey.500',
};

export function MemoryTraceView({ trace }) {
  if (!trace || trace.length === 0) return null;

  const finalConfidence = Math.round((trace[trace.length - 1]?.confidence || 0) * 100);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
          🧠 Memory Recall Trace
        </Typography>
        <Chip
          label={`Confidence: ${finalConfidence}%`}
          size="small"
          sx={{
            bgcolor: 'rgba(76, 175, 125, 0.2)',
            color: 'success.main',
            fontWeight: 700,
            fontSize: '0.7rem',
          }}
        />
      </Stack>

      <Divider />

      <Timeline position="alternate">
        {trace.map((step, index) => {
          const isLast = index === trace.length - 1;
          const stageKey = step.stage.toLowerCase().replace(/[_-]/g, '');
          const dotColor = stageColors[stageKey] || stageColors.default;

          return (
            <TimelineItem key={index}>
              <TimelineOppositeContent color="text.secondary" variant="body2">
                <Typography variant="caption" color="text.disabled">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: dotColor }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: dotColor, borderRadius: '50%' }} />
                </TimelineDot>
                {!isLast && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ pb: 2 }}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'grey.700',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '10px',
                    boxShadow: 'none',
                  }}
                  elevation={0}
                >
                  <Stack spacing={1}>
                    {/* Stage Badge */}
                    <Chip
                      label={step.stage.replace(/_/g, ' ').toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: `${dotColor}22`,
                        color: dotColor,
                        border: `1px solid ${dotColor}`,
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        width: 'fit-content',
                      }}
                    />

                    {/* Description */}
                    <Typography variant="body2" color="text.primary">
                      {step.description}
                    </Typography>

                    {/* Rationale */}
                    {step.rationale && (
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: '6px', borderLeft: '3px solid', borderLeftColor: 'primary.main' }}>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Why:</strong> {step.rationale}
                        </Typography>
                      </Box>
                    )}

                    {/* Result Summary */}
                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                      {step.result_summary}
                    </Typography>

                    {/* Memory Ref */}
                    {step.memory_ref && (
                      <Paper
                        sx={{
                          p: 1.5,
                          bgcolor: 'rgba(76, 175, 125, 0.08)',
                          border: '1px solid',
                          borderColor: 'success.main',
                          borderRadius: '8px',
                          boxShadow: 'none',
                          mt: 1,
                        }}
                        elevation={0}
                      >
                        <Stack spacing={0.5}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                              💾 Memory Reference
                            </Typography>
                            <Chip
                              label={`${Math.round(step.memory_ref.similarity * 100)}% Match`}
                              size="small"
                              sx={{
                                bgcolor: 'success.main',
                                color: 'background.default',
                                fontWeight: 700,
                                fontSize: '0.65rem',
                              }}
                            />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            ID: {step.memory_ref.memory_id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "{step.memory_ref.excerpt}"
                          </Typography>
                        </Stack>
                      </Paper>
                    )}
                  </Stack>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Stack>
  );
}
