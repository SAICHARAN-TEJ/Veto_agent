import React from 'react';

/**
 * VETO Design System — Button
 * Variants: filled (accent), ghost (transparent + underline), outline
 */
export default function Button({
  children,
  variant = 'filled',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  style: customStyle = {},
  ...props
}) {
  const sizes = {
    sm: { padding: '7px 14px', fontSize: 11 },
    md: { padding: '12px 24px', fontSize: 13 },
    lg: { padding: '14px 28px', fontSize: 14 },
  };

  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 0,
    transition: 'opacity 150ms ease, color 150ms ease, border-color 150ms ease',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    opacity: disabled ? 0.5 : 1,
    ...sizes[size],
  };

  const variants = {
    filled: {
      ...base,
      background: 'var(--accent)',
      color: '#0C0C0C',
    },
    ghost: {
      ...base,
      background: 'transparent',
      color: 'var(--text-secondary)',
      borderBottom: '1px solid #3A3A3A',
      padding: `${sizes[size].padding.split(' ')[0]} 4px`,
    },
    outline: {
      ...base,
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid #2A2A2A',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...variants[variant], ...customStyle }}
      onMouseEnter={e => {
        if (disabled) return;
        if (variant === 'filled') e.currentTarget.style.opacity = '0.85';
        if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.borderBottomColor = 'var(--text-primary)';
        }
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.color = 'var(--accent)';
        }
      }}
      onMouseLeave={e => {
        if (disabled) return;
        if (variant === 'filled') e.currentTarget.style.opacity = '1';
        if (variant === 'ghost') {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderBottomColor = '#3A3A3A';
        }
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = '#2A2A2A';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
