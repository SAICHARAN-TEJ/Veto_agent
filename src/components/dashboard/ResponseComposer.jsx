import React, { useEffect } from 'react';
import { useVetoStore } from '../../store/useVetoStore.js';
import { useVetoAnalysis } from '../../hooks/useVetoAnalysis.js';

export default function ResponseComposer() {
  const activeTicketId = useVetoStore((s) => s.activeTicketId);
  const getActiveTicket = useVetoStore((s) => s.getActiveTicket);
  const draft = useVetoStore((s) => s.draft);
  const setDraft = useVetoStore((s) => s.setDraft);
  const ticket = getActiveTicket();
  const { analyze, isPending } = useVetoAnalysis();

  const handleChange = (e) => {
    const val = e.target.value;
    setDraft(val);
    if (ticket) {
      analyze({
        ticketId: ticket.id,
        draft: val,
        customerId: ticket.customer.id,
        environment: ticket.customer.environment,
      });
    }
  };

  if (!ticket) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12,
      }}>
        SELECT A TICKET
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Panel header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
              {ticket.company}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, maxWidth: 480 }}>
              {ticket.issue}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: 'var(--text-secondary)', background: 'var(--card-bg)',
            border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 2,
            flexShrink: 0,
          }}>
            {ticket.id}
          </div>
        </div>
      </div>

      {/* Ticket history */}
      {ticket.history.length > 0 && (
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0, maxHeight: 180, overflowY: 'auto',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 12 }}>
            HISTORY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ticket.history.map(({ agent, message, ts, outcome }, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', whiteSpace: 'nowrap', paddingTop: 2 }}>
                  {ts.slice(-5)}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ color: 'var(--text-secondary)', marginRight: 6 }}>{agent}:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{message}</span>
                  {outcome === 'failed' && (
                    <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 9, color: '#FF3B3B', background: 'rgba(255,59,59,0.08)', padding: '1px 6px', borderRadius: 2 }}>
                      FAILED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          padding: '10px 20px 6px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            YOUR RESPONSE
          </span>
          {isPending && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', animation: 'breathe 1s ease-in-out infinite' }} />
              ANALYZING...
            </span>
          )}
        </div>

        <textarea
          value={draft}
          onChange={handleChange}
          placeholder="Type your response here. VETO will analyze for conflicts as you type..."
          style={{
            flex: 1, background: 'transparent', border: 'none',
            padding: '16px 20px',
            fontFamily: 'var(--font-body)', fontSize: 14,
            color: 'var(--text-primary)', resize: 'none',
            outline: 'none', lineHeight: 1.65,
          }}
        />

        {/* Send bar */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
            {draft.length} chars
          </div>
          <button
            style={{
              background: draft.length > 0 ? 'var(--accent)' : 'var(--border)',
              color: draft.length > 0 ? '#0C0C0C' : 'var(--text-secondary)',
              border: 'none', padding: '8px 20px', borderRadius: 0,
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', cursor: draft.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 200ms ease',
            }}
          >
            SEND RESPONSE
          </button>
        </div>
      </div>
    </div>
  );
}
