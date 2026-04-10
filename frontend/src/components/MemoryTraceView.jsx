import React from 'react';

export function MemoryTraceView({ trace }) {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="memory-trace-container">
      <div className="trace-header">
        <span className="trace-title">🧠 Memory Recall Trace</span>
        <span className="trace-badge">Confidence: {Math.round((trace[trace.length - 1]?.confidence || 0) * 100)}%</span>
      </div>
      
      <div className="trace-timeline">
        {trace.map((step, index) => (
          <div key={index} className={`trace-step ${step.stage}`}>
            <div className="step-marker">
              <div className="marker-dot"></div>
              {index !== trace.length - 1 && <div className="marker-line"></div>}
            </div>
            
            <div className="step-content">
              <div className="step-meta">
                <span className="stage-pill">{step.stage.replace('_', ' ')}</span>
                <span className="step-time">{new Date(step.timestamp).toLocaleTimeString()}</span>
              </div>
              
              <div className="step-body">
                <p className="step-description">{step.description}</p>
                {step.rationale && <p className="step-rationale"><strong>Why:</strong> {step.rationale}</p>}
                <div className="step-result">{step.result_summary}</div>
              </div>

              {step.memory_ref && (
                <div className="memory-cue">
                  <div className="cue-icon">💾</div>
                  <div className="cue-details">
                    <span className="cue-id">Memory Ref: {step.memory_ref.memory_id}</span>
                    <span className="cue-excerpt">{step.memory_ref.excerpt}</span>
                  </div>
                  <div className="cue-score">{Math.round(step.memory_ref.similarity * 100)}% Match</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
