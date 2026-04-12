import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useVetoStore } from '../store/useVetoStore.js';
import TicketQueue from '../components/dashboard/TicketQueue.jsx';
import ResponseComposer from '../components/dashboard/ResponseComposer.jsx';
import VetoOverlay from '../components/dashboard/VetoOverlay.jsx';
import MemoryBrief from '../components/dashboard/MemoryBrief.jsx';
import MemoryTrace from '../components/dashboard/MemoryTrace.jsx';

export default function Dashboard() {
  const [params] = useSearchParams();
  const isDemo = params.get('demo') === 'true';
  const navigate = useNavigate();

  const setActiveTicket = useVetoStore((s) => s.setActiveTicket);
  const setDraft = useVetoStore((s) => s.setDraft);
  const showOverlay = useVetoStore((s) => s.showOverlay);
  const addTraceEntry = useVetoStore((s) => s.addTraceEntry);
  const clearTrace = useVetoStore((s) => s.clearTrace);

  // Auto-play Meridian Corp scenario when ?demo=true
  useEffect(() => {
    if (!isDemo) return;
    setActiveTicket('TK-001');
    clearTrace();

    const delays = [
      [600, () => addTraceEntry({ msg: 'Demo mode activated — loading Meridian Corp scenario...' })],
      [1400, () => setDraft('Hi Sarah, let\'s try clearing your browser cache and refreshing the page. This usually resolves the SSO login loop issue.')],
      [1800, () => addTraceEntry({ msg: 'Extracted solution: "clear browser cache"' })],
      [2200, () => addTraceEntry({ msg: 'Querying Hindsight memory for meridian-corp...' })],
      [2800, () => addTraceEntry({ msg: 'Match found: 3 failures, same environment (Chrome 122 / Okta / Win 11)' })],
      [3200, () => addTraceEntry({ msg: 'Conflict score: 0.94 → BLOCK' })],
      [3600, () => addTraceEntry({ msg: 'Alternative retrieved: SSO token refresh via admin panel' })],
      [3800, () => showOverlay({
        conflict: true,
        proposed: 'Clear browser cache',
        failCount: 3,
        lastAttempt: '2026-03-14',
        lastAgent: 'J. Park',
        recommended: 'SSO token refresh via admin panel — navigate to Admin → Users → Meridian Corp → Force SSO token refresh',
        confidence: 0.94,
        customerId: 'meridian-corp',
      })],
    ];

    const timers = delays.map(([delay, fn]) => setTimeout(fn, delay));
    return () => timers.forEach(clearTimeout);
  }, [isDemo]);

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', color: 'var(--text-primary)',
      overflow: 'hidden',
    }}>
      {/* Dashboard Nav */}
      <div style={{
        height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(12,12,12,0.95)', backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            color: 'var(--text-primary)', letterSpacing: '0.12em',
          }}
        >
          VETO©
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'breathe 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            MEMORY SYSTEM ACTIVE
          </span>
          {isDemo && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
              color: '#0C0C0C', background: 'var(--accent)',
              padding: '2px 8px', borderRadius: 2, letterSpacing: '0.1em',
              marginLeft: 8,
            }}>
              DEMO
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* 3-panel layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr 340px', overflow: 'hidden', minHeight: 0 }}>
        {/* Left: Ticket Queue */}
        <div style={{ borderRight: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TicketQueue />
        </div>

        {/* Center: Response Composer */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ResponseComposer />
        </div>

        {/* Right: Intelligence panels */}
        <div style={{
          borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <VetoOverlay />
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <MemoryBrief />
            <MemoryTrace />
          </div>
        </div>
      </div>
    </div>
  );
}
