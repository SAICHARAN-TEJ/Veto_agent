import React, { useState, useEffect } from 'react';

/* States: idle → typing → alert → hold → fade → reset */
const CYCLE_MS = 6000;

export default function VetoAlertCard() {
  const [phase, setPhase] = useState('idle'); // idle | typing | alert
  const [typed, setTyped] = useState('');
  const draft = 'Have you tried clearing the browser cache? This usually resolves the SSO loop issue for most—';

  useEffect(() => {
    let t1, t2, t3, t4;
    function runCycle() {
      setPhase('idle');
      setTyped('');
      t1 = setTimeout(() => setPhase('typing'), 400);
      // typing simulation
      let idx = 0;
      const typingInterval = setInterval(() => {
        idx++;
        setTyped(draft.slice(0, idx));
        if (idx >= draft.length) clearInterval(typingInterval);
      }, 28);
      t2 = setTimeout(() => { setPhase('alert'); }, 2200);
      t3 = setTimeout(() => { setPhase('fade'); }, 5200);
      t4 = setTimeout(() => { runCycle(); }, CYCLE_MS);
    }
    const init = setTimeout(runCycle, 300);
    return () => {
      clearTimeout(init); clearTimeout(t1); clearTimeout(t2);
      clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  const alertVisible = phase === 'alert';

  return (
    <div style={{
      background: '#111111',
      border: '1px solid #1E1E1E',
      borderRadius: 12,
      overflow: 'hidden',
      width: '100%',
      maxWidth: 480,
      fontFamily: 'var(--font-sans)',
      position: 'relative',
    }}>
      {/* Window chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 14px',
        borderBottom: '1px solid #1E1E1E',
        background: '#0E0E0E',
      }}>
        {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => (
          <span key={i} style={{ width:10, height:10, borderRadius:'50%', background:c, opacity:0.8 }} />
        ))}
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'#3A3A3A', marginLeft:6 }}>
          support-compose.veto
        </span>
        <span style={{
          marginLeft:'auto', fontFamily:'var(--font-mono)', fontSize:9,
          color: 'var(--accent)', background: 'var(--accent-dim)',
          padding:'2px 6px', borderRadius:3,
          animation: 'breathe 2s ease-in-out infinite',
        }}>
          MEMORY ACTIVE
        </span>
      </div>

      {/* Ticket context */}
      <div style={{ padding:'12px 14px 0', borderBottom:'1px solid #1A1A1A' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'#3A3A3A' }}>
            TKT-4821&nbsp;&nbsp;·&nbsp;&nbsp;Meridian Corp
          </span>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:10,
            color:'#FF3B3B', background:'rgba(255,59,59,0.1)',
            padding:'1px 6px', borderRadius:3,
          }}>
            HIGH FRUSTRATION
          </span>
        </div>
        <p style={{ fontSize:12, color:'#5A5A5A', marginBottom:12, lineHeight:1.5 }}>
          "SSO keeps looping me back to login. Already tried 3 different browsers. 
          This is the <strong style={{ color:'#F5F5F0' }}>fourth time</strong> I'm opening a ticket for this."
        </p>
      </div>

      {/* Composer area */}
      <div style={{ padding:'12px 14px', position:'relative', minHeight:90 }}>
        <div style={{
          fontSize:12, color:'#5A5A5A', lineHeight:1.6,
          opacity: phase === 'idle' ? 0.3 : 1,
          transition:'opacity 300ms ease',
        }}>
          {typed || <span style={{color:'#3A3A3A'}}>Agent is drafting a response…</span>}
          {phase === 'typing' && (
            <span style={{
              display:'inline-block', width:2, height:13,
              background:'var(--accent)', marginLeft:1,
              animation:'breathe 0.8s ease-in-out infinite',
              verticalAlign:'middle',
            }} />
          )}
        </div>

        {/* VETO ALERT — slides in on conflict */}
        {alertVisible && (
          <div style={{
            position:'absolute', inset:0,
            background:'rgba(12,12,12,0.97)',
            padding:'12px 14px',
            animation:'conflictSlideIn 6s ease both',
            border:'1px solid rgba(255,59,59,0.4)',
            borderRadius:8,
          }}>
            {/* Alert header */}
            <div style={{
              display:'flex', alignItems:'center', gap:8, marginBottom:10,
              paddingBottom:8, borderBottom:'1px solid rgba(255,59,59,0.2)',
            }}>
              <div style={{
                width:8, height:8, borderRadius:'50%',
                background:'#FF3B3B',
                animation:'breathe 1s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600,
                color:'#FF3B3B', letterSpacing:'0.08em',
              }}>
                ⊘ MEMORY CONFLICT DETECTED
              </span>
              <span style={{
                marginLeft:'auto', fontFamily:'var(--font-mono)',
                fontSize:9, color:'#3A3A3A',
              }}>
                3ms
              </span>
            </div>

            {/* Conflict detail */}
            <div style={{
              background:'rgba(255,59,59,0.06)',
              border:'1px solid rgba(255,59,59,0.2)',
              borderRadius:6, padding:'8px 10px', marginBottom:10,
            }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'#FF3B3B', marginBottom:4 }}>
                FAILED SOLUTION MATCH
              </div>
              <div style={{ fontSize:11, color:'#F5F5F0', lineHeight:1.5 }}>
                "Cache clear failed for Meridian Corp&nbsp;
                <strong style={{ color:'#FF3B3B' }}>3×</strong>&nbsp;
                — TKT-4789, TKT-4801, TKT-4812"
              </div>
            </div>

            {/* Suggested alternative */}
            <div style={{
              background:'rgba(232,255,0,0.05)',
              border:'1px solid rgba(232,255,0,0.2)',
              borderRadius:6, padding:'8px 10px',
            }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--accent)', marginBottom:4 }}>
                HINDSIGHT RECOMMENDS
              </div>
              <div style={{ fontSize:11, color:'#F5F5F0', lineHeight:1.5 }}>
                SSO SAML token reset via admin panel — resolved in 
                <strong style={{ color:'var(--accent)' }}> 8 min</strong> for similar env
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer status */}
      <div style={{
        padding:'8px 14px', borderTop:'1px solid #1A1A1A',
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'#3A3A3A' }}>
          94 memories loaded · Meridian Corp
        </span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color: alertVisible ? '#FF3B3B' : '#3A3A3A' }}>
          {alertVisible ? '⊘ BLOCKED' : '◎ SCANNING'}
        </span>
      </div>
    </div>
  );
}
