import React from 'react';
import SectionLabel from '../components/ui/SectionLabel.jsx';
import StatCounter from '../components/ui/StatCounter.jsx';

const METRICS = [
  { target: 4821, suffix: '', label: 'Memory conflicts blocked this week', prefix: '' },
  { target: 38, suffix: '%', label: 'Average resolution time reduction', prefix: '−' },
  { target: 2.4, suffix: '×', label: 'Customer satisfaction improvement', prefix: '', isFloat: true },
  { target: 0, suffix: '', label: 'Times Meridian Corp got the same bad advice', prefix: '' },
];

export default function LiveMetrics() {
  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
      borderTop: '1px solid var(--border)',
      background: '#0E0E0E',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <SectionLabel number={4} label="Live Metrics" />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 0,
          borderTop: '1px solid var(--border)',
          borderLeft: '1px solid var(--border)',
        }}>
          {METRICS.map(({ target, suffix, label, prefix, isFloat }, i) => (
            <div key={i} style={{
              padding: 'clamp(32px, 4vw, 56px) clamp(20px, 3vw, 40px)',
              borderRight: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(44px, 5vw, 72px)',
                fontWeight: 800,
                color: i === 3 ? 'var(--accent)' : 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: 14,
                display: 'flex', alignItems: 'baseline', gap: 2,
              }}>
                {prefix && <span style={{ fontSize: '0.7em' }}>{prefix}</span>}
                {isFloat ? (
                  <span>{target}</span>
                ) : (
                  <StatCounter
                    target={target}
                    suffix={suffix}
                    duration={1800}
                  />
                )}
                {!isFloat && suffix === '' && i !== 3 && null}
                {isFloat && <span style={{ fontSize: '0.7em' }}>{suffix}</span>}
              </div>
              <div style={{
                fontSize: 13, color: 'var(--text-secondary)',
                lineHeight: 1.55, maxWidth: 220,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
