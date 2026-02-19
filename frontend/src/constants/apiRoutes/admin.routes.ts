import { buildRoute } from './routeBuilder';

const admin = buildRoute('/admin');

export const ADMIN_API = {
  USER: {
    USERS: admin(`/users`),
    USER_STATUS: (id: string) => admin(`/users/toggle-status/${id}`),
  },
  CATEGORY: {
    CATEGORIES: admin(`/categories/add`),
    CATEGORY_BY_ID: (id: string) => admin(`/categories/edit/${id}`),
    CATEGORY_STATUS: (id: string) => admin(`/categories/toggle-status/${id}`),
  },
  WORKER: {
    WORKERS: admin(`/workers/all`),
    WORKER_VERIFICATION: (id: string) => admin(`/workers/verify/${id}`),
  },
} as const;
