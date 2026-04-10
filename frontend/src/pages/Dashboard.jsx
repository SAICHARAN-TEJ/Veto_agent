import React, { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SupportConsole } from '../components/SupportConsole';
import { mockCustomers } from '../data/mockTickets';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDemo = searchParams.get('demo') === 'true';

  // Auto-select Meridian Corp for demo mode
  const defaultCustomer = isDemo
    ? mockCustomers.find(c => c.company?.toLowerCase().includes('meridian')) || mockCustomers[0]
    : null;

  const [initialCustomer] = useState(defaultCustomer);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <SupportConsole
      initialCustomer={initialCustomer}
      onBack={handleBack}
    />
  );
}
