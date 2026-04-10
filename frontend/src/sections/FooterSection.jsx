import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FooterSection() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <footer style={{ borderTop: '1px solid #1E1E1E', background: '#090909' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px) 40px' }}>

        {/* Massive logotype */}
        <div style={{
          fontSize: 'clamp(72px, 18vw, 220px)',
          fontFamily: 'var(--font-sans)', fontWeight: 700,
          letterSpacing: '-0.05em', lineHeight: 0.85,
          color: '#111111',
          WebkitTextStroke: '1px #1E1E1E',
          userSelect: 'none',
          marginBottom: 'clamp(40px, 6vw, 80px)',
          position: 'relative',
        }}>
          VETO
          {/* Accent dot */}
          <span style={{ color: 'var(--accent)', WebkitTextStroke: 'none' }}>.</span>
        </div>

        {/* Bottom bar — split layout */}
        <div className="grid-2col" style={{ alignItems: 'end', paddingTop: 32, borderTop: '1px solid #1E1E1E' }}>

          {/* Left: CTA block */}
          <div>
            <p style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 'clamp(22px, 3vw, 36px)', lineHeight: 1.25,
              color: 'var(--text-primary)', marginBottom: 24,
              fontWeight: 400,
            }}>
              Your support team has<br />30 seconds before<br />frustration becomes churn.
            </p>

            {/* Waitlist form */}
            {submitted ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 22px',
                border: '1px solid rgba(232,255,0,0.25)',
                background: 'rgba(232,255,0,0.06)',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent)', display: 'inline-block'
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: 'var(--accent)', letterSpacing: '0.06em'
                }}>
                  YOU'RE ON THE LIST — WE'LL BE IN TOUCH
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 0, maxWidth: 420 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="work@company.com"
                  required
                  style={{
                    flex: 1,
                    padding: '13px 16px',
                    background: '#111111',
                    border: '1px solid #2A2A2A',
                    borderRight: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    outline: 'none',
                    borderRadius: 0,
                    transition: 'border-color 150ms ease',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = '#2A2A2A'}
                />
                <button
                  type="submit"
                  style={{
                    padding: '13px 20px',
                    background: 'var(--accent)', color: '#0C0C0C',
                    fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    border: 'none', cursor: 'pointer',
                    borderRadius: 0, flexShrink: 0,
                    transition: 'opacity 150ms ease',
                  }}
                  onMouseEnter={e => e.target.style.opacity = '0.85'}
                  onMouseLeave={e => e.target.style.opacity = '1'}
                >
                  Join Waitlist
                </button>
              </form>
            )}

            <p style={{
              marginTop: 12,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-muted)', letterSpacing: '0.04em'
            }}>
              No spam. Enterprise pricing. We'll reach out within 48h.
            </p>
          </div>

          {/* Right: nav links + meta */}
          <div style={{ textAlign: 'right' }}>
            <nav style={{ display: 'flex', gap: 24, justifyContent: 'flex-end', marginBottom: 24, flexWrap: 'wrap' }}>
              {['Product', 'Pricing', 'Enterprise', 'Docs'].map(link => (
                <span
                  key={link}
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: 12,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    borderBottom: '1px solid transparent',
                    paddingBottom: 2,
                    transition: 'color 150ms ease, border-color 150ms ease',
                  }}
                  onMouseEnter={e => {
                    e.target.style.color = 'var(--text-primary)';
                    e.target.style.borderBottomColor = 'var(--text-primary)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.color = 'var(--text-secondary)';
                    e.target.style.borderBottomColor = 'transparent';
                  }}
                >
                  {link}
                </span>
              ))}
            </nav>

            {/* Dashboard link */}
            <button
              onClick={() => navigate('/app')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent',
                border: '1px solid #2A2A2A',
                padding: '10px 18px',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text-secondary)', letterSpacing: '0.06em',
                cursor: 'pointer', marginBottom: 32,
                transition: 'all 150ms ease', borderRadius: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#2A2A2A';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              OPEN CONSOLE
            </button>

            {/* Legal */}
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-muted)', letterSpacing: '0.04em', lineHeight: 1.8,
            }}>
              © 2025 VETO Systems Inc.<br />
              Privacy · Terms · Security
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
