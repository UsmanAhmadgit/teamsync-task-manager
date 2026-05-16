import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Intercept 401 responses — redirect to login (except for /auth/me which is expected to 401)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/me') && !err.config.url.includes('/auth/login')) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
