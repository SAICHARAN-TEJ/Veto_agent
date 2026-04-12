import React from 'react';

function truncateText(value, limit = 60) {
  const normalized = String(value || '').trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit)}...`;
}

function toPercentage(rate) {
  const numeric = Number(rate);
  const normalized = Number.isFinite(numeric)
    ? (numeric > 1 ? numeric : numeric * 100)
    : 0;
  const clamped = Math.max(0, Math.min(100, Math.round(normalized)));
  return `${clamped}%`;
}

export default function SuggestionStrip({ suggestions, loading, onSelect }) {
  const items = Array.isArray(suggestions) ? suggestions : [];

  return (
    <div
      style={{
        marginTop: 0,
        padding: '0 20px 8px',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          flex: '0 0 auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-secondary)',
          letterSpacing: '0.08em',
          alignSelf: 'center',
          padding: '0 4px',
        }}
      >
        SMART SUGGESTIONS
      </div>
      {loading && (
        <div
          style={{
            flex: '0 0 auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--accent)',
            alignSelf: 'center',
            padding: '0 4px',
          }}
        >
          LOADING…
        </div>
      )}
      {!loading && items.length === 0 && (
        <div
          style={{
            flex: '0 0 auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-secondary)',
            alignSelf: 'center',
            padding: '0 4px',
          }}
        >
          No suggestions yet
        </div>
      )}
      {items.map((item, index) => (
        <button
          key={`${item.solution}-${index}`}
          type="button"
          onClick={() => onSelect(item.solution)}
          style={{
            flex: '0 0 auto',
            background: '#12161C',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid #00C851',
            borderRadius: 999,
            padding: '7px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            lineHeight: 1.3,
            cursor: 'pointer',
            transition: 'background 160ms ease, border-color 160ms ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = '#1A2029';
            event.currentTarget.style.borderColor = 'rgba(0,200,81,0.3)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = '#12161C';
            event.currentTarget.style.borderColor = 'var(--border)';
          }}
          title={item.solution}
        >
          {truncateText(item.solution, 60)} · {toPercentage(item.successRate)}
        </button>
      ))}
    </div>
  );
}
