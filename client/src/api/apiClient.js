import axios from 'axios';

// In production, set VITE_API_URL on Vercel (e.g. https://your-backend.onrender.com/api/v1)
// In development, defaults to http://localhost:5000/api/v1
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : 'http://localhost:5000/api/v1';

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
