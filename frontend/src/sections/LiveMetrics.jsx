import React, { useEffect, useRef, useState } from 'react';

function useCounter(target, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
          setValue(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return [value, ref];
}

const METRICS = [
  { value: 4821, suffix: '', prefix: '', label: 'Memory conflicts blocked this week' },
  { value: 38,   suffix: '%', prefix: '−', label: 'Average resolution time reduction' },
  { value: 2.4,  suffix: '×', prefix: '', label: 'Customer satisfaction improvement', isFloat: true },
  { value: 0,    suffix: '', prefix: '', label: 'Times Meridian Corp got the same bad advice' },
];

function MetricItem({ metric }) {
  const [displayVal, ref] = useCounter(
    metric.isFloat ? Math.round(metric.value * 10) : metric.value
  );
  const formatted = metric.isFloat
    ? (displayVal / 10).toFixed(1)
    : displayVal.toLocaleString();

  return (
    <div ref={ref} style={{
      padding: 'clamp(28px, 4vw, 48px)',
      borderRight: '1px solid #1E1E1E',
    }}>
      <div style={{
        fontFamily: 'var(--font-sans)', fontWeight: 700,
        fontSize: 'clamp(40px, 5vw, 64px)',
        letterSpacing: '-0.04em', lineHeight: 1,
        color: 'var(--accent)',
        marginBottom: 8,
      }}>
        {metric.prefix}{formatted}{metric.suffix}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 200 }}>
        {metric.label}
      </div>
    </div>
  );
}

export default function LiveMetrics() {
  return (
    <section style={{ background: '#090909', borderBottom: '1px solid #1E1E1E' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 80px) clamp(28px, 4vw, 48px)' }}>
        <div className="grid-4col" style={{ borderTop: '1px solid #1E1E1E', borderLeft: '1px solid #1E1E1E' }}>
          {METRICS.map((m, i) => (
            <MetricItem key={i} metric={m} />
          ))}
        </div>
        <div style={{
          padding: 'clamp(12px, 2vw, 20px) clamp(28px, 4vw, 48px)',
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-muted)', letterSpacing: '0.04em',
          borderTop: '1px solid #1E1E1E',
        }}>
          Measured across 3 enterprise beta teams. Data updates live.
        </div>
      </div>
    </section>
  );
}
