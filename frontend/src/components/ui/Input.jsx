import React from 'react';

/**
 * VETO Design System — Input
 * Dark-themed text input with accent-colored focus state
 */
export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  style: customStyle = {},
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={{
        padding: '13px 16px',
        background: '#111111',
        border: '1px solid #2A2A2A',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        outline: 'none',
        borderRadius: 0,
        transition: 'border-color 150ms ease',
        width: '100%',
        ...customStyle,
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = '#2A2A2A'}
      {...props}
    />
  );
}
