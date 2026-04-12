import React from 'react';

/**
 * MemorySnapshot — A mini UI mockup showing VETO's memory state at a point in time
 * Used in the MemoryArc section to show learning progression
 */
export default function MemorySnapshot({ label, items, tag, tagColor, accuracy, statusText }) {
  return (
    <div style={{
      background: '#0E0E0E', border: '1px solid #1E1E1E',
      borderRadius: 8, overflow: 'hidden',
    }}>
      {/* Mock header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderBottom: '1px solid #1E1E1E',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#2A2A2A' }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: tagColor,
          background: tagColor === '#E8FF00' ? 'rgba(232,255,0,0.08)'
            : tagColor === '#FF3B3B' ? 'rgba(255,59,59,0.08)' : 'rgba(255,255,255,0.04)',
          padding: '2px 6px', borderRadius: 3,
        }}>
          {tag}
        </span>
      </div>

      {/* Items */}
      <div style={{ padding: '10px 12px' }}>
        {items.map((item, j) => (
          <div key={j} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '4px 0', fontSize: 11, color: '#5A5A5A',
          }}>
            <span style={{
              color: item.accent ? '#E8FF00' : item.conflict ? '#FF3B3B' : item.warn ? '#FFB800' : '#4A4A4A',
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

      {/* Accuracy bar */}
      {accuracy && (
        <div style={{
          padding: '8px 12px', borderTop: '1px solid #1E1E1E',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3A3A3A' }}>
            Recall accuracy
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: tagColor, fontWeight: 600 }}>
            {accuracy}
          </span>
        </div>
      )}
    </div>
  );
}
