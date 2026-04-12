import React from 'react';
import { useNavigate } from 'react-router-dom';
import VetoAlertCard from '../components/demo/VetoAlertCard.jsx';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section style={{
      paddingTop: 'clamp(100px, 14vw, 160px)',
      paddingBottom: 'clamp(60px, 8vw, 120px)',
      paddingLeft: 'clamp(20px, 5vw, 80px)',
      paddingRight: 'clamp(20px, 5vw, 80px)',
      maxWidth: 1280, margin: '0 auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(480px, 100%), 1fr))',
        gap: 'clamp(40px, 6vw, 100px)',
        alignItems: 'center',
      }}>
        {/* ── Left: Copy ── */}
        <div>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-secondary)', letterSpacing: '0.08em',
            marginBottom: 36,
            borderBottom: '1px solid var(--border)', paddingBottom: 10,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
              animation: 'breathe 2s ease-in-out infinite', display: 'inline-block',
              flexShrink: 0,
            }} />
            MEMORY-POWERED SUPPORT INTELLIGENCE &nbsp;[BETA]
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(56px, 9vw, 120px)',
            lineHeight: 0.92, letterSpacing: '-0.03em',
            marginBottom: 28,
          }}>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              fontWeight: 400,
            }}>
              The Agent
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontWeight: 800,
              color: 'var(--text-primary)',
            }}>
              That Never Forgets.
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(26px, 4vw, 52px)',
              color: 'var(--text-secondary)',
              letterSpacing: '-0.02em',
              marginTop: 8,
            }}>
              What didn&apos;t work.
            </span>
          </h1>

          {/* Subhead */}
          <p style={{
            fontSize: 16, lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: 480, marginBottom: 40,
          }}>
            VETO gives your support team a corporate memory. It intercepts
            the same broken advice before it reaches your customers.{' '}
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Again.</strong>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
            <button
              onClick={() => navigate('/app?demo=true')}
              style={{
                background: 'var(--accent)', color: '#0C0C0C',
                border: 'none', padding: '14px 28px', borderRadius: 0,
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
                letterSpacing: '0.01em', cursor: 'pointer',
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              See It Intercept →
            </button>
            <button
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', color: 'var(--text-secondary)',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                padding: '14px 4px', borderRadius: 0,
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 400,
                cursor: 'pointer',
                transition: 'color 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderBottomColor = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderBottomColor = 'var(--border)';
              }}
            >
              Read the case study
            </button>
          </div>

          {/* Social proof */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#111', border: '1px solid var(--border)',
            padding: '8px 14px', borderRadius: 999,
          }}>
            <div style={{ display: 'flex' }}>
              {[
                { initials: 'PN', bg: '#2A2A2A' },
                { initials: 'MW', bg: '#1E1E1E' },
                { initials: 'SR', bg: '#252525' },
              ].map(({ initials, bg }, i) => (
                <div key={i} style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: bg, border: '2px solid #0C0C0C',
                  marginLeft: i > 0 ? -10 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 600,
                  color: 'var(--text-secondary)', zIndex: 3 - i, position: 'relative',
                }}>
                  {initials}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)' }}>
              Used by <strong style={{ color: 'var(--text-primary)' }}>3 enterprise teams</strong> in beta
            </span>
          </div>
        </div>

        {/* ── Right: Alert Card Demo ── */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <VetoAlertCard />
        </div>
      </div>
    </section>
  );
}
