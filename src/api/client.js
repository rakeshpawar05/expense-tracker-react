import axios from 'axios';

const PROD_API_URL = 'https://expense-tracker-olgo.onrender.com';
const DEV_API_URL = 'http://localhost:8080';

const resolveApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL;
  const isBrowserRemote = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1';

  // If in production mode or accessed from a public/remote domain (e.g. onrender.com)
  if (import.meta.env.PROD || isBrowserRemote) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return PROD_API_URL;
    }
    return envUrl;
  }

  return envUrl || DEV_API_URL;
};

const API_BASE_URL = resolveApiBase();

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  // Only attach JWT token to protected endpoints, never to /auth/login or /auth/register
  if (token && !config.url?.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      if (window.location.pathname !== '/' && window.location.pathname !== '/register') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
