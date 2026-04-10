import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export function useCustomerBrief(customerId) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      setBrief(null);
      return;
    }

    let cancelled = false;

    async function fetchBrief() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_BASE + '/api/customer/' + customerId + '/brief');
        const data = await response.json();

        if (!cancelled) {
          setBrief(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          console.error('Failed to fetch customer brief:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBrief();

    return () => {
      cancelled = true;
    };
  }, [customerId]);

  return { brief, loading, error };
}