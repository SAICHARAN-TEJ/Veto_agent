import React from 'react';
import { useVetoStore } from '../../store/useVetoStore.js';

const STATUS_COLORS = {
  active: 'var(--accent)',
  resolved: '#00C851',
  flagged: '#FF9D4A',
};

const FILTERS = ['all', 'active', 'resolved', 'flagged'];

export default function TicketQueue() {
  const activeTicketId = useVetoStore((s) => s.activeTicketId);
  const filter = useVetoStore((s) => s.filter);
  const setActiveTicket = useVetoStore((s) => s.setActiveTicket);
  const setFilter = useVetoStore((s) => s.setFilter);
  const getFilteredTickets = useVetoStore((s) => s.getFilteredTickets);
  const tickets = getFilteredTickets();

  return (
    <>
      {/* Panel header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          TICKET QUEUE
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
          color: 'var(--accent)', background: 'rgba(232,255,0,0.1)',
          padding: '2px 8px', borderRadius: 2,
        }}>
          {tickets.length}
        </span>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        overflowX: 'auto',
      }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flex: 1, background: 'none',
              border: 'none', borderBottom: filter === f ? '2px solid var(--accent)' : '2px solid transparent',
              padding: '8px 4px',
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'color 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tickets.map((ticket) => {
          const isActive = ticket.id === activeTicketId;
          return (
            <button
              key={ticket.id}
              onClick={() => setActiveTicket(ticket.id)}
              style={{
                width: '100%', background: isActive ? '#1A1A1A' : 'transparent',
                border: 'none',
                borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                borderBottom: '1px solid var(--border)',
                padding: '14px 14px 14px 12px',
                textAlign: 'left', cursor: 'pointer',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#111'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Company + ID */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 150ms ease',
                }}>
                  {ticket.company}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)' }}>
                  {ticket.id}
                </span>
              </div>

              {/* Issue */}
              <div style={{
                fontSize: 12, color: 'var(--text-secondary)',
                lineHeight: 1.4, marginBottom: 8,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {ticket.issue}
              </div>

              {/* Tag + status */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  color: 'var(--text-secondary)', background: '#1A1A1A',
                  border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 2,
                }}>
                  {ticket.tag}
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  color: STATUS_COLORS[ticket.status] || 'var(--text-secondary)',
                }}>
                  <span style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: STATUS_COLORS[ticket.status] || 'var(--text-secondary)',
                  }} />
                  {ticket.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
