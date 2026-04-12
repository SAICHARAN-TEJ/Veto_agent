import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CONFLICTS = [4, 5, 6, 7];

export default function Nav() {
  const navigate = useNavigate();
  const [conflicts, setConflicts] = useState(4);

  useEffect(() => {
    const tick = () => setConflicts((n) => n + Math.floor(Math.random() * 2) + 1);
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(12,12,12,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(20px, 5vw, 60px)',
      height: 52,
    }}>
      {/* Wordmark */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
          color: 'var(--text-primary)', letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        VETO©
      </button>

      {/* Status ticker */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--text-secondary)', letterSpacing: '0.06em',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--accent)', animation: 'breathe 2s ease-in-out infinite',
        }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          MEMORY SYSTEM ACTIVE
          <span style={{ color: 'var(--border)' }}>//</span>
          <span>
            <span
              style={{ color: 'var(--accent)', fontWeight: 600, display: 'inline-block', minWidth: 20 }}
              key={conflicts}
            >
              {String(conflicts).padStart(2, '0')}
            </span>
            {' '}CONFLICTS BLOCKED TODAY
          </span>
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/app')}
        style={{
          background: 'var(--accent)', color: '#0C0C0C',
          border: 'none', borderRadius: 0,
          padding: '8px 16px',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', cursor: 'pointer',
          transition: 'opacity 150ms ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        REQUEST ACCESS
      </button>
    </nav>
  );
}
