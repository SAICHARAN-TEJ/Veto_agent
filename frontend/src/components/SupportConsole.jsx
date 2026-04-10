import React, { useState, useCallback, useMemo } from 'react';
import { useVeto } from '../hooks/useVeto';
import { useCustomerBrief } from '../hooks/useCustomerBrief';
import { VetoOverlay } from './VetoOverlay';
import { CustomerBrief } from './CustomerBrief';
import { TicketClose } from './TicketClose';
import { MemoryTraceView } from './MemoryTraceView';
import { mockCustomers, mockTickets } from '../data/mockTickets';

export function SupportConsole() {
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [activeTicket, setActiveTicket] = useState(null);
  const [draftResponse, setDraftResponse] = useState('');
  const [showTicketCloseModal, setShowTicketCloseModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const { brief, loading: briefLoading } = useCustomerBrief(activeCustomer?.id);
  const { status, vetoData, checkDraft } = useVeto(activeCustomer?.id, activeTicket?.id);

  const handleCustomerSelect = useCallback((customer) => {
    setActiveCustomer(customer);
    const customerTickets = mockTickets[customer.id] || [];
    const openTicket = customerTickets.find(t => t.status === 'open') || customerTickets[0];
    setActiveTicket(openTicket || null);
    setDraftResponse('');
  }, []);

  const handleDraftChange = (e) => {
    const value = e.target.value;
    setDraftResponse(value);
    checkDraft(value);
  };

  const handleUseSuggestion = useCallback((text) => {
    setDraftResponse(text);
  }, []);

  const handleCloseTicket = () => {
    setShowTicketCloseModal(true);
  };

  const handleTicketCloseSubmit = (closeData) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Ticket closed:', closeData);
    }
    setShowTicketCloseModal(false);
  };

  const metrics = useMemo(() => ({
    mdrr: "42%",
    ttr_reduction: "61%",
    csat_uplift: "+0.3",
    efficiency: "+38%"
  }), []);

  const customerList = useMemo(() => 
    mockCustomers.map(customer => (
      <CustomerItem 
        key={customer.id} 
        customer={customer} 
        isActive={activeCustomer?.id === customer.id} 
        onSelect={handleCustomerSelect} 
      />
    )), [activeCustomer?.id, handleCustomerSelect]);

  if (!activeCustomer) {
    return (
      <div className="support-console">
        <div className="welcome-screen">
          <div className="dashboard-banner" onClick={() => setShowDashboard(true)} style={{ cursor: 'pointer', marginBottom: '20px', padding: '15px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-accent)'}}>VIEW MEMORY ROI DASHBOARD →</span>
            <div style={{display: 'flex', gap: '15px', fontSize: '0.75rem', color: 'var(--color-text-secondary)'}}>
              <span>MDRR: {metrics.mdrr}</span>
              <span>TTR ↓ {metrics.ttr_reduction}</span>
              <span>CSAT ↑ {metrics.csat_uplift}</span>
            </div>
          </div>
          <h2>Veto Support Console</h2>
          <p>Select a customer to begin intercepting redundant solutions</p>
          <div className="customer-list">
            {customerList}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="support-console">
      {showDashboard && (
        <div className="dashboard-overlay" onClick={() => setShowDashboard(false)}>
          <div className="dashboard-content" onClick={e => e.stopPropagation()}>
            <div className="dashboard-header">
              <h3>Memory Intelligence ROI</h3>
              <button onClick={() => setShowDashboard(false)}>✕</button>
            </div>
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">MDRR</span>
                <span className="metric-value">{metrics.mdrr}</span>
                <span className="metric-desc">Memory-Driven Resolution Rate</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">TTR Reduction</span>
                <span className="metric-value">{metrics.ttr_reduction}</span>
                <span className="metric-desc">Avg. Time-to-Resolution ↓</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">CSAT Uplift</span>
                <span className="metric-value">{metrics.csat_uplift}</span>
                <span className="metric-desc">Customer Satisfaction Index ↑</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Efficiency</span>
                <span className="metric-value">{metrics.efficiency}</span>
                <span className="metric-desc">Tickets per Agent/Shift ↑</span>
              </div>
            </div>
            <div className="roi-narrative">
              <p>By leveraging the <strong>Unified Failure Memory</strong>, the support organization is preventing approximately <strong>1,200 redundant interactions per month</strong>, directly reducing churn risk for Enterprise accounts.</p>
            </div>
          </div>
        </div>
      )}
      <div className="columns">
        <div className="left-column">
          <h3>Customers</h3>
          <div className="customer-list">
            {customerList}
          </div>
        </div>

        <div className="center-column">
          {activeTicket ? (
            <>
              <div className="ticket-header">
                <div>
                  <strong>{activeCustomer.contact_name}</strong>
                  <span>{activeCustomer.company}</span>
                </div>
                <div className="ticket-meta">
                  <span>Ticket #{activeTicket.id}</span>
                  <span>{activeTicket.issue_category.replace(/_/g, ' ')}</span>
                  <span>{new Date(activeTicket.opened_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="ticket-thread">
                {activeTicket.thread.map((msg, index) => (
                  <Message key={index} msg={msg} />
                ))}
              </div>
              
              <div className="draft-area">
                <textarea 
                  value={draftResponse} 
                  onChange={handleDraftChange} 
                  placeholder="Type your response..." 
                  rows={4} 
                  className={"draft-textarea " + (status === 'checking' ? 'checking' : '')} 
                />
                
                <div className="veto-status">
                  {status === 'checking' && <span className="veto-status-checking">Querying Failure Memory...</span>}
                  {status === 'vetoed' && <span className="veto-status-vetoed">MEMORY CONFLICT DETECTED</span>}
                  {status === 'clear' && <span className="veto-status-clear">✓ Memory Clear</span>}
                </div>
                
                <button 
                  onClick={handleCloseTicket} 
                  disabled={status === 'checking'} 
                  className={"send-button " + (status === 'checking' ? 'disabled' : '')}
                >
                  {status === 'checking' ? 'Analyzing...' : 'Send Response'}
                </button>
              </div>
              
              {status === 'vetoed' && vetoData && (
                <>
                  <VetoOverlay
                    vetoed={true}
                    reason={vetoData.reason}
                    failedOn={vetoData.failed_on}
                    ticketRefs={vetoData.ticket_refs}
                    suggestion={vetoData.suggestion}
                    confidence={vetoData.confidence}
                    onUseSuggestion={handleUseSuggestion}
                  />
                  <MemoryTraceView trace={vetoData.trace} />
                </>
              )}
            </>
          ) : (
            <div className="no-ticket-selected"><p>Select a customer and ticket to view details</p></div>
          )}
        </div>

        <div className="right-column">
          {briefLoading ? <div className="loading-skeleton">Loading customer brief...</div> : brief ? <CustomerBrief brief={brief} /> : <div className="no-brief">No customer selected</div>}
        </div>
      </div>

      {showTicketCloseModal && (
        <TicketClose 
          onSubmit={handleTicketCloseSubmit} 
          onCancel={() => setShowTicketCloseModal(false)} 
          initialDraft={draftResponse} 
          customer={activeCustomer} 
        />
      )}
    </div>
  );
}

const CustomerItem = React.memo(({ customer, isActive, onSelect }) => (
  <div 
    className={"customer-item " + (isActive ? 'active' : '')} 
    onClick={() => onSelect(customer)}
  >
    <div className="customer-info">
      <strong>{customer.contact_name}</strong>
      <span>{customer.company}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className={"frustration-dot " + customer.frustration_level}></span>
      <span className="ticket-count-badge">({customer.ticket_count})</span>
    </div>
  </div>
));

const Message = React.memo(({ msg }) => (
  <div className={"message " + (msg.sender === 'customer' ? 'customer-message' : 'agent-message')}>
    <p>{msg.text}</p>
    <small className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</small>
  </div>
));
