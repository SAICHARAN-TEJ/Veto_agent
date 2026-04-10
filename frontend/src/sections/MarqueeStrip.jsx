import React from 'react';

const TEXT = 'CORPORATE AMNESIA IS COSTING YOU CUSTOMERS  ·  VETO REMEMBERS  ·  4,821 REDUNDANT SUGGESTIONS BLOCKED THIS WEEK  ·  MEMORY-POWERED  ·  HINDSIGHT-INTEGRATED  ·  BUILT FOR SUPPORT TEAMS  ·  ';

export default function MarqueeStrip() {
  return (
    <div style={{
      background: '#0C0C0C',
      borderTop: '1px solid #1E1E1E',
      borderBottom: '1px solid #1E1E1E',
      overflow: 'hidden',
      padding: '12px 0',
    }}>
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'marqueeScroll 40s linear infinite',
          willChange: 'transform',
        }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
      >
        {[TEXT, TEXT].map((t, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11, fontWeight: 500,
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            paddingRight: 0,
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
