import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to handle slow requests (Render cold start)
api.interceptors.request.use((config) => {
  // Set a timer to trigger a "slow request" event after 5 seconds
  config.wakingTimer = setTimeout(() => {
    window.dispatchEvent(new CustomEvent('axios-slow-request'));
  }, 5000);
  return config;
});

// Intercept responses
api.interceptors.response.use(
  (res) => {
    // Clear the timer since response arrived
    if (res.config?.wakingTimer) {
      clearTimeout(res.config.wakingTimer);
    }
    window.dispatchEvent(new CustomEvent('axios-request-completed'));
    return res;
  },
  (err) => {
    // Clear the timer on error too
    if (err.config?.wakingTimer) {
      clearTimeout(err.config.wakingTimer);
    }
    window.dispatchEvent(new CustomEvent('axios-request-completed'));

    // Handle 401
    if (err.response?.status === 401 && !err.config.url.includes('/auth/me') && !err.config.url.includes('/auth/login')) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
