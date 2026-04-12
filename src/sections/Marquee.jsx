import React from 'react';

const TEXT = 'CORPORATE AMNESIA COSTS $62K PER CUSTOMER  ·  VETO BLOCKS IT  ·  MEMORY-POWERED  ·  HINDSIGHT-INTEGRATED  ·  BUILT FOR SUPPORT TEAMS  ·  ';
const DOUBLED = TEXT + TEXT;

export default function Marquee() {
  return (
    <div
      style={{
        background: 'var(--accent)',
        overflow: 'hidden',
        padding: '14px 0',
        borderTop: '1px solid rgba(232,255,0,0.3)',
        borderBottom: '1px solid rgba(232,255,0,0.3)',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'marquee 40s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
      >
        {/* Doubled content for seamless loop */}
        {[0, 1].map((n) => (
          <span
            key={n}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#0C0C0C',
              textTransform: 'uppercase',
              paddingRight: 0,
            }}
          >
            {DOUBLED}
          </span>
        ))}
      </div>
    </div>
  );
}
