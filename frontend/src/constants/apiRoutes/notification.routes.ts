import { buildRoute } from './routeBuilder';

const notifications = buildRoute('/notifications');

export const NOTIFICATION_API = {
  ROOT: notifications('/'),
  MARK_AS_READ: (id: string) => notifications(`/${id}/read`),
  MARK_ALL_AS_READ: notifications('/read-all'),
} as const;
