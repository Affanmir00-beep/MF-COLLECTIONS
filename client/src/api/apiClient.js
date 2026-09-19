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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't intercept refresh token failures themselves, to avoid infinite loops
      if (originalRequest.url === '/auth/refresh') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        isRefreshing = false;
        processQueue(null);
        
        return apiClient(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        
        // If refresh fails (e.g. refresh token is also expired), they must log in again
        if (typeof window !== 'undefined') {
          // window.location.href = '/login'; 
          // We can optionally force a redirect, but we'll leave it to the UI components to handle the 401
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
