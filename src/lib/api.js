import axios from 'axios';

function resolveApiBaseUrl() {
  const envUrl = String(import.meta.env.VITE_API_URL || '').trim();

  if (!envUrl) {
    return '/api';
  }

  if (typeof window !== 'undefined') {
    const host = String(window.location.hostname || '').toLowerCase();
    const isLocalHost = host === 'localhost' || host === '127.0.0.1';
    const isEnvLocalHost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(envUrl);

    // In cloud deployments, ignore accidental localhost VITE_API_URL values.
    if (!isLocalHost && isEnvLocalHost) {
      return '/api';
    }
  }

  return envUrl;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
