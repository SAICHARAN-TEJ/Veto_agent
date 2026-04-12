import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

/**
 * VETO Design System — Accordion
 * Borderless, separator-line style for FAQ and collapsible sections
 */
export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{ borderBottom: '1px solid #1E1E1E' }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
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
                {item.question}
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
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{
                    fontSize: 14, color: 'var(--text-secondary)',
                    lineHeight: 1.75, paddingBottom: 22,
                  }}>
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
