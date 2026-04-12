import React from 'react';
import SectionLabel from '../components/ui/SectionLabel.jsx';

const QUOTES = [
  {
    text: 'The first week, I thought it was just a fancy alert. By week four, it knew our top client better than I did.',
    name: 'Priya Nair',
    role: 'Senior Support Lead',
    company: 'Meridian Corp',
    initials: 'PN',
  },
  {
    text: 'We went from re-suggesting the same fix 3 times per customer to catching it before it ever left the composer.',
    name: 'Marcus Webb',
    role: 'Head of CX',
    company: 'Praxis Systems',
    initials: 'MW',
  },
  {
    text: 'VETO surfaced a fix I didn\'t know existed. The customer resolved in 8 minutes.',
    name: 'Sara Reyes',
    role: 'Support Engineer',
    company: 'Volta Analytics',
    initials: 'SR',
  },
];

const PILLS = [
  { label: '−41% Time to Resolution' },
  { label: '89% Conflict Detection Rate' },
  { label: '0 Repeat Failures' },
];

export default function Testimonials() {
  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
      borderTop: '1px solid var(--border)',
      background: '#0E0E0E',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <SectionLabel number={6} label="Beta Feedback" />
        </div>

        {/* Quote cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
          marginBottom: 56,
        }}>
          {QUOTES.map(({ text, name, role, company, initials }, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', gap: 20,
              padding: 'clamp(24px, 3vw, 32px)',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 4,
            }}>
              {/* Quote mark */}
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 48,
                color: 'var(--border)', lineHeight: 1, marginBottom: -16,
              }}>
                "
              </div>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15, lineHeight: 1.7,
                color: 'var(--text-primary)',
                fontStyle: 'normal',
                flex: 1,
              }}>
                {text}
              </p>

              {/* Attribution */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                paddingTop: 16, borderTop: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#1E1E1E', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                  color: 'var(--text-secondary)', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {role}, {company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metric pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {PILLS.map(({ label }, i) => (
            <div key={i} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
              color: 'var(--accent)', background: 'rgba(232,255,0,0.08)',
              border: '1px solid rgba(232,255,0,0.25)',
              padding: '8px 16px', borderRadius: 2,
              letterSpacing: '0.06em',
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
