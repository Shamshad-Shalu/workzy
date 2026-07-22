import { buildRoute } from './routeBuilder';

const admin = buildRoute('/admin');

export const ADMIN_API = {
  USER: {
    USERS: admin(`/users`),
    USER_STATUS: (id: string) => admin(`/users/${id}/toggle-status`),
  },
  CATEGORY: {
    CATEGORIES: admin(`/categories/add`),
    CATEGORY_BY_ID: (id: string) => admin(`/categories/edit/${id}`),
    CATEGORY_STATUS: (id: string) => admin(`/categories/toggle-status/${id}`),
  },
  WORKER: {
    WORKERS: admin(`/workers`),
    REVIEW: (id: string) => admin(`/workers/${id}/review`),
    STATUS_CHANGE: (id: string) => admin(`/workers/${id}/status`),
    STATS: (id: string) => admin(`/workers/${id}/stats`),
  },
  BOOKING: {
    ROOT: admin('/bookings/'),
    BY_ID: (id: string) => admin(`/bookings/${id}`),
  },
  DASHBOARD: admin('dashboard'),
} as const;
