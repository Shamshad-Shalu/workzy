import { buildRoute } from './routeBuilder';

const review = buildRoute('/reviews');
export const REVIEW_API = {
  ROOT: review(`/`),
  BY_ID: (id: string) => review(`/${id}`),
  REPLY: (id: string) => review(`/${id}/reply`),
  TOGGLE: (id: string) => review(`/${id}/toggle`),
  MY_REVIEWS: review('/user/me'),
  WORKER_REVIEWS: (workerId: string) => review(`/worker/${workerId}`),
  WORKER_REVIEWS_STATS: (workerId: string) => review(`/worker/${workerId}/stats`),
  MY_WORKER_REVIEWS: review('/worker/me'),
} as const;
