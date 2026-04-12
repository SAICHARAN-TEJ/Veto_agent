import React, { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const logotypeRef = useRef();
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-GB', { hour12: false }));
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll fade-in
  useEffect(() => {
    const el = logotypeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (email.trim()) setJoined(true);
  };

  return (
    <footer style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 80px) clamp(32px, 4vw, 48px)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Giant logotype */}
        <div
          ref={logotypeRef}
          className="reveal"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(80px, 15vw, 200px)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            marginBottom: 'clamp(32px, 4vw, 56px)',
            userSelect: 'none',
          }}
        >
          VETO©
        </div>

        {/* CTA copy */}
        <p style={{
          fontSize: 'clamp(15px, 1.8vw, 20px)',
          color: 'var(--text-secondary)',
          maxWidth: 520, lineHeight: 1.65,
          marginBottom: 32,
        }}>
          Request early access. We&apos;re onboarding <strong style={{ color: 'var(--text-primary)' }}>2 enterprise teams</strong> this quarter.
        </p>

        {/* Email waitlist */}
        {!joined ? (
          <form
            onSubmit={handleJoin}
            style={{ display: 'flex', gap: 0, marginBottom: 64, maxWidth: 480 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@company.com"
              required
              style={{
                flex: 1,
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRight: 'none',
                padding: '12px 16px',
                fontFamily: 'var(--font-body)', fontSize: 14,
                color: 'var(--text-primary)',
                outline: 'none',
                borderRadius: 0,
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--accent)', color: '#0C0C0C',
                border: 'none', padding: '12px 20px',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                fontWeight: 700, letterSpacing: '0.1em',
                cursor: 'pointer', borderRadius: 0,
                textTransform: 'uppercase', flexShrink: 0,
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              JOIN WAITLIST
            </button>
          </form>
        ) : (
          <div style={{
            marginBottom: 64,
            fontFamily: 'var(--font-mono)', fontSize: 13,
            color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polyline points="2,7 5.5,10.5 12,3" stroke="#E8FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            You&apos;re on the list — we&apos;ll be in touch.
          </div>
        )}

        {/* Links */}
        <div style={{
          display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 48,
        }}>
          {[
            { label: 'GitHub', href: 'https://github.com/SAICHARAN-TEJ/Veto_agent' },
            { label: 'Demo', href: '/app?demo=true' },
            { label: 'Built with Hindsight + Groq + Stitch MCP', href: '#' },
          ].map(({ label, href }, i) => (
            <a key={i} href={href} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--text-secondary)', textDecoration: 'none',
              letterSpacing: '0.06em',
              borderBottom: '1px solid transparent',
              paddingBottom: 2,
              transition: 'color 150ms ease, border-color 150ms ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderBottomColor = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
          borderTop: '1px solid var(--border)', paddingTop: 24,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-secondary)', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--accent)', animation: 'breathe 2s ease-in-out infinite',
            }} />
            SYSTEM TIME: {time}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-secondary)', letterSpacing: '0.06em',
          }}>
            VETO© 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
