import axios, { AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios';

import { AUTH_API, HOST } from '@/constants';
import type { User } from '@/types/user';

import { ApiError } from './apiError';

const baseURL = import.meta.env.MODE === 'development' ? `${HOST}` : '';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshApi = axios.create({
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
  res => {
    if (res.data && typeof res.data === 'object' && 'success' in res.data) {
      if (res.data.data !== undefined) {
        if (
          res.data.data !== null &&
          typeof res.data.data === 'object' &&
          !Array.isArray(res.data.data) &&
          res.data.message &&
          !('message' in res.data.data)
        ) {
          return { ...res, data: { ...res.data.data, message: res.data.message } };
        }
        return { ...res, data: res.data.data };
      }
      if (res.data.message !== undefined) {
        return { ...res, data: { message: res.data.message } };
      }
    }
    return res;
  },

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
        const response = await refreshApi.post<
          RefreshResponse | { success: boolean; data: RefreshResponse }
        >(
          AUTH_API.REFRESH_TOKEN,
          {},
          {
            withCredentials: true,
          }
        );
        const resPayload = response.data;
        const refreshData =
          resPayload && typeof resPayload === 'object' && 'data' in resPayload && resPayload.data
            ? (resPayload.data as RefreshResponse)
            : (resPayload as RefreshResponse);
        const { accessToken: newToken } = refreshData;
        setAxiosToken(newToken);
        processQueue(null, newToken);

        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers.Authorization = `Bearer ${newToken}`;

        return api(originalConfig);
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.dispatchEvent(new Event('auth:logout'));
        const axiosErr = refreshError as AxiosError<{
          message?: string;
          errors?: Array<{ field: string; messages: string }>;
        }>;
        const backendMessage = axiosErr.response?.data?.message;
        const backendErrors = axiosErr.response?.data?.errors;
        const status = axiosErr.response?.status ?? 500;
        return Promise.reject(
          new ApiError(status, backendMessage ?? 'Session expired', backendErrors)
        );
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status ?? 500;
    const responseData = error.response?.data as
      | { message?: string; errors?: Array<{ field: string; messages: string }> }
      | undefined;
    const backendMessage = responseData?.message;
    const backendErrors = responseData?.errors;
    return Promise.reject(new ApiError(status, backendMessage ?? error.message, backendErrors));
  }
);

export default api;
