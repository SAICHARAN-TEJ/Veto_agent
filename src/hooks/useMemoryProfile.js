import { useQuery } from '@tanstack/react-query';
import api from '../lib/api.js';

export function useMemoryProfile(customerId) {
  return useQuery({
    queryKey: ['memory', customerId],
    queryFn: async () => {
      const { data } = await api.get(`/api/memory/${customerId}`);
      return data;
    },
    enabled: !!customerId,
    staleTime: 60_000,
  });
}
