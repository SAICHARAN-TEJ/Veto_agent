import React from 'react';

const LABEL = { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 20 };
const DIVIDER = { borderTop: '1px solid #1E1E1E', margin: '0 clamp(20px, 5vw, 80px)' };

export default function Problem() {
  return (
    <section id="problem" style={{ borderTop: '1px solid #1E1E1E', borderBottom: '1px solid #1E1E1E' }}>
      <div style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)', maxWidth: 1280, margin: '0 auto' }}>

        {/* Section tag */}
        <div style={LABEL}>[01]&nbsp;&nbsp;THE PROBLEM</div>

        {/* Two-column editorial layout */}
        <div className="grid-2col" style={{ alignItems: 'start', marginBottom: 64 }}>
          {/* Pull quote */}
          <blockquote style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(24px, 3vw, 38px)',
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            paddingLeft: 20,
            borderLeft: '3px solid var(--accent)',
          }}>
            "She was the fourth agent to suggest clearing the cache. The customer had already told three others it didn't work."
          </blockquote>

          {/* Body copy */}
          <div style={{ paddingTop: 8 }}>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 20 }}>
              Every support team carries a form of <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>fragmented memory</strong>. 
              Each agent sees a fresh ticket. Each ticket is isolated from the last. The result: the same broken advice 
              gets recycled across weeks, agents, and escalations.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 20 }}>
              The customer's frustration compounds with each recurrence. We call this <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>solution fatigue</strong> — 
              the point where a customer stops believing your team can help them. Resolution time triples. Satisfaction collapses.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Beneath the performance metrics lies something more corrosive: <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>brand erosion</strong>. 
              When a customer has to repeat themselves to three agents, they don't just lose trust in the product — 
              they lose trust in the organization.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid-3col" style={{ gap: 1, background: '#1E1E1E', border: '1px solid #1E1E1E' }}>
          {[
            { number: '67%', label: 'of customers have repeated a failed fix to multiple support agents' },
            { number: '4.2×', label: 'longer average resolution when corporate amnesia is present' },
            { number: '1 in 3', label: 'churned enterprise customers cite "feeling ignored" as primary reason' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: 'clamp(24px, 4vw, 40px)',
              background: 'var(--bg)',
            }}>
              <div style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700,
                fontSize: 'clamp(36px, 5vw, 56px)',
                letterSpacing: '-0.04em', lineHeight: 1,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}>
                {stat.number}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 220 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
