import React, { useState } from 'react';
import SectionLabel from '../components/ui/SectionLabel.jsx';

const ITEMS = [
  {
    q: 'How does VETO know what failed before?',
    a: 'VETO stores the outcome of every resolved interaction in Hindsight — a structured memory layer that indexes solutions by customer ID, environment fingerprint, and timestamp. When a new draft is analyzed, the extracted solutions are matched against this archive in real time.',
  },
  {
    q: 'What happens when I close a ticket?',
    a: 'At ticket close, VETO captures the final resolution outcome — whether the solution worked or failed — and writes it to long-term memory. This is how the system compounds its knowledge. Every closed ticket makes the next one smarter.',
  },
  {
    q: 'Does VETO work with our existing CRM?',
    a: 'VETO operates as an intelligence layer alongside your current tooling. It reads draft text from your composer and returns analysis without requiring a direct CRM integration. Native connectors for Zendesk, Intercom, and HubSpot are on the roadmap.',
  },
  {
    q: 'How quickly does the memory start working?',
    a: 'Memory is active from the first ticket. By week 2, with 5–10 interactions per customer, pattern detection begins showing measurable recall improvements. Full confidence scoring (85%+) typically appears within the first 20–30 interactions.',
  },
  {
    q: 'Is my customer data stored securely?',
    a: 'All memory is scoped to your organization — no data is shared across accounts. Customer identifiers are hashed before storage. The Hindsight memory layer is hosted within your deployment region and complies with SOC 2 Type II controls.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <SectionLabel number={7} label="Questions" />
        </div>

        <div>
          {ITEMS.map(({ q, a }, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'clamp(18px, 2.5vw, 28px) 0',
                  cursor: 'pointer', textAlign: 'left', gap: 24,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.5vw, 17px)',
                  fontWeight: 500, color: open === i ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'color 200ms ease', lineHeight: 1.4,
                }}>
                  {q}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 18,
                  color: open === i ? 'var(--accent)' : 'var(--text-secondary)',
                  flexShrink: 0, transition: 'color 200ms ease, transform 200ms ease',
                  transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  lineHeight: 1,
                }}>
                  +
                </span>
              </button>

              {/* Answer */}
              <div style={{
                overflow: 'hidden',
                maxHeight: open === i ? 400 : 0,
                transition: 'max-height 350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'var(--text-secondary)', lineHeight: 1.75,
                  paddingBottom: 24, maxWidth: 680,
                }}>
                  {a}
                </p>
              </div>

              {/* Separator */}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
