import React from 'react';

export function VetoOverlay({ vetoed, reason, failedOn, ticketRefs, suggestion, confidence, onUseSuggestion }) {
  if (!vetoed) return null;

  const handleUseSuggestion = () => {
    if (suggestion) {
      const professionalText = "Hi,\n\nLet's try a different approach. " + suggestion.steps + "\n\n" + suggestion.reasoning;
      onUseSuggestion(professionalText);
    }
  };

  return (
    <div className="veto-overlay">
      <div className="veto-alert">
        <div className="veto-header">
          <div className="veto-icon">!</div>
          <strong>Memory Conflict: Solution already failed</strong>
        </div>
        
        <p className="veto-reason">{reason}</p>
 
        <div className="veto-meta">
          <span className="meta-badge">Confidence: {Math.round(confidence * 100)}%</span>
          <span className="meta-badge">Failure Date: {failedOn.join(', ')}</span>
          {ticketRefs && ticketRefs.length > 0 && (
            <span className="meta-badge">Ref: {ticketRefs.map(t => '#' + t).join(', ')}</span>
          )}
        </div>
      </div>
 
      {suggestion && (
        <div className="veto-suggestion">
          <div className="suggestion-header">
            <strong>AI Suggested Alternative</strong>
          </div>
          
          <h4>{suggestion.solution_name}</h4>
          <p className="suggestion-steps">{suggestion.steps}</p>
          <p className="suggestion-reasoning">{suggestion.reasoning}</p>
 
          <button className="btn-use-suggestion" onClick={handleUseSuggestion}>
            Use this suggestion
          </button>
        </div>
      )}
    </div>
  );
}
