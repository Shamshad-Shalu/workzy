import axios, { AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { HOST } from '@/constants';

const baseURL = import.meta.env.MODE === 'development' ? `${HOST}/api` : '/api';

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
  user?: any;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
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
          '/auth/refresh-token',
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
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
