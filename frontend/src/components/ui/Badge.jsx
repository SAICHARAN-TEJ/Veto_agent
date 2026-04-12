import React from 'react';

/**
 * VETO Design System — Badge
 * Status indicator pills used throughout the UI
 */
export default function Badge({
  children,
  variant = 'default', // default, accent, danger, success
  style: customStyle = {},
}) {
  const variants = {
    default: {
      background: 'rgba(148,163,184,0.06)',
      color: 'var(--text-secondary)',
      border: '1px solid #1E1E1E',
    },
    accent: {
      background: 'rgba(232,255,0,0.08)',
      color: 'var(--accent)',
      border: '1px solid rgba(232,255,0,0.25)',
    },
    danger: {
      background: 'rgba(255,59,59,0.08)',
      color: '#FF3B3B',
      border: '1px solid rgba(255,59,59,0.25)',
    },
    success: {
      background: 'rgba(16,185,129,0.08)',
      color: '#34D399',
      border: '1px solid rgba(16,185,129,0.25)',
    },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 8px',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.06em',
      borderRadius: 3,
      ...variants[variant],
      ...customStyle,
    }}>
      {children}
    </span>
  );
}
