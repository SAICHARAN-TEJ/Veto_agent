import { useEffect, useState } from 'react';
import api from '../lib/api.js';

function normalizeSuggestions(payload) {
  if (!Array.isArray(payload)) return [];

  return payload
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const solution = String(entry.solution || '').trim();
      const successRate = Number(entry.successRate);
      if (!solution) return null;
      return {
        solution,
        successRate: Number.isFinite(successRate) ? successRate : 0,
        source: entry.source === 'hindsight' ? 'hindsight' : 'fallback',
      };
    })
    .filter(Boolean)
    .slice(0, 3);
}

export function useSuggest(customerId, draft, environment) {
  const [debouncedDraft, setDebouncedDraft] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDraft(String(draft || ''));
    }, 500);

    return () => clearTimeout(timer);
  }, [draft]);

  useEffect(() => {
    let cancelled = false;
    const normalizedDraft = String(debouncedDraft || '');

    async function fetchSuggestions() {
      if (!customerId || normalizedDraft.trim().length < 8) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data } = await api.post('/api/suggest', {
          customerId,
          draft: normalizedDraft,
          environment: environment || {},
          mode: (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'true')
            ? 'demo'
            : 'live',
        }, {
          // Suggest calls should tolerate slower provider lookups.
          timeout: 30_000,
        });

        if (cancelled) return;
        setSuggestions(normalizeSuggestions(data?.suggestions));
      } catch (error) {
        if (cancelled) return;
        setSuggestions([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSuggestions();

    return () => {
      cancelled = true;
    };
  }, [customerId, debouncedDraft, environment]);

  return { suggestions, loading };
}
