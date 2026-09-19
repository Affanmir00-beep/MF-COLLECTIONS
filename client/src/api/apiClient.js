import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.endsWith('/api/v1') 
      ? import.meta.env.VITE_API_URL 
      : import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api/v1';
  }
  return 'https://mf-collections.onrender.com/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

// Direct host URL without /api/v1
export const SERVER_HOST_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
