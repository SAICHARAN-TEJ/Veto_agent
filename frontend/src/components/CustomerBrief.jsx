import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';

const outcomeBadgeColors = {
  failed: '#D94F4F',
  success: '#4CAF7D',
  unknown: '#5E6773',
};

export function CustomerBrief({ brief }) {
  if (!brief) return null;

  const frustrationColors = {
    high: '#D94F4F',
    medium: '#E5A84B',
    low: '#4CAF7D',
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" color="text.primary" sx={{ mb: 2, fontWeight: 700 }}>
          Customer Memory Intelligence
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 1.25,
            mb: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            bgcolor: 'rgba(255,255,255,0.03)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="Memory Source" size="small" sx={{ bgcolor: 'grey.700', color: 'text.secondary', fontSize: '0.65rem' }} />
            <Typography variant="caption" color="text.secondary">
              Customer Failure Memory + Solution Index (fresh at request time)
            </Typography>
          </Stack>
        </Paper>

        <Stack spacing={1.5}>
          <Box>
            <Typography variant="overline" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
              Company
            </Typography>
            <Typography variant="body2" color="text.primary">
              {brief.company}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
              Contact
            </Typography>
            <Typography variant="body2" color="text.primary">
              {brief.contact_name}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
              Environment
            </Typography>
            <Typography variant="body2" color="text.primary">
              {brief.env.browser || 'Unknown'}, {brief.env.os || 'Unknown'}, {brief.env.plan || 'Standard'}
              {brief.env.sso_provider && `, SSO: ${brief.env.sso_provider}`}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 0 }} />

      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
            Frustration Level
          </Typography>
          <Chip
            label={brief.frustration_level.toUpperCase()}
            size="small"
            sx={{
              bgcolor: `${frustrationColors[brief.frustration_level]}22`,
              color: frustrationColors[brief.frustration_level],
              border: `1px solid ${frustrationColors[brief.frustration_level]}`,
              fontWeight: 700,
              fontSize: '0.7rem',
            }}
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 0 }} />

      <Box>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 1.5 }}>
          Failure History
        </Typography>
        {brief.past_solutions.length > 0 ? (
          <List sx={{ p: 0 }}>
            {brief.past_solutions.map((solution, index) => (
              <Box key={index}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 1.5,
                    bgcolor: 'grey.700',
                    borderRadius: '8px',
                    mb: index < brief.past_solutions.length - 1 ? 1 : 0,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mb: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Ticket #{solution.ticket_id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {solution.date}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      {solution.solution}
                    </Typography>
                    <Chip
                      label={solution.outcome.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: `${outcomeBadgeColors[solution.outcome] || outcomeBadgeColors.unknown}22`,
                        color: outcomeBadgeColors[solution.outcome] || outcomeBadgeColors.unknown,
                        border: `1px solid ${outcomeBadgeColors[solution.outcome] || outcomeBadgeColors.unknown}`,
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        ml: 1,
                      }}
                    />
                  </Stack>
                </ListItem>
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="caption" color="text.disabled">
            No previous failure data
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 0 }} />

      <Stack direction="row" spacing={2}>
        <Paper
          sx={{
            flex: 1,
            p: 2,
            bgcolor: 'grey.700',
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
          elevation={0}
        >
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
            Tickets
          </Typography>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
            {brief.total_tickets}
          </Typography>
        </Paper>
        <Paper
          sx={{
            flex: 1,
            p: 2,
            bgcolor: 'grey.700',
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
          elevation={0}
        >
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>
            Escalations
          </Typography>
          <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
            {brief.escalation_count}
          </Typography>
        </Paper>
      </Stack>
    </Stack>
  );
}
