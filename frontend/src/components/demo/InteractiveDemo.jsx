import React, { useState, useEffect, useRef } from 'react';

/**
 * InteractiveDemo — Step-through scenario replay
 * Used in HowItWorks section to demonstrate the VETO intercept flow
 */

const SCENARIO_STEPS = [
  { label: 'Ticket opened', detail: 'Meridian Corp · SSO loop · TKT-4821', color: '#3A3A3A', delay: 0 },
  { label: 'Agent begins response', detail: '"Have you tried clearing the browser cache—"', color: '#5A5A5A', delay: 1200 },
  { label: 'VETO intercepts', detail: 'Cache clear failed 3× for this customer', color: '#FF3B3B', delay: 2400 },
  { label: 'Alternative surfaced', detail: 'SAML token reset → 8 min resolution', color: '#E8FF00', delay: 3600 },
];

export default function InteractiveDemo() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(-1);
  const timerRef = useRef(null);

  const runDemo = () => {
    setActive(true);
    setStep(0);
    let s = 0;
    timerRef.current = setInterval(() => {
      s++;
      if (s >= SCENARIO_STEPS.length) {
        clearInterval(timerRef.current);
        setTimeout(() => { setActive(false); setStep(-1); }, 1500);
      } else {
        setStep(s);
      }
    }, 1200);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div style={{
      background: '#111111', border: '1px solid #1E1E1E',
      borderRadius: 12, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderBottom: '1px solid #1E1E1E',
        background: '#0E0E0E',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3A3A3A' }}>
          VETO · SCENARIO REPLAY
        </span>
        <button
          onClick={runDemo}
          disabled={active}
          style={{
            background: active ? 'transparent' : 'var(--accent)',
            color: active ? '#3A3A3A' : '#0C0C0C',
            border: active ? '1px solid #2A2A2A' : 'none',
            padding: '4px 12px',
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.06em',
            cursor: active ? 'not-allowed' : 'pointer',
            borderRadius: 4,
          }}
        >
          {active ? 'RUNNING…' : '▶ PLAY SCENARIO'}
        </button>
      </div>

      {/* Steps */}
      <div style={{ padding: '12px 14px' }}>
        {SCENARIO_STEPS.map((s, i) => {
          const isActive = active && step >= i;
          const isCurrent = active && step === i;
          return (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: '8px 0',
              opacity: isActive ? 1 : 0.25,
              transition: 'opacity 400ms ease',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: isActive ? s.color : '#2A2A2A',
                flexShrink: 0, marginTop: 5,
                transition: 'background 400ms ease',
                boxShadow: isCurrent ? `0 0 8px ${s.color}` : 'none',
              }} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: isActive ? s.color : '#3A3A3A',
                  marginBottom: 2, transition: 'color 400ms ease',
                }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 11, color: '#5A5A5A', lineHeight: 1.4 }}>
                  {s.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
