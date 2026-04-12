import React, { useState, useRef, useEffect } from 'react';
import { useVetoStore } from '../../store/useVetoStore.js';

export default function MemoryTrace() {
  const traceLog = useVetoStore((s) => s.traceLog);
  const [expanded, setExpanded] = useState(true);
  const bottomRef = useRef();

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (expanded && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [traceLog, expanded]);

  const getColor = (msg) => {
    if (msg.includes('BLOCK') || msg.includes('Conflict') || msg.includes('⊘') || msg.includes('Match found')) return '#FF9D4A';
    if (msg.includes('ERROR') || msg.includes('✗')) return '#FF3B3B';
    if (msg.includes('Alternative') || msg.includes('retrieved') || msg.includes('✓') || msg.includes('safe')) return '#00C851';
    return 'var(--text-secondary)';
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: '100%', background: 'none', border: 'none',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
          padding: '12px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          MEMORY TRACE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {traceLog.length > 0 && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: 'var(--text-secondary)', background: 'var(--border)',
              padding: '1px 6px', borderRadius: 2,
            }}>
              {traceLog.length}
            </span>
          )}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            display: 'block',
          }}>
            ↑
          </span>
        </div>
      </button>

      {/* Log entries */}
      {expanded && (
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '10px 16px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {traceLog.length === 0 ? (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--border)', textAlign: 'center', paddingTop: 20,
              lineHeight: 1.6,
            }}>
              No trace yet.<br />Start typing to see VETO reasoning.
            </div>
          ) : (
            traceLog.map(({ msg, ts }, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  animation: 'trace-enter 0.25s ease both',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  color: '#2A2A2A', letterSpacing: '0.04em',
                  flexShrink: 0, paddingTop: 1, whiteSpace: 'nowrap',
                }}>
                  [{ts}]
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: getColor(msg), lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}>
                  {msg}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
