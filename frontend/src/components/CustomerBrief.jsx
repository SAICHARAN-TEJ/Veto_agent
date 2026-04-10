import React from 'react';

export function CustomerBrief({ brief }) {
  if (!brief) return null;

  return (
    <div className="customer-brief">
      <h3>Customer Memory Intelligence</h3>
      
      <div className="brief-section">
        <div className="brief-row">
          <span className="brief-label">Company</span>
          <span className="brief-value">{brief.company}</span>
        </div>
        <div className="brief-row">
          <span className="brief-label">Contact</span>
          <span className="brief-value">{brief.contact_name}</span>
        </div>
        <div className="brief-row">
          <span className="brief-label">Environment</span>
          <span className="brief-value">
            {brief.env.browser || 'Unknown'}, {brief.env.os || 'Unknown'}, {brief.env.plan || 'Standard'}
            {brief.env.sso_provider && ", SSO: " + brief.env.sso_provider}
          </span>
        </div>
      </div>
 
      <div className="brief-section">
        <h4>Frustration Level: 
          <span className={"frustration-indicator " + brief.frustration_level}>
            {brief.frustration_level.toUpperCase()}
          </span>
        </h4>
      </div>
 
      <div className="brief-section">
        <h4>Failure History</h4>
        {brief.past_solutions.length > 0 ? (
          <ul className="past-solutions-list">
            {brief.past_solutions.map((solution, index) => (
              <li key={index} className="solution-item">
                <div className="solution-info">
                  <strong>Ticket #{solution.ticket_id}</strong> <span style={{opacity: 0.6, fontWeight: 'normal', marginLeft: '8px' }}>{solution.date}</span>
                </div>
                <div className="solution-details">
                  <span>Attempted: {solution.solution}</span>
                  <span className={"outcome-badge " + solution.outcome}>
                    {solution.outcome.toUpperCase()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{fontSize: '0.8rem', color: 'var(--color-text-muted)'}}>No previous failure data</p>
        )}
      </div>
 
      <div className="brief-section stats">
        <div className="stat">
          <span className="stat-label">Tickets</span>
          <span className="stat-value">{brief.total_tickets}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Escalations</span>
          <span className="stat-value">{brief.escalation_count}</span>
        </div>
      </div>
    </div>
  );
}
