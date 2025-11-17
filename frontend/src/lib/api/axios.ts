import axios from 'axios';
import { HOST } from '@/constants';
import { refreshTokenRequest } from './tokenRefresh';

const baseURL = import.meta.env.MODE === 'development' ? `${HOST}/api` : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let onTokenRefreshed: ((token: string) => void) | null = null;
let onLogout: (() => void) | null = null;

export function registerAuthHandlers(
  refreshHandler: (token: string) => void,
  logoutHandler: () => void
) {
  onTokenRefreshed = refreshHandler;
  onLogout = logoutHandler;
}

// Axios interceptors
api.interceptors.response.use(
  res => res,

  async error => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const data = await refreshTokenRequest(); // refresh WITHOUT store

        if (onTokenRefreshed) {
          onTokenRefreshed(data.accessToken); // update redux
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        if (onLogout) {
          onLogout();
        } // logout redux
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
