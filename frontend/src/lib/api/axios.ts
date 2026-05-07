import axios, { AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios';

import { AUTH_API, HOST } from '@/constants';
import type { User } from '@/types/user';

import { ApiError } from './apiError';

const baseURL = import.meta.env.MODE === 'development' ? `${HOST}` : '';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let accessToken: string | null = null;

export function setAxiosToken(token: string | null) {
  accessToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

interface RefreshResponse {
  accessToken: string;
  user?: User;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  config => {
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Axios interceptors
api.interceptors.response.use(
  res => res,

  async (error: AxiosError) => {
    const originalConfig = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve: value => {
              const token = value as string | null;
              if (token) {
                originalConfig.headers = originalConfig.headers || {};
                originalConfig.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalConfig));
            },
            reject,
          });
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post<RefreshResponse>(
          AUTH_API.REFRESH_TOKEN,
          {},
          {
            withCredentials: true,
          }
        );
        const { accessToken: newToken } = response.data;
        setAxiosToken(newToken);
        processQueue(null, newToken);

        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers.Authorization = `Bearer ${newToken}`;

        return api(originalConfig);
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.dispatchEvent(new Event('auth:logout'));
        const axiosErr = refreshError as AxiosError<{ message?: string }>;
        const backendMessage = axiosErr.response?.data?.message;
        const status = axiosErr.response?.status ?? 500;
        return Promise.reject(new ApiError(status, backendMessage ?? 'Session expired'));
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status ?? 500;
    const backendMessage = (error.response?.data as { message?: string })?.message;
    return Promise.reject(new ApiError(status, backendMessage ?? error.message));
  }
);

export default api;
