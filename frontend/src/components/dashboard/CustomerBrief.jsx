import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const outcomeBadge = {
  failed: { color: '#F87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  success: { color: '#34D399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  resolved: { color: '#34D399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  unknown: { color: '#64748B', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)' },
};

const frustrationConfig = {
  high: { color: '#F87171', label: 'HIGH', pct: 85 },
  medium: { color: '#FBBF24', label: 'MEDIUM', pct: 55 },
  low: { color: '#34D399', label: 'LOW', pct: 20 },
};

export function CustomerBrief({ brief }) {
  if (!brief) return null;

  const frust = frustrationConfig[brief.frustration_level] || frustrationConfig.low;
  const totalFailed = brief.past_solutions.filter((s) => s.outcome === 'failed').length;
  const totalResolved = brief.past_solutions.filter((s) => s.outcome === 'resolved' || s.outcome === 'success').length;

  return (
    <Stack spacing={2.5}>
      {/* Header */}
      <Box>
        <Typography variant="overline" sx={{ color: 'var(--emerald-400)', display: 'block', mb: 1 }}>
          Memory Intelligence
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 0.3 }}>
          {brief.contact_name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
          {brief.company}
        </Typography>
      </Box>

      {/* Memory source badge */}
      <Paper
        elevation={0}
        sx={{
          px: 1.2,
          py: 0.8,
          borderRadius: 'var(--radius-md)',
          bgcolor: 'rgba(16,185,129,0.04)',
          border: '1px solid rgba(16,185,129,0.1)',
        }}
      >
        <Stack direction="row" spacing={0.8} alignItems="center">
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'var(--emerald-500)' }} className="animate-breathe" />
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.58rem' }}>
            Live from Customer Failure Memory + Solution Index
          </Typography>
        </Stack>
      </Paper>

      {/* Memory depth gauge */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.65rem' }}>
            Memory Depth
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--emerald-400)', fontWeight: 700, fontSize: '0.65rem' }}>
            {brief.total_tickets} entries
          </Typography>
        </Stack>
        <Box sx={{ height: 4, borderRadius: 'var(--radius-full)', bgcolor: 'var(--bg-surface)', overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              width: Math.min(100, (brief.total_tickets / 5) * 100) + '%',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(90deg, var(--emerald-600), var(--emerald-400))',
              transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--border-subtle)' }} />

      {/* Environment */}
      <Box>
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', mb: 0.8, fontSize: '0.65rem' }}>
          Environment Fingerprint
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {[
            brief.env.browser,
            brief.env.os,
            brief.env.plan,
            brief.env.sso_provider ? 'SSO: ' + brief.env.sso_provider : null,
          ]
            .filter(Boolean)
            .map((item, i) => (
              <Chip
                key={i}
                label={item}
                size="small"
                sx={{
                  height: 22,
                  bgcolor: 'rgba(148,163,184,0.06)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                }}
              />
            ))}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'var(--border-subtle)' }} />

      {/* Frustration level with bar */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.65rem' }}>
            Frustration Level
          </Typography>
          <Chip
            label={frust.label}
            size="small"
            sx={{
              height: 18,
              bgcolor: frust.color + '18',
              color: frust.color,
              border: '1px solid ' + frust.color + '40',
              fontWeight: 700,
              fontSize: '0.55rem',
            }}
          />
        </Stack>
        <Box sx={{ height: 4, borderRadius: 'var(--radius-full)', bgcolor: 'var(--bg-surface)', overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              width: frust.pct + '%',
              borderRadius: 'var(--radius-full)',
              bgcolor: frust.color,
              transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'var(--border-subtle)' }} />

      {/* Solution history */}
      <Box>
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', mb: 1, fontSize: '0.65rem' }}>
          Solution History
        </Typography>
        {brief.past_solutions.length > 0 ? (
          <Stack spacing={0.8}>
            {brief.past_solutions.map((sol, i) => {
              const badge = outcomeBadge[sol.outcome] || outcomeBadge.unknown;
              return (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    px: 1.2,
                    py: 1,
                    borderRadius: 'var(--radius-md)',
                    bgcolor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.3 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.68rem' }}>
                      #{sol.ticket_id}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.58rem' }}>
                        {sol.date}
                      </Typography>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: badge.color,
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                    {sol.solution}
                  </Typography>
                </Paper>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="caption" sx={{ color: 'var(--text-disabled)' }}>
            No history yet
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: 'var(--border-subtle)' }} />

      {/* Quick stats */}
      <Stack direction="row" spacing={1}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 1.2,
            borderRadius: 'var(--radius-md)',
            bgcolor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'var(--text-disabled)', display: 'block', fontSize: '0.55rem', mb: 0.2 }}>
            Tickets
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--emerald-400)', fontSize: '1rem' }}>
            {brief.total_tickets}
          </Typography>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 1.2,
            borderRadius: 'var(--radius-md)',
            bgcolor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'var(--text-disabled)', display: 'block', fontSize: '0.55rem', mb: 0.2 }}>
            Failed
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red-400)', fontSize: '1rem' }}>
            {totalFailed}
          </Typography>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 1.2,
            borderRadius: 'var(--radius-md)',
            bgcolor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'var(--text-disabled)', display: 'block', fontSize: '0.55rem', mb: 0.2 }}>
            Escalations
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--amber-400)', fontSize: '1rem' }}>
            {brief.escalation_count}
          </Typography>
        </Paper>
      </Stack>
    </Stack>
  );
}
