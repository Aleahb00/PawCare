import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

function getTokens() {
  return {
    access: localStorage.getItem('pawcare_access'),
    refresh: localStorage.getItem('pawcare_refresh'),
  };
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('pawcare_access', access);
  if (refresh) localStorage.setItem('pawcare_refresh', refresh);
}

export function clearTokens() {
  localStorage.removeItem('pawcare_access');
  localStorage.removeItem('pawcare_refresh');
}

client.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

let refreshPromise = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const { refresh } = getTokens();
      if (!refresh) {
        clearTokens();
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_BASE_URL}/auth/token/refresh/`, { refresh })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const { data } = await refreshPromise;
        setTokens({ access: data.access });
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return client(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
