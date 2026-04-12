import React, { useEffect, useRef } from 'react';
import SectionLabel from '../components/ui/SectionLabel.jsx';

/* Each snapshot card shows a realistic VETO interface state */
function SnapshotCard({ stage, interaction, label, memoryState, conflicts, recall, isActive }) {
  const failedItems = memoryState.failed || [];
  const successItems = memoryState.resolved || [];

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 4,
      overflow: 'hidden',
      flex: 1,
      minWidth: 0,
      position: 'relative',
      transition: 'border-color 300ms ease',
    }}>
      {/* Stage badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: isActive ? '#0C0C0C' : 'var(--text-secondary)',
        background: isActive ? 'var(--accent)' : 'var(--border)',
        padding: '3px 8px', borderRadius: 2, letterSpacing: '0.08em',
        fontWeight: 600,
      }}>
        {stage}
      </div>

      {/* Card header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 4 }}>
          INTERACTION {interaction}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          Meridian Corp — SSO Issue
        </div>
      </div>

      {/* VETO Intelligence panel */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 10 }}>
          VETO INTELLIGENCE
        </div>

        {/* Memory state */}
        {failedItems.length === 0 && successItems.length === 0 ? (
          <div style={{
            padding: '8px 10px', background: '#111', border: '1px solid var(--border)',
            borderRadius: 2, display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-secondary)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
              No memory yet — learning begins
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {failedItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', background: 'rgba(255,59,59,0.05)',
                border: '1px solid rgba(255,59,59,0.15)', borderRadius: 2,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="2" y1="2" x2="8" y2="8" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="2" y2="8" stroke="#FF3B3B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#FF7B7B' }}>{item}</span>
              </div>
            ))}
            {successItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', background: 'rgba(0,200,81,0.05)',
                border: '1px solid rgba(0,200,81,0.15)', borderRadius: 2,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <polyline points="2,5 4.5,7.5 8,3" stroke="#00C851" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00C851' }}>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{
        padding: '12px 16px',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 8,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', marginBottom: 4, letterSpacing: '0.06em' }}>
            CONFLICTS
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700,
            fontSize: 20, color: conflicts > 0 ? 'var(--accent)' : 'var(--text-secondary)',
          }}>
            {conflicts}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', marginBottom: 4, letterSpacing: '0.06em' }}>
            RECALL
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontWeight: 700,
            fontSize: 20, color: recall ? 'var(--accent)' : 'var(--text-secondary)',
          }}>
            {recall || '—'}
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--border)',
        background: isActive ? 'rgba(232,255,0,0.04)' : 'transparent',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          letterSpacing: '0.1em', fontWeight: 600,
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}

const SNAPSHOTS = [
  {
    stage: 'DAY 1',
    interaction: 1,
    label: 'BASELINE — NO MEMORY',
    isActive: false,
    conflicts: 0,
    recall: null,
    memoryState: { failed: [], resolved: [] },
  },
  {
    stage: 'WEEK 2',
    interaction: 7,
    label: 'LEARNING — 1 CONFLICT BLOCKED',
    isActive: true,
    conflicts: 1,
    recall: '61%',
    memoryState: {
      failed: ['Cache clear (flagged)'],
      resolved: [],
    },
  },
  {
    stage: 'MONTH 1',
    interaction: 23,
    label: 'EXPERT — 94% RECALL',
    isActive: false,
    conflicts: 3,
    recall: '94%',
    memoryState: {
      failed: ['Cache clear ×3', 'Extension disable ×1'],
      resolved: ['SSO token refresh ✓'],
    },
  },
];

export default function MemoryArc() {
  const headRef = useRef();
  const cardsRef = useRef();
  const quoteRef = useRef();

  useEffect(() => {
    const els = [headRef.current, cardsRef.current, quoteRef.current];
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) e.target.classList.add('visible'); },
      { threshold: 0.1 }
    );
    els.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header */}
        <div ref={headRef} className="reveal" style={{ marginBottom: 16 }}>
          <SectionLabel number={5} label="The Learning Curve" />
        </div>
        <div ref={headRef} style={{ marginBottom: 60 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(36px, 5vw, 72px)',
            color: 'var(--text-primary)', lineHeight: 1.1,
            letterSpacing: '-0.02em', marginTop: 16,
          }}>
            It gets smarter.{' '}
            <span style={{ color: 'var(--accent)' }}>Every single ticket.</span>
          </h2>
        </div>

        {/* 3 snapshots */}
        <div
          ref={cardsRef}
          className="reveal"
          style={{
            display: 'flex',
            gap: 'clamp(12px, 2vw, 20px)',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            paddingBottom: 4,
          }}
        >
          {SNAPSHOTS.map((s, i) => (
            <SnapshotCard key={i} {...s} />
          ))}
        </div>

        {/* Connector line between cards */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          margin: '20px 0',
          overflow: 'hidden',
        }}>
          {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 1 ? 'var(--accent)' : 'var(--border)', flexShrink: 0 }} />
              {i < 2 && (
                <div style={{
                  flex: 1, height: 1,
                  background: `linear-gradient(90deg, ${i === 0 ? 'var(--border)' : 'var(--accent)'}, ${i === 0 ? 'var(--accent)' : 'var(--border)'})`,
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Caption */}
        <div ref={quoteRef} className="reveal" style={{ marginTop: 16 }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            color: 'var(--text-secondary)', textAlign: 'center',
            maxWidth: 640, margin: '0 auto',
            lineHeight: 1.4,
          }}>
            "This progression is what memory-powered agents feel like."
          </p>
        </div>
      </div>
    </section>
  );
}
