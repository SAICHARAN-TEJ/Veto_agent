import React from 'react';
import { useVetoStore } from '../../store/useVetoStore.js';

function FrustrationBar({ score }) {
  const color = score > 70 ? '#FF3B3B' : score > 40 ? '#FF9D4A' : '#00C851';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>FRUSTRATION</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color, fontWeight: 700 }}>{score}/100</span>
      </div>
      <div style={{ height: 3, background: 'var(--border)', borderRadius: 2 }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${score}%`, background: color,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

export default function MemoryBrief() {
  const getActiveTicket = useVetoStore((s) => s.getActiveTicket);
  const ticket = getActiveTicket();
  if (!ticket) return null;
  const { customer } = ticket;

  const ENV_LABELS = [
    { label: customer.environment.os },
    { label: customer.environment.browser },
    { label: customer.environment.sso !== 'None' ? `SSO: ${customer.environment.sso}` : null },
    { label: customer.environment.planTier },
  ].filter((e) => e.label);

  return (
    <div style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          MEMORY INTELLIGENCE
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', background: 'rgba(232,255,0,0.1)', padding: '2px 6px', borderRadius: 2 }}>
          {customer.plan}
        </span>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Customer info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', marginBottom: 2, letterSpacing: '0.06em' }}>CUSTOMER SINCE</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
              {new Date(customer.since).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', marginBottom: 2, letterSpacing: '0.06em' }}>OPEN TICKETS</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: customer.openTickets > 1 ? '#FF9D4A' : 'var(--text-primary)', fontWeight: 500 }}>
              {customer.openTickets}
            </div>
          </div>
        </div>

        {/* Frustration score */}
        <FrustrationBar score={customer.frustrationScore} />

        {/* Top failed solutions */}
        {customer.failedSolutions.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.06em' }}>
              TOP FAILED SOLUTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {customer.failedSolutions.slice(0, 3).map(({ solution, count, lastAttempt }, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px',
                  background: 'rgba(255,59,59,0.05)', border: '1px solid rgba(255,59,59,0.12)',
                  borderRadius: 2,
                }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <line x1="1.5" y1="1.5" x2="7.5" y2="7.5" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="7.5" y1="1.5" x2="1.5" y2="7.5" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {solution}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-secondary)', marginTop: 1 }}>
                      {lastAttempt}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#FF3B3B', fontWeight: 700, flexShrink: 0 }}>
                    ×{count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Environment */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.06em' }}>
            ENVIRONMENT
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {ENV_LABELS.map(({ label }, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'var(--text-secondary)', background: 'var(--card-bg)',
                border: '1px solid var(--border)', padding: '3px 8px', borderRadius: 2,
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
