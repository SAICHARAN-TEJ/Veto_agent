import React, { useState } from 'react';

export function TicketClose({ onSubmit, onCancel, initialDraft, customer }) {
  const [outcome, setOutcome] = useState('resolved');
  const [solutionUsed, setSolutionUsed] = useState(initialDraft || '');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [frustrationSignal, setFrustrationSignal] = useState('low');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const memoryData = {
      customer_id: customer?.id,
      ticket_id: 'placeholder',
      solution: solutionUsed,
      outcome,
      resolution_notes: resolutionNotes,
      frustration_signal: frustrationSignal,
    };
    
     if (process.env.NODE_ENV !== 'production') {
       console.log('Writing memory:', memoryData);
     }
     onSubmit(memoryData);
  };

  return (
    <div className="ticket-close-modal">
      <div className="modal-content">
        <h3>Close Ticket</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Outcome:</label>
            <div className="radio-group">
              <label>
                <input type="radio" value="resolved" checked={outcome === 'resolved'} onChange={(e) => setOutcome(e.target.value)} />
                Resolved
              </label>
              <label>
                <input type="radio" value="failed" checked={outcome === 'failed'} onChange={(e) => setOutcome(e.target.value)} />
                Failed
              </label>
              <label>
                <input type="radio" value="escalated" checked={outcome === 'escalated'} onChange={(e) => setOutcome(e.target.value)} />
                Escalated
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Solution Used:</label>
            <textarea value={solutionUsed} onChange={(e) => setSolutionUsed(e.target.value)} rows={3} placeholder="Describe what was tried..." />
          </div>
          
          <div className="form-group">
            <label>Resolution Notes:</label>
            <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} rows={3} placeholder="Any additional details..." />
          </div>
          
          <div className="form-group">
            <label>Frustration Signal:</label>
            <div className="radio-group">
              <label>
                <input type="radio" value="low" checked={frustrationSignal === 'low'} onChange={(e) => setFrustrationSignal(e.target.value)} />
                Low
              </label>
              <label>
                <input type="radio" value="medium" checked={frustrationSignal === 'medium'} onChange={(e) => setFrustrationSignal(e.target.value)} />
                Medium
              </label>
              <label>
                <input type="radio" value="high" checked={frustrationSignal === 'high'} onChange={(e) => setFrustrationSignal(e.target.value)} />
                High
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Close Ticket'}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}