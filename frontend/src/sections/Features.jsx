import React from 'react';

/* SVG Illustrations for cards */
const FailureArchiveIllustration = () => (
  <svg width="100%" height="70" viewBox="0 0 200 70" fill="none">
    {[0,1,2,3,4].map((i) => (
      <g key={i} transform={`translate(${20 + i * 36}, 0)`}>
        <line x1="10" y1="8" x2="10" y2="62" stroke="#1E1E1E" strokeWidth="1" />
        <circle cx="10" cy={12 + i * 10} r="5" fill="#FF3B3B" fillOpacity={0.15} stroke="#FF3B3B" strokeOpacity={0.4} strokeWidth="1" />
        <line x1="6" y1={12 + i * 10} x2="14" y2={12 + i * 10} stroke="#FF3B3B" strokeOpacity={0.6} strokeWidth="1.5" />
        <line x1="6" y1={12 + i * 10 - 4} x2="14" y2={12 + i * 10 + 4} stroke="#FF3B3B" strokeOpacity={0.6} strokeWidth="1.5" />
      </g>
    ))}
    <text x="0" y="68" fill="#3A3A3A" fontSize="8" fontFamily="JetBrains Mono, monospace">FAILURE TIMELINE</text>
  </svg>
);

const EnvFingerprintIllustration = () => {
  const tags = ['WIN11','CHROME','SSO','ENT','SAML','v4.2','US-EAST'];
  return (
    <svg width="100%" height="70" viewBox="0 0 200 70" fill="none">
      {tags.map((tag, i) => {
        const x = (i % 4) * 48 + 2;
        const y = Math.floor(i / 4) * 22 + 4;
        return (
          <g key={i}>
            <rect x={x} y={y} width={44} height={16} rx="3" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1" />
            <text x={x + 6} y={y + 11} fill={i % 2 === 0 ? '#E8FF00' : '#5A5A5A'} fontSize="7" fontFamily="JetBrains Mono, monospace" fontWeight="600">{tag}</text>
          </g>
        );
      })}
    </svg>
  );
};

const MemoryTraceIllustration = () => (
  <svg width="100%" height="70" viewBox="0 0 200 70" fill="none">
    {[
      { y: 10, label: 'QUERY', w: 60, color: '#E8FF00' },
      { y: 26, label: 'MATCH ×3', w: 80, color: '#FF3B3B' },
      { y: 42, label: 'RANK', w: 50, color: '#5A5A5A' },
      { y: 58, label: 'SURFACE', w: 90, color: '#E8FF00' },
    ].map((row, i) => (
      <g key={i}>
        <rect x="0" y={row.y} width={row.w} height="12" rx="2"
          fill={row.color === '#E8FF00' ? 'rgba(232,255,0,0.08)' : row.color === '#FF3B3B' ? 'rgba(255,59,59,0.08)' : '#1A1A1A'}
          stroke={row.color} strokeOpacity="0.3" strokeWidth="1"
        />
        <text x="6" y={row.y + 9} fill={row.color} fillOpacity="0.7" fontSize="7" fontFamily="JetBrains Mono, monospace">{row.label}</text>
        <line x1={row.w} y1={row.y + 6} x2="195" y2={row.y + 6} stroke="#1E1E1E" strokeWidth="1" strokeDasharray="3,3" />
      </g>
    ))}
  </svg>
);

const CARDS = [
  {
    tag: 'FAILURE ARCHIVE',
    title: 'Failure Archive',
    body: "Every fix that didn't work, indexed forever. No customer will hear the same broken advice twice.",
    illustration: <FailureArchiveIllustration />,
  },
  {
    tag: 'ENV FINGERPRINT',
    title: 'Environment Fingerprint',
    body: 'OS. Browser. SSO. Plan tier. VETO remembers it all — customer context that lives across every ticket.',
    illustration: <EnvFingerprintIllustration />,
  },
  {
    tag: 'MEMORY TRACE',
    title: 'Memory Trace',
    body: 'Watch the AI reasoning process, step by step, in real time. Full transparency into every blocked suggestion.',
    illustration: <MemoryTraceIllustration />,
  },
];

export default function Features() {
  return (
    <section style={{ borderBottom: '1px solid #1E1E1E' }}>
      <div style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 20 }}>
          [03]&nbsp;&nbsp;WHAT VETO KNOWS
        </div>

        <div className="grid-3col" style={{ gap: 1, background: '#1E1E1E' }}>
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                padding: 'clamp(24px, 3vw, 36px)',
                borderRadius: 0,
                cursor: 'default',
                transition: 'background 200ms var(--ease)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#181818'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
            >
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
                color: 'var(--text-muted)', letterSpacing: '0.12em',
                marginBottom: 16,
              }}>
                {card.tag}
              </div>

              <div style={{ marginBottom: 20 }}>
                {card.illustration}
              </div>

              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 600,
                fontSize: 18, color: 'var(--text-primary)',
                letterSpacing: '-0.02em', marginBottom: 10,
              }}>
                {card.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {card.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
