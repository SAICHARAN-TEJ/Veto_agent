import React, { useState } from 'react';

const FAQS = [
  {
    q: 'How does VETO know what failed before?',
    a: 'VETO maintains a structured failure archive per customer entity. Every closed ticket passes through our memory pipeline — solutions are extracted, outcomes are labeled, and the result is indexed against customer + environment fingerprints. When a new ticket opens, VETO queries this archive in real time.',
  },
  {
    q: 'What happens when I close a ticket?',
    a: 'Closing a ticket triggers a memory write event. The resolution path, the solutions attempted, and the final outcome are all logged to the customer\'s memory profile. This data is immediately available for future queries — your next agent benefits from what just happened.',
  },
  {
    q: 'Does VETO work with our existing CRM?',
    a: 'Yes. VETO integrates via webhook — point it at your CRM\'s event stream and it handles the rest. Current beta integrations support Zendesk, Intercom, and custom APIs. We\'ll extend to your stack if it isn\'t listed.',
  },
  {
    q: 'How quickly does the memory start working?',
    a: 'VETO has memory from Interaction 1. In the first week it operates in "learning mode," observing and indexing without blocking. By week two, it begins surfacing conflicts with confidence scores. By month one, most teams see 90%+ recall accuracy for their top accounts.',
  },
  {
    q: 'Is my customer data stored securely?',
    a: 'All memory data is encrypted at rest and in transit. Customer profiles are scoped per organization and are never cross-referenced across orgs. You retain full ownership and can request exports or deletions at any time via our data API.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section style={{ borderBottom: '1px solid #1E1E1E' }}>
      <div style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px)', maxWidth: 1280, margin: '0 auto' }}>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 20 }}>
          [07]&nbsp;&nbsp;QUESTIONS
        </div>

        <div style={{ maxWidth: 720 }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid #1E1E1E' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    width: '100%', background: 'transparent',
                    border: 'none', padding: '22px 0',
                    cursor: 'pointer', textAlign: 'left',
                    gap: 16,
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-sans)', fontWeight: isOpen ? 600 : 400,
                    fontSize: 15, color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                    lineHeight: 1.4,
                    transition: 'color 200ms ease',
                  }}>
                    {faq.q}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 16,
                    color: isOpen ? 'var(--accent)' : 'var(--text-muted)',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 250ms var(--ease), color 200ms ease',
                    flexShrink: 0, lineHeight: 1,
                  }}>
                    +
                  </span>
                </button>
                <div style={{
                  overflow: 'hidden',
                  maxHeight: isOpen ? 300 : 0,
                  transition: 'max-height 350ms var(--ease)',
                }}>
                  <p style={{
                    fontSize: 14, color: 'var(--text-secondary)',
                    lineHeight: 1.75, paddingBottom: 22,
                  }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
