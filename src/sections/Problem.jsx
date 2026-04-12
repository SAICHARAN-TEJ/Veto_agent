import React, { useEffect, useRef } from 'react';
import SectionLabel from '../components/ui/SectionLabel.jsx';

const STATS = [
  { value: '67%', label: 'support tickets involve a repeated failed fix' },
  { value: '4.2×', label: 'longer resolution when the same advice is re-suggested' },
  { value: '1 in 3', label: 'customers churned citing "feeling ignored" by support' },
];

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

export default function Problem() {
  const refs = [useRef(), useRef(), useRef(), useRef()];
  refs.forEach(useReveal);

  return (
    <section id="problem" style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Label */}
        <div ref={refs[0]} className="reveal" style={{ marginBottom: 60 }}>
          <SectionLabel number={1} label="The Problem" />
          <div style={{ width: 1, height: 32, background: 'var(--border)', marginLeft: 6, marginTop: 12 }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))',
          gap: 'clamp(40px, 6vw, 100px)',
          marginBottom: 80,
        }}>
          {/* Pull quote */}
          <div ref={refs[1]} className="reveal">
            <blockquote style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              borderLeft: '3px solid var(--accent)',
              paddingLeft: 28,
              margin: 0,
            }}>
              "She was the fourth agent to suggest clearing the cache. The customer had already told three others it didn't work."
            </blockquote>
          </div>

          {/* Body copy */}
          <div ref={refs[2]} className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Fragmented memory</strong> means every support handoff starts from zero. New agents repeat the same diagnostic steps. The customer explains the same problem for the fourth time. Nobody reads the ticket history — it&apos;s too long.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Solution fatigue</strong> is what happens when customers stop trusting your team. Not because your agents are bad — because the system has no memory. The same advice feels like it&apos;s coming from a different person every time.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Brand erosion</strong> is the quiet killer. One bad interaction becomes a pattern. A pattern becomes reputation. Customers don't tweet about resolution time — they tweet about being made to feel invisible.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={refs[3]}
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 0,
            borderTop: '1px solid var(--border)',
          }}
        >
          {STATS.map(({ value, label }, i) => (
            <div
              key={i}
              style={{
                padding: 'clamp(28px, 4vw, 40px) clamp(20px, 3vw, 36px)',
                borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 800,
                color: 'var(--accent)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: 10,
              }}>
                {value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 200 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
