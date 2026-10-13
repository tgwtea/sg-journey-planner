import axios from 'axios';

// Shared axios instance for our own backend.
// '/api' works in local dev (Vite proxy) and on Vercel (same origin).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

export default api;
