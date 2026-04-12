import React, { useEffect, useRef, useState } from 'react';
import SectionLabel from '../components/ui/SectionLabel.jsx';

/* ── Failure Archive ── animated red X timeline */
function FailureArchive() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = [
    { date: 'MAR 14', action: 'Clear browser cache', agent: 'J. Park' },
    { date: 'MAR 21', action: 'Clear cache + cookies', agent: 'A. Chen' },
    { date: 'APR 01', action: 'Cache clear (incognito)', agent: 'L. Torres' },
  ];

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map(({ date, action, agent }, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 14,
          padding: '14px 0',
          borderBottom: i < items.length - 1 ? '1px solid #1E1E1E' : 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-12px)',
          transition: `opacity 0.4s ${i * 0.12}s ease, transform 0.4s ${i * 0.12}s ease`,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'rgba(255,59,59,0.15)',
            border: '1px solid rgba(255,59,59,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="2" y1="2" x2="8" y2="8" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="2" x2="2" y2="8" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-primary)', marginBottom: 3 }}>
              {action}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
              {date} · {agent}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: '#FF3B3B', background: 'rgba(255,59,59,0.08)',
            padding: '2px 8px', borderRadius: 2, marginTop: 1,
          }}>
            FAILED
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Environment Fingerprint ── animated tag cloud */
function EnvFingerprint() {
  const tags = [
    { label: 'Windows 11', color: '#4A9EFF', delay: 0 },
    { label: 'Chrome 122', color: '#FF9D4A', delay: 0.08 },
    { label: 'Okta SSO', color: '#C44AFF', delay: 0.16 },
    { label: 'Enterprise', color: 'var(--accent)', accentText: true, delay: 0.24 },
    { label: 'Incognito tested', color: '#4AFF9D', delay: 0.32 },
    { label: '3× cache attempt', color: '#FF4A4A', delay: 0.4 },
    { label: 'Meridian Corp', color: '#4AFFEC', delay: 0.48 },
  ];

  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map(({ label, color, accentText, delay }, i) => (
        <div key={i} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
          color: accentText ? '#0C0C0C' : color,
          background: accentText ? 'var(--accent)' : 'transparent',
          border: accentText ? 'none' : `1px solid ${color}30`,
          padding: '5px 10px', borderRadius: 2,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.85)',
          transition: `opacity 0.35s ${delay}s ease, transform 0.35s ${delay}s ease`,
          letterSpacing: '0.06em',
        }}>
          {label}
        </div>
      ))}
    </div>
  );
}

/* ── Memory Trace ── vertical step trace */
function MemoryTraceAnim() {
  const steps = [
    { ts: '09:42:01', msg: 'Extracted: "cache clear"', status: 'info' },
    { ts: '09:42:01', msg: 'Querying Hindsight memory...', status: 'info' },
    { ts: '09:42:02', msg: 'Match found: 3 failures, same env', status: 'warn' },
    { ts: '09:42:02', msg: 'Conflict score: 0.94 → BLOCK', status: 'error' },
    { ts: '09:42:02', msg: 'Retrieved: SSO token refresh', status: 'success' },
  ];

  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const colors = { info: 'var(--text-secondary)', warn: '#FF9D4A', error: '#FF3B3B', success: '#00C851' };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {steps.map(({ ts, msg, status }, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < steps.length - 1 ? '1px solid #1A1A1A' : 'none' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: 'var(--text-secondary)', letterSpacing: '0.06em',
            flexShrink: 0, paddingTop: 1,
            opacity: visible ? 1 : 0,
            transition: `opacity 0.3s ${i * 0.15}s ease`,
          }}>
            [{ts}]
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: colors[status],
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(4px)',
            transition: `opacity 0.3s ${i * 0.15}s ease, transform 0.3s ${i * 0.15}s ease`,
          }}>
            {msg}
          </div>
        </div>
      ))}
    </div>
  );
}

const CARDS = [
  {
    label: 'FAILURE ARCHIVE',
    title: 'Every failed fix. Remembered.',
    desc: 'VETO maintains a timestamped log of every solution that didn\'t work, tagged by customer, environment, and agent.',
    content: <FailureArchive />,
  },
  {
    label: 'ENVIRONMENT FINGERPRINT',
    title: 'Context is everything.',
    desc: 'OS, browser, SSO provider, plan tier, and session data are captured at every interaction — so conflicts are environment-aware.',
    content: <EnvFingerprint />,
  },
  {
    label: 'MEMORY TRACE',
    title: 'Transparent reasoning.',
    desc: 'See exactly how VETO reached its decision — every query, every match, every confidence score in real time.',
    content: <MemoryTraceAnim />,
  },
];

export default function Features() {
  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <SectionLabel number={3} label="What VETO Knows" />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 1,
          border: '1px solid var(--border)',
        }}>
          {CARDS.map(({ label, title, desc, content }, i) => (
            <div key={i} style={{
              background: 'var(--card-bg)',
              padding: 'clamp(24px, 3vw, 36px)',
              borderRight: i < CARDS.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--accent)', letterSpacing: '0.1em',
                  marginBottom: 12, fontWeight: 600,
                }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {desc}
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                {content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
