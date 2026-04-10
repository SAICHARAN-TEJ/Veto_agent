import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [blocked, setBlocked] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setBlocked(b => b + Math.floor(Math.random() * 2));
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(12,12,12,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1E1E1E',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(16px, 3vw, 32px)', height: 56,
    }}>
      {/* Wordmark */}
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
        letterSpacing: '0.12em', color: 'var(--text-primary)',
        textTransform: 'uppercase', flexShrink: 0,
      }}>
        VETO©
      </span>

      {/* Center — live status (hidden on mobile) */}
      {!isMobile && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--text-secondary)', letterSpacing: '0.06em',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
            display: 'inline-block', animation: 'breathe 2.5s ease-in-out infinite',
          }} />
          MEMORY SYSTEM ACTIVE&nbsp;&nbsp;//&nbsp;&nbsp;
          <span style={{ color: 'var(--accent)' }}>{blocked.toString().padStart(2, '0')}</span>
          &nbsp;CONFLICTS BLOCKED TODAY&nbsp;&nbsp;//&nbsp;&nbsp;{time}
        </span>
      )}

      {/* CTA button */}
      <button
        onClick={() => navigate('/app')}
        style={{
          background: 'var(--accent)', color: '#0C0C0C',
          border: 'none', padding: isMobile ? '7px 14px' : '8px 18px',
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          cursor: 'pointer', transition: 'opacity 150ms ease', borderRadius: 0,
          flexShrink: 0,
        }}
        onMouseEnter={e => e.target.style.opacity = '0.85'}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        {isMobile ? 'Access' : 'Request Access'}
      </button>
    </nav>
  );
}
