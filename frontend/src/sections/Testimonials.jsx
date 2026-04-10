import React from 'react';

const QUOTES = [
  {
    text: '"The first week, I thought it was just a fancy alert. By week four, it knew our top client better than I did."',
    name: 'Priya Nair',
    role: 'Senior Support Lead',
    company: 'Meridian Corp',
  },
  {
    text: '"We went from re-suggesting the same fix 3 times per customer to catching it before it ever left the composer."',
    name: 'Marcus Webb',
    role: 'Head of CX',
    company: 'Praxis Systems',
  },
  {
    text: '"VETO surfaced a fix I didn\'t know existed. The customer resolved in 8 minutes."',
    name: 'Sara Reyes',
    role: 'Support Engineer',
    company: 'Volta Analytics',
  },
];

const PILLS = [
  { value: '−41%', label: 'Time to Resolution' },
  { value: '89%', label: 'Conflict Detection Rate' },
  { value: '0', label: 'Repeat Failures' },
];

export default function Testimonials() {
  return (
    <section style={{ borderBottom: '1px solid #1E1E1E' }}>
      <div style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)', maxWidth: 1280, margin: '0 auto' }}>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 20 }}>
          [06]&nbsp;&nbsp;BETA FEEDBACK
        </div>

        {/* Quotes grid */}
        <div className="grid-3col" style={{ gap: 'clamp(24px, 4vw, 48px)', marginBottom: 56 }}>
          {QUOTES.map((q, i) => (
            <div key={i} style={{
              paddingTop: 24,
              borderTop: '1px solid #1E1E1E',
            }}>
              <blockquote style={{
                fontFamily: 'var(--font-sans)', fontSize: 15,
                color: 'var(--text-primary)', lineHeight: 1.65,
                fontStyle: 'normal', fontWeight: 400,
                marginBottom: 20,
              }}>
                {q.text}
              </blockquote>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                  {q.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {q.role},&nbsp;{q.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metric pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', borderTop: '1px solid #1E1E1E', paddingTop: 32 }}>
          {PILLS.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#111111', border: '1px solid #1E1E1E',
              padding: '10px 20px',
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700,
                fontSize: 18, color: 'var(--accent)',
                letterSpacing: '-0.02em',
              }}>
                {p.value}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
