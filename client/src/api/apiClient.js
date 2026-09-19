import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mf-collections.onrender.com/api/v1';

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
