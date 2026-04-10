import React from 'react';
import { useNavigate } from 'react-router-dom';
import VetoAlertCard from '../components/demo/VetoAlertCard';

/* Responsive hero: 2-col on ≥800px, stacks on mobile */
const heroGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(460px, 100%), 1fr))',
  gap: 'clamp(40px, 6vw, 80px)',
  alignItems: 'center',
};

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px) clamp(60px, 8vw, 100px)',
      maxWidth: 1280, margin: '0 auto',
    }}>
      <div style={heroGrid}>
        {/* ── Left: Copy ── */}
        <div>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-secondary)', letterSpacing: '0.08em',
            marginBottom: 32,
            borderBottom: '1px solid #2A2A2A', paddingBottom: 8,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
              animation: 'breathe 2s ease-in-out infinite', display: 'inline-block',
            }} />
            MEMORY-POWERED SUPPORT INTELLIGENCE&nbsp;&nbsp;[BETA]
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 118px)',
            lineHeight: 0.95, letterSpacing: '-0.03em',
            marginBottom: 20,
          }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              color: 'var(--text-primary)', fontWeight: 400,
            }}>
              The Agent
            </span>
            <span style={{
              display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 700,
              color: 'var(--text-primary)',
            }}>
              That Never Forgets.
            </span>
            <span style={{
              display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 400,
              fontSize: 'clamp(24px, 4vw, 56px)',
              color: 'var(--text-secondary)', letterSpacing: '-0.02em',
            }}>
              What didn&apos;t work.
            </span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 16, lineHeight: 1.65, color: 'var(--text-secondary)',
            maxWidth: 480, marginBottom: 36,
          }}>
            VETO gives your support team a corporate memory. It intercepts
            the same broken advice before it reaches your customers.{' '}
            <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Again.</strong>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <button
              onClick={() => navigate('/app?demo=true')}
              style={{
                background: 'var(--accent)', color: '#0C0C0C',
                border: 'none', padding: '14px 28px',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.02em', borderRadius: 0,
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              See It Intercept →
            </button>
            <button
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', color: 'var(--text-secondary)',
                border: 'none', borderBottom: '1px solid #3A3A3A',
                padding: '14px 4px',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 400,
                cursor: 'pointer', borderRadius: 0,
                transition: 'color 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderBottomColor = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderBottomColor = '#3A3A3A';
              }}
            >
              Read the case study
            </button>
          </div>

          {/* Social proof pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#111111', border: '1px solid #1E1E1E',
            padding: '8px 14px', borderRadius: 999,
          }}>
            <div style={{ display: 'flex' }}>
              {['PR', 'MW', 'SR'].map((initials, i) => (
                <div key={i} style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: i === 0 ? '#2A2A2A' : i === 1 ? '#1E1E1E' : '#252525',
                  border: '2px solid #0C0C0C',
                  marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 600,
                  color: 'var(--text-secondary)', zIndex: 3 - i, position: 'relative',
                }}>
                  {initials}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)' }}>
              Used by <strong style={{ color: 'var(--text-primary)' }}>3 enterprise teams</strong> in beta
            </span>
          </div>
        </div>

        {/* ── Right: Animated demo card ── */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: -40,
            background: 'radial-gradient(ellipse at center, rgba(255,59,59,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <VetoAlertCard />
        </div>
      </div>
    </section>
  );
}
