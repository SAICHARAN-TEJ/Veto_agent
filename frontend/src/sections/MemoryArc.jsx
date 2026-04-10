import React from 'react';

const SNAPSHOTS = [
  {
    day: 'DAY 1 — BASELINE',
    label: 'Interaction 1',
    status: 'No conflicts detected',
    statusColor: '#3A3A3A',
    accuracy: null,
    items: [
      { text: 'Response drafted', ok: true },
      { text: 'Memory queried', ok: true },
      { text: 'No prior history found', ok: false, neutral: true },
      { text: 'Generic advice sent', ok: false },
    ],
    tag: 'LEARNING',
    tagColor: '#3A3A3A',
  },
  {
    day: 'WEEK 2 — LEARNING',
    label: 'Interaction 7',
    status: '1 conflict blocked',
    statusColor: '#FF3B3B',
    accuracy: '61%',
    items: [
      { text: 'Response drafted', ok: true },
      { text: 'Cache clear detected', ok: true },
      { text: 'Match: TKT-4789 (failed)', ok: false, conflict: true },
      { text: 'Alternative suggested', ok: true },
    ],
    tag: 'CALIBRATING',
    tagColor: '#FF3B3B',
  },
  {
    day: 'MONTH 1 — EXPERT',
    label: 'Interaction 23',
    status: '3 conflicts pre-empted',
    statusColor: '#E8FF00',
    accuracy: '94%',
    items: [
      { text: '3 solutions pre-screened', ok: true },
      { text: 'Frustration score: HIGH', ok: false, warn: true },
      { text: 'Escalation path loaded', ok: true },
      { text: 'Meridian Corp profile: 94% recall', ok: true, accent: true },
    ],
    tag: 'EXPERT',
    tagColor: '#E8FF00',
  },
];

export default function MemoryArc() {
  return (
    <section style={{ borderBottom: '1px solid #1E1E1E' }}>
      <div style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)', maxWidth: 1280, margin: '0 auto' }}>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 20 }}>
          [05]&nbsp;&nbsp;THE LEARNING CURVE
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(32px, 4vw, 54px)',
          letterSpacing: '-0.02em', lineHeight: 1.1,
          color: 'var(--text-primary)',
          maxWidth: 560, marginBottom: 60,
        }}>
          It gets smarter. Every single ticket.
        </h2>

        {/* Three snapshots */}
        <div className="grid-3col" style={{ gap: 1, background: '#1E1E1E', marginBottom: 48 }}>
          {SNAPSHOTS.map((snap, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', padding: 'clamp(20px, 3vw, 32px)' }}>
              {/* Day label */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
                color: 'var(--text-muted)', marginBottom: 12,
              }}>
                {snap.day}
              </div>

              {/* Snapshot UI mockup */}
              <div style={{
                background: '#0E0E0E', border: '1px solid #1E1E1E',
                borderRadius: 8, overflow: 'hidden', marginBottom: 16,
              }}>
                {/* Mock header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderBottom: '1px solid #1E1E1E',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#2A2A2A' }}>
                    {snap.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    color: snap.tagColor,
                    background: snap.tagColor === '#E8FF00' ? 'rgba(232,255,0,0.08)'
                      : snap.tagColor === '#FF3B3B' ? 'rgba(255,59,59,0.08)' : 'rgba(255,255,255,0.04)',
                    padding: '2px 6px', borderRadius: 3,
                  }}>
                    {snap.tag}
                  </span>
                </div>

                {/* Items */}
                <div style={{ padding: '10px 12px' }}>
                  {snap.items.map((item, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '4px 0', fontSize: 11, color: '#5A5A5A',
                    }}>
                      <span style={{
                        color: item.accent ? '#E8FF00' : item.conflict ? '#FF3B3B' : item.warn ? '#FFB800' : item.neutral ? '#3A3A3A' : item.ok ? '#4A4A4A' : '#3A3A3A',
                        fontSize: 10, fontFamily: 'var(--font-mono)',
                      }}>
                        {item.conflict ? '⊘' : item.ok ? '◎' : '—'}
                      </span>
                      <span style={{
                        color: item.accent ? '#E8FF00' : item.conflict ? '#FF5555' : '#5A5A5A',
                      }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status bar */}
                {snap.accuracy && (
                  <div style={{
                    padding: '8px 12px', borderTop: '1px solid #1E1E1E',
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3A3A3A' }}>
                      Recall accuracy
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: snap.statusColor, fontWeight: 600 }}>
                      {snap.accuracy}
                    </span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: snap.statusColor }}>
                {snap.status}
              </div>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            color: 'var(--text-secondary)', letterSpacing: '-0.01em',
            lineHeight: 1.4,
          }}>
            "This progression is what memory-powered agents feel like."
          </p>
        </div>
      </div>
    </section>
  );
}
