import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVetoStore } from '../../store/useVetoStore.js';

export default function VetoOverlay() {
  const overlayVisible = useVetoStore((s) => s.overlayVisible);
  const conflictData = useVetoStore((s) => s.conflictData);
  const useRecommended = useVetoStore((s) => s.useRecommended);
  const override = useVetoStore((s) => s.override);

  return (
    <AnimatePresence>
      {overlayVisible && conflictData && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            borderBottom: '1px solid rgba(255,59,59,0.4)',
            background: 'linear-gradient(180deg, rgba(255,59,59,0.06) 0%, transparent 100%)',
            flexShrink: 0,
          }}
        >
          {/* Alert header */}
          <div style={{
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid rgba(255,59,59,0.2)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF3B3B" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              color: '#FF3B3B', letterSpacing: '0.08em',
            }}>
              MEMORY CONFLICT DETECTED
            </span>
          </div>

          {/* Conflict detail */}
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Proposed */}
            <div style={{
              background: 'rgba(255,59,59,0.06)', border: '1px solid rgba(255,59,59,0.15)',
              borderRadius: 2, padding: '8px 12px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', marginBottom: 3, letterSpacing: '0.08em' }}>
                PROPOSED
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#FF7B7B' }}>
                {conflictData.proposed}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', marginTop: 4 }}>
                Failed <span style={{ color: '#FF3B3B', fontWeight: 700 }}>{conflictData.failCount}×</span>
                {conflictData.lastAttempt && ` · Last: ${conflictData.lastAttempt}`}
                {conflictData.lastAgent && ` · Agent: ${conflictData.lastAgent}`}
              </div>
            </div>

            {/* Recommended */}
            <div style={{
              background: 'rgba(0,200,81,0.06)', border: '1px solid rgba(0,200,81,0.2)',
              borderRadius: 2, padding: '8px 12px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#00C851', marginBottom: 3, letterSpacing: '0.08em' }}>
                ✓ RECOMMENDED
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                {conflictData.recommended}
              </div>
            </div>

            {/* Confidence */}
            {conflictData.confidence && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  CONFIDENCE
                </span>
                <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 1 }}>
                  <div style={{
                    height: '100%', borderRadius: 1,
                    width: `${Math.round((conflictData.confidence <= 1 ? conflictData.confidence * 100 : conflictData.confidence))}%`,
                    background: 'var(--green, #00C851)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00C851', fontWeight: 600 }}>
                  {Math.round(conflictData.confidence <= 1 ? conflictData.confidence * 100 : conflictData.confidence)}%
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{
            padding: '10px 16px', display: 'flex', gap: 8,
            borderTop: '1px solid rgba(255,59,59,0.15)',
          }}>
            <button
              onClick={useRecommended}
              style={{
                flex: 1, background: 'var(--accent)', color: '#0C0C0C',
                border: 'none', padding: '9px 0', borderRadius: 0,
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', cursor: 'pointer',
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              USE RECOMMENDED FIX
            </button>
            <button
              onClick={override}
              style={{
                background: 'transparent', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', padding: '9px 14px', borderRadius: 0,
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '0.08em', cursor: 'pointer',
                transition: 'color 150ms ease, border-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              OVERRIDE
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
