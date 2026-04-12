import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONFLICT = {
  company: 'Meridian Corp',
  proposed: 'Clear browser cache',
  failCount: 3,
  lastAttempt: '2026-03-14',
  lastAgent: 'J. Park',
  recommended: 'SSO token refresh via admin panel',
  confidence: 94,
};

export default function VetoAlertCard() {
  const [phase, setPhase] = useState('idle'); // idle | visible | fading
  const timeoutRef = useRef(null);

  const runCycle = () => {
    // idle 3s → show → hold 2.5s → fade → reset
    setPhase('idle');
    timeoutRef.current = setTimeout(() => {
      setPhase('visible');
      timeoutRef.current = setTimeout(() => {
        setPhase('fading');
        timeoutRef.current = setTimeout(() => {
          runCycle();
        }, 400);
      }, 2800);
    }, 3000);
  };

  useEffect(() => {
    runCycle();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div style={{
      width: '100%', maxWidth: 440,
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Card header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
            animation: 'breathe 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            VETO MEMORY SYSTEM
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
          {CONFLICT.company}
        </span>
      </div>

      {/* Ticket composer preview */}
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.06em' }}>
            AGENT DRAFT
          </div>
          <div style={{
            background: '#111',
            border: '1px solid var(--border)',
            borderRadius: 2,
            padding: '10px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--text-primary)',
            lineHeight: 1.5,
          }}>
            Hi Sarah, let's try{' '}
            <span style={{ background: 'rgba(232,255,0,0.12)', color: 'var(--accent)', padding: '0 3px', borderRadius: 2 }}>
              clearing your browser cache
            </span>
            {' '}and cookies, then—
            <span style={{
              display: 'inline-block', width: 2, height: 14,
              background: 'var(--accent)', marginLeft: 2, verticalAlign: 'bottom',
              animation: 'blink 1s step-end infinite',
            }} />
          </div>
        </div>

        {/* VETO overlay — animate in/out */}
        <AnimatePresence>
          {phase === 'visible' && (
            <motion.div
              key="veto-alert"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                border: '1px solid var(--red)',
                borderRadius: 2,
                overflow: 'hidden',
                animation: 'pulse-red 2s ease-in-out infinite',
              }}
            >
              {/* Alert header */}
              <div style={{
                background: 'rgba(255,59,59,0.08)',
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,59,59,0.2)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3B3B" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#FF3B3B', fontWeight: 600, letterSpacing: '0.08em' }}>
                  MEMORY CONFLICT
                </span>
              </div>

              {/* Conflict detail */}
              <div style={{ padding: '12px 14px', background: 'rgba(255,59,59,0.04)' }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>PROPOSED → </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#FF7B7B' }}>{CONFLICT.proposed}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Failed <strong style={{ color: '#FF3B3B' }}>{CONFLICT.failCount}×</strong> for {CONFLICT.company}<br />
                  Last attempt: {CONFLICT.lastAttempt} · Agent: {CONFLICT.lastAgent}
                </div>
              </div>

              {/* Recommended */}
              <div style={{
                padding: '12px 14px',
                borderTop: '1px solid rgba(0,200,81,0.2)',
                background: 'rgba(0,200,81,0.05)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', marginBottom: 4, letterSpacing: '0.06em' }}>
                  ✓ RECOMMENDED
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {CONFLICT.recommended}
                </div>
                <div style={{
                  marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)',
                }}>
                  <span>CONFIDENCE</span>
                  <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 1 }}>
                    <div style={{ height: '100%', width: `${CONFLICT.confidence}%`, background: 'var(--green)', borderRadius: 1 }} />
                  </div>
                  <span style={{ color: 'var(--green)' }}>{CONFLICT.confidence}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status when no conflict */}
        {phase === 'idle' && (
          <div style={{
            border: '1px solid var(--border)', borderRadius: 2,
            padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'breathe 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
              VETO ANALYZING DRAFT...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
