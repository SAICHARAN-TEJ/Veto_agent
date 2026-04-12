import React from 'react';

export default function SectionLabel({ number, label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
      color: 'var(--text-secondary)', textTransform: 'uppercase',
    }}>
      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>[{String(number).padStart(2, '0')}]</span>
      {label}
    </div>
  );
}
