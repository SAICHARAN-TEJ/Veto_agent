import React, { useEffect, useRef, useState } from 'react';
import SectionLabel from '../components/ui/SectionLabel.jsx';

const STEPS = [
  { n: '01', title: 'Agent drafts a response', desc: 'The support agent begins typing their reply in the composer. VETO monitors the draft in real-time with a 400ms analysis window.' },
  { n: '02', title: 'VETO extracts proposed solutions', desc: 'A language model extracts the specific proposed action from the draft text — "clear cache", "reinstall app", "reset password" — with high precision.' },
  { n: '03', title: 'Hindsight memory queried', desc: 'The extracted solution is matched against the customer\'s full failure history, tagged by environment, plan tier, SSO provider, and timestamp.' },
  { n: '04', title: 'Conflict detected → agent redirected', desc: 'If this exact solution has failed for this customer before, VETO blocks the send and surfaces the fix that actually works — pulled from memory.' },
];

const DEMO_SCRIPT = [
  { role: 'agent', text: 'Hi Sarah — can you try clearing your browser cache and refreshing?', ts: '09:41' },
  { role: 'veto', text: '⊘ BLOCKED — Cache clear failed 3× for Meridian Corp. Redirecting...', ts: '09:41' },
  { role: 'agent', text: 'Actually — let me escalate your SSO token via the admin panel instead.', ts: '09:43' },
  { role: 'customer', text: 'That worked! I\'m in. Thank you!', ts: '09:51' },
];

export default function HowItWorks() {
  const ref = useRef();
  const [playing, setPlaying] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('visible'); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const play = () => {
    if (playing) return;
    setPlaying(true);
    setVisibleLines(0);
    DEMO_SCRIPT.forEach((_, i) => {
      timerRef.current = setTimeout(() => {
        setVisibleLines(i + 1);
        if (i === DEMO_SCRIPT.length - 1) setTimeout(() => setPlaying(false), 1500);
      }, i * 1800);
    });
  };

  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div ref={ref} className="reveal" style={{ marginBottom: 64 }}>
          <SectionLabel number={2} label="The Intercept" />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(460px, 100%), 1fr))',
          gap: 'clamp(40px, 6vw, 80px)',
        }}>
          {/* Steps */}
          <div>
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={i}>
                <div style={{ display: 'flex', gap: 24, padding: 'clamp(20px, 3vw, 32px) 0' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    color: 'var(--accent)', fontWeight: 600,
                    letterSpacing: '0.08em', flexShrink: 0,
                    paddingTop: 4,
                  }}>
                    {n}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
                      color: 'var(--text-primary)', marginBottom: 8,
                    }}>
                      {title}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                      {desc}
                    </div>
                  </div>
                </div>
                {i < STEPS.length - 1 && <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />}
              </div>
            ))}
          </div>

          {/* Demo panel */}
          <div>
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F56' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27C93F' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                  MERIDIAN CORP · SSO LOOP SCENARIO
                </span>
              </div>

              {/* Conversation area */}
              <div style={{ padding: 20, minHeight: 200 }}>
                {DEMO_SCRIPT.slice(0, visibleLines).map(({ role, text, ts }, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 14,
                      animation: 'fadeInUp 0.3s ease both',
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9,
                      color: role === 'veto' ? '#FF3B3B' : role === 'agent' ? 'var(--accent)' : 'var(--text-secondary)',
                      letterSpacing: '0.08em', marginBottom: 4,
                      display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                      {role === 'veto' ? '⊘ VETO' : role === 'agent' ? 'AGENT' : 'CUSTOMER'}
                      <span style={{ color: 'var(--border)' }}>{ts}</span>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: 13,
                      color: role === 'veto' ? '#FF7B7B' : 'var(--text-primary)',
                      lineHeight: 1.5,
                      paddingLeft: role === 'veto' ? 0 : 0,
                      background: role === 'veto' ? 'rgba(255,59,59,0.06)' : 'transparent',
                      border: role === 'veto' ? '1px solid rgba(255,59,59,0.2)' : 'none',
                      borderRadius: role === 'veto' ? 2 : 0,
                      padding: role === 'veto' ? '8px 12px' : '0',
                    }}>
                      {text}
                    </div>
                  </div>
                ))}

                {visibleLines === 0 && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>
                    Press play to watch VETO intercept in real time
                  </div>
                )}
              </div>

              {/* Controls */}
              <div style={{
                padding: '12px 16px', borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <button
                  onClick={play}
                  disabled={playing}
                  style={{
                    background: playing ? 'transparent' : 'var(--accent)',
                    color: playing ? 'var(--text-secondary)' : '#0C0C0C',
                    border: playing ? '1px solid var(--border)' : 'none',
                    padding: '8px 16px', borderRadius: 0,
                    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.08em', cursor: playing ? 'not-allowed' : 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  {playing ? '● PLAYING...' : '▶ PLAY SCENARIO'}
                </button>
                {visibleLines > 0 && !playing && (
                  <button
                    onClick={() => setVisibleLines(0)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer',
                      letterSpacing: '0.06em',
                    }}
                  >
                    RESET
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
