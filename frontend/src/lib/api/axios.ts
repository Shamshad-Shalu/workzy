// import { AUTH_ROUTES, HOST, SERVER_URL } from '@/constants';
// import { clearUser, updateToken } from '@/store/slices/authSlice';
// import store from '@/store/store';
// import axios, { AxiosError } from 'axios';

// const baseURL = import.meta.env.MODE === 'development' ? `${HOST}/api` : '/api';

// const api = axios.create({
//   baseURL,
//   withCredentials: true,
// });

// // Refresh token queue logic

// let isRefreshing = false;
// let failedQueue: {
//   resolve: (value?: unknown) => void;
//   reject: (error: unknown | AxiosError) => void;
//   config: any;
// }[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(({ resolve, reject, config }) => {
//     if (error) {
//       reject(error);
//     } else {
//       resolve(
//         api({
//           ...config,
//           headers: {
//             ...config.headers,
//             Authorization: `Bearer ${token}`,
//           },
//         })
//       );
//     }
//   });

//   failedQueue = [];
// };

// api.interceptors.request.use(
//   config => {
//     const token = store.getState().auth.accessToken;

//     if (token && config.headers) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     // No response? Network error
//     if (!error.response) {
//       return Promise.reject(error);
//     }

//     // Only handle 401 here
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // If refresh is already happening → queue this request
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve,
//             reject,
//             config: originalRequest,
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         // Call refresh endpoint (refresh cookie auto-sent)
//         const refreshResponse = await axios.post(
//           `${SERVER_URL}${AUTH_ROUTES.REFRESH_TOKEN}`,
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = refreshResponse.data.accessToken;

//         // Update token in Redux
//         store.dispatch(updateToken(newAccessToken));

//         isRefreshing = false;

//         // Retry all queued requests
//         processQueue(null, newAccessToken);

//         // Retry the original request too
//         return api({
//           ...originalRequest,
//           headers: {
//             ...originalRequest.headers,
//             Authorization: `Bearer ${newAccessToken}`,
//           },
//         });
//       } catch (error) {
//         // Refresh failed → logout user
//         isRefreshing = false;
//         processQueue(error, null);
//         store.dispatch(clearUser());

//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';
import { HOST } from '@/constants';
import { refreshTokenRequest } from './tokenRefresh';

const baseURL = import.meta.env.MODE === 'development' ? `${HOST}/api` : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Callback placeholders — will be set in main.tsx
let onTokenRefreshed: ((token: string) => void) | null = null;
let onLogout: (() => void) | null = null;

// Main.tsx will call this
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
