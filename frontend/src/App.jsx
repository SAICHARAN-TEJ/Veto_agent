import React, { useState, useCallback, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import { MemoryCortex } from './components/MemoryCortex';
import { MemoryEvolution } from './components/MemoryEvolution';
import { SupportConsole } from './components/SupportConsole';
import { mockCustomers } from './data/mockTickets';

/*
  App — Routes between Landing (the pitch) and Console (the product).
  Landing tells the story. Console proves it works.
*/

const frustrationDot = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

function LandingPage({ onEnterConsole, stats }) {
  const cortexAreaRef = useRef(null);
  const [cortexDims, setCortexDims] = useState({ w: 800, h: 420 });

  useEffect(() => {
    function measure() {
      if (cortexAreaRef.current) {
        const rect = cortexAreaRef.current.getBoundingClientRect();
        setCortexDims({ w: Math.floor(rect.width), h: Math.floor(rect.height) });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'var(--bg-base)',
      }}
    >
      {/* Ambient glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '10%',
          width: '80%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '50%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4 },
          pt: { xs: 4, md: 6 },
          pb: 6,
        }}
      >
        {/* Nav */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: { xs: 5, md: 7 } }}
          className="animate-fade-in"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                bgcolor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Veto
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip
              label={stats.totalMemories + ' memories stored'}
              size="small"
              sx={{
                bgcolor: 'rgba(16,185,129,0.1)',
                color: 'var(--emerald-400)',
                border: '1px solid rgba(16,185,129,0.2)',
                fontWeight: 600,
                fontSize: '0.68rem',
                height: 28,
              }}
            />
            <Chip
              label={stats.customersTracked + ' customers tracked'}
              size="small"
              sx={{
                bgcolor: 'rgba(56,189,248,0.08)',
                color: 'var(--sky-400)',
                border: '1px solid rgba(56,189,248,0.15)',
                fontWeight: 600,
                fontSize: '0.68rem',
                height: 28,
              }}
            />
          </Stack>
        </Stack>

        {/* Hero */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: { xs: 4, lg: 6 }, mb: { xs: 5, md: 8 } }}>
          <Stack spacing={3} justifyContent="center" className="animate-slide-up">
            <Chip
              label="Memory-first support intelligence"
              size="small"
              sx={{
                width: 'fit-content',
                bgcolor: 'rgba(16,185,129,0.12)',
                color: 'var(--emerald-400)',
                border: '1px solid rgba(16,185,129,0.2)',
                fontWeight: 700,
                fontSize: '0.68rem',
                height: 26,
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.4rem', md: '3rem' },
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.08,
                color: 'var(--text-primary)',
              }}
            >
              Stop Telling Customers
              <br />
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #10B981, #34D399, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                What Already Failed
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'var(--text-secondary)',
                maxWidth: 520,
                fontSize: { xs: '0.9rem', md: '1rem' },
                lineHeight: 1.7,
              }}
            >
              Veto is a corporate memory layer for support teams. It intercepts agent responses
              in real time, checks them against every past failure for that customer, and blocks
              redundant advice before it reaches the inbox.
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
              <Button
                variant="contained"
                onClick={() => onEnterConsole(null)}
                sx={{
                  bgcolor: 'primary.main',
                  color: '#030711',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  fontSize: '0.875rem',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                  },
                }}
              >
                Open Console
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-secondary)',
                  px: 3,
                  py: 1.2,
                  '&:hover': {
                    borderColor: 'var(--emerald-500)',
                    bgcolor: 'rgba(16,185,129,0.06)',
                    color: 'var(--emerald-400)',
                  },
                }}
                onClick={() => {
                  document.getElementById('evolution-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See How It Learns
              </Button>
            </Stack>

            {/* Impact strip */}
            <Stack direction="row" spacing={3} sx={{ pt: 2 }}>
              {[
                { value: '87.5%', label: 'Conflict accuracy' },
                { value: '< 600ms', label: 'Check latency' },
                { value: '3x', label: 'Faster resolution' },
              ].map((stat, i) => (
                <Box key={i}>
                  <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.62rem' }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>

          {/* Cortex visualization */}
          <Box
            ref={cortexAreaRef}
            sx={{
              position: 'relative',
              minHeight: { xs: 280, md: 420 },
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--border-subtle)',
              bgcolor: 'rgba(3, 7, 17, 0.6)',
              overflow: 'hidden',
            }}
            className="animate-fade-in"
          >
            <MemoryCortex width={cortexDims.w} height={cortexDims.h} />
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
              }}
            >
              <Stack direction="row" spacing={2}>
                {[
                  { color: '#10B981', label: 'Customers' },
                  { color: '#38BDF8', label: 'Solutions' },
                  { color: '#94A3B8', label: 'Memory Entries' },
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={0.6} alignItems="center">
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: item.color, opacity: 0.7 }} />
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.58rem', letterSpacing: '0.03em' }}>
                      {item.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* The Problem */}
        <Box
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: { xs: 5, md: 8 },
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--border-default)',
            bgcolor: 'var(--bg-raised)',
          }}
          className="animate-slide-up"
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 3, md: 5 } }}>
            <Box>
              <Chip
                label="The problem"
                size="small"
                sx={{ mb: 1.5, bgcolor: 'rgba(239,68,68,0.1)', color: 'var(--red-400)', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, fontSize: '0.62rem', height: 24 }}
              />
              <Typography variant="h3" sx={{ mb: 1.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                Corporate Amnesia
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                In traditional support, memory is fragmented across tickets, agents, and time.
                A customer might have tried "Clear Cache" three times across three tickets, but
                the fourth agent — seeing a fresh ticket — suggests it again.
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {[
                { icon: '→', text: '"I already told the last person this didn\'t work."', color: 'var(--red-400)' },
                { icon: '→', text: 'Hours wasted on scripts that are proven failures for that environment.', color: 'var(--amber-500)' },
                { icon: '→', text: 'Brand erosion — the company appears disorganized and incompetent.', color: 'var(--red-400)' },
              ].map((item, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 'var(--radius-lg)',
                    bgcolor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderLeft: '3px solid',
                    borderLeftColor: item.color,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {item.text}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Memory Evolution */}
        <Box
          id="evolution-section"
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: { xs: 5, md: 8 },
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--border-default)',
            bgcolor: 'var(--bg-raised)',
          }}
        >
          <MemoryEvolution />
        </Box>

        {/* Customer cards — entry to console */}
        <Box sx={{ mb: 6 }}>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Try the Console
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              Pick a customer to open a live support workspace. Draft a response and watch Veto intercept repeated failures in real time.
            </Typography>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 1.5 }}>
            {mockCustomers.map((customer, index) => (
              <Grow in key={customer.id} timeout={200 + index * 80}>
                <Paper
                  elevation={0}
                  onClick={() => onEnterConsole(customer)}
                  sx={{
                    p: 2,
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-default)',
                    bgcolor: 'var(--bg-raised)',
                    cursor: 'pointer',
                    transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(16,185,129,0.06)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'var(--shadow-emerald)',
                    },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.3}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {customer.contact_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        {customer.company}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: frustrationDot[customer.frustration_level],
                        }}
                      />
                      <Chip
                        label={customer.ticket_count + ' open'}
                        size="small"
                        sx={{
                          height: 22,
                          bgcolor: 'rgba(148,163,184,0.08)',
                          color: 'var(--text-muted)',
                          fontSize: '0.62rem',
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Grow>
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid var(--border-subtle)' }}>
          <Typography variant="caption" sx={{ color: 'var(--text-disabled)', fontSize: '0.62rem' }}>
            Veto — Failure Memory System for Support Teams
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const [view, setView] = useState('landing');
  const [initialCustomer, setInitialCustomer] = useState(null);

  const stats = {
    totalMemories: 14,
    customersTracked: 5,
  };

  const handleEnterConsole = useCallback((customer) => {
    setInitialCustomer(customer);
    setView('console');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView('landing');
    setInitialCustomer(null);
  }, []);

  if (view === 'console') {
    return <SupportConsole initialCustomer={initialCustomer} onBack={handleBackToLanding} />;
  }

  return <LandingPage onEnterConsole={handleEnterConsole} stats={stats} />;
}

export default App;
