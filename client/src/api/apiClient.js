import axios from 'axios';

const getApiBaseUrl = () => {
  // 1. Use env variable if provided
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.endsWith('/api/v1') 
      ? import.meta.env.VITE_API_URL 
      : import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api/v1';
  }
  
  // 2. If running on Vercel/production (not localhost), force the Render URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://mf-collections.onrender.com/api/v1';
  }
  
  // 3. Fallback to local backend for local development
  return 'http://localhost:5000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

// Direct host URL without /api/v1 (e.g. http://localhost:5000 or https://your-backend.onrender.com)
export const SERVER_HOST_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
