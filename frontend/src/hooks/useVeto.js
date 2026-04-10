import { useState, useCallback, useRef, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

export function useVeto(customerId, ticketId) {
  const [status, setStatus] = useState('idle');
  const [vetoData, setVetoData] = useState(null);
  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  const checkDraft = useCallback(async (draftText) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (abortController.current) {
      abortController.current.abort();
    }

    if (!draftText.trim()) {
      setStatus('idle');
      setVetoData(null);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setStatus('checking');
      abortController.current = new AbortController();

      try {
        const response = await fetch(API_BASE + '/api/veto/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: customerId,
            draft_response: draftText,
            ticket_id: ticketId
          }),
          signal: abortController.current.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.vetoed) {
          setStatus('vetoed');
          setVetoData(data);
        } else {
          setStatus('clear');
          setVetoData(null);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error('Veto check error:', error);
        setStatus('idle');
        setVetoData(null);
      }
    }, 600);
  }, [customerId, ticketId]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return { status, vetoData, checkDraft };
}
