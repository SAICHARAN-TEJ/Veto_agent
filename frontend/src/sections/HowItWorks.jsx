import React, { useState, useEffect, useRef } from 'react';

const STEPS = [
  { num: '01', title: 'Agent drafts a response', detail: 'The support agent types their reply in the compose window as normal. No workflow change required.' },
  { num: '02', title: 'VETO extracts proposed solutions', detail: 'Our NLP layer identifies every actionable suggestion in the draft — "clear cache", "reinstall client", "reset SSO" — in real time.' },
  { num: '03', title: 'Hindsight memory queried', detail: 'Each extracted solution is cross-referenced against the full failure archive for this customer, environment, and ticket type. <600ms.' },
  { num: '04', title: 'Conflict detected → agent redirected', detail: 'If a proposed solution has failed before, VETO blocks it and surfaces the highest-probability alternative from memory.' },
];

const SCENARIO_STEPS = [
  { label: 'Ticket opened', detail: 'Meridian Corp · SSO loop · TKT-4821', color: '#3A3A3A' },
  { label: 'Agent begins response', detail: '"Have you tried clearing the browser cache—"', color: '#5A5A5A' },
  { label: 'VETO intercepts', detail: 'Cache clear failed 3× for this customer', color: '#FF3B3B' },
  { label: 'Alternative surfaced', detail: 'SAML token reset → 8 min resolution', color: '#E8FF00' },
];

export default function HowItWorks() {
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const timerRef = useRef(null);

  const runDemo = () => {
    setDemoActive(true);
    setDemoStep(0);
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      if (step >= SCENARIO_STEPS.length) {
        clearInterval(timerRef.current);
        setTimeout(() => { setDemoActive(false); setDemoStep(0); }, 1500);
      } else {
        setDemoStep(step);
      }
    }, 1200);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <section style={{ borderBottom: '1px solid #1E1E1E' }}>
      <div style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)', maxWidth: 1280, margin: '0 auto' }}>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 20 }}>
          [02]&nbsp;&nbsp;THE INTERCEPT
        </div>

        <div className="grid-2col" style={{ alignItems: 'start' }}>
          {/* Steps */}
          <div>
            {STEPS.map((step, i) => (
              <div key={i}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '48px 1fr',
                  gap: 20, padding: '24px 0', alignItems: 'start',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                    color: 'var(--text-secondary)', paddingTop: 4,
                  }}>
                    {step.num}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-sans)', fontWeight: 600,
                      fontSize: 17, color: 'var(--text-primary)', marginBottom: 6,
                      letterSpacing: '-0.02em',
                    }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                      {step.detail}
                    </div>
                  </div>
                </div>
                {i < STEPS.length - 1 && <div style={{ borderTop: '1px solid #1E1E1E' }} />}
              </div>
            ))}
          </div>

          {/* Interactive demo */}
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
                disabled={demoActive}
                style={{
                  background: demoActive ? 'transparent' : 'var(--accent)',
                  color: demoActive ? '#3A3A3A' : '#0C0C0C',
                  border: demoActive ? '1px solid #2A2A2A' : 'none',
                  padding: '4px 12px',
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.06em',
                  cursor: demoActive ? 'not-allowed' : 'pointer',
                  borderRadius: 4,
                  transition: 'all 200ms ease',
                }}
              >
                {demoActive ? 'RUNNING…' : '▶ PLAY SCENARIO'}
              </button>
            </div>

            {/* Scenario context */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #1A1A1A' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3A3A3A', marginBottom: 6 }}>
                SCENARIO: MERIDIAN CORP · SSO LOOP
              </div>
              <div style={{ fontSize: 12, color: '#5A5A5A', lineHeight: 1.5 }}>
                Customer has reported SSO authentication loop. Previous ticket history loaded.
              </div>
            </div>

            {/* Steps */}
            <div style={{ padding: '12px 14px' }}>
              {SCENARIO_STEPS.map((s, i) => {
                const isActive = demoActive && demoStep >= i;
                const isCurrent = demoActive && demoStep === i;
                return (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '8px 0',
                    alignItems: 'flex-start',
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

            {/* Footer */}
            {!demoActive && demoStep === 0 && (
              <div style={{
                padding: '12px 14px', borderTop: '1px solid #1A1A1A',
                fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3A3A3A', textAlign: 'center',
              }}>
                Press Play to replay the interception
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
