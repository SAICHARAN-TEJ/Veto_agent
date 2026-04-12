import { useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api.js';
import { useVetoStore } from '../store/useVetoStore.js';

function getModeFromUrl() {
  if (typeof window === 'undefined') return 'live';
  const params = new URLSearchParams(window.location.search);
  return params.get('demo') === 'true' ? 'demo' : 'live';
}

export function useVetoAnalysis() {
  const addTraceEntry = useVetoStore((s) => s.addTraceEntry);
  const clearTrace = useVetoStore((s) => s.clearTrace);
  const showOverlay = useVetoStore((s) => s.showOverlay);
  const hideOverlay = useVetoStore((s) => s.hideOverlay);
  const timerRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async ({ ticketId, draft, customerId, environment }) => {
      const { data } = await api.post('/api/analyze', {
        ticketId,
        draft,
        customerId,
        environment,
        mode: getModeFromUrl(),
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.conflict) {
        addTraceEntry({ msg: `⊘ Conflict score: ${data.confidence} → BLOCK` });
        addTraceEntry({ msg: `✓ Alternative retrieved: ${data.recommended}` });
        showOverlay(data);
      } else {
        addTraceEntry({ msg: '✓ No conflicts found — response is safe to send' });
        hideOverlay();
      }
    },
    onError: () => {
      addTraceEntry({ msg: '✗ Analysis error — proceeding without VETO check' });
    },
  });

  const analyze = useCallback(
    ({ ticketId, draft, customerId, environment }) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!draft || draft.trim().length < 20) return;

      clearTrace();
      addTraceEntry({ msg: `Extracted solution from draft...` });
      addTraceEntry({ msg: `Querying Hindsight memory for ${customerId}...` });

      timerRef.current = setTimeout(() => {
        addTraceEntry({ msg: 'Match lookup in progress...' });
        mutation.mutate({ ticketId, draft, customerId, environment });
      }, 400);
    },
    [mutation, addTraceEntry, clearTrace]
  );

  return { analyze, isPending: mutation.isPending };
}
