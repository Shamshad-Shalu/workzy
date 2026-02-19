import { buildRoute } from './routeBuilder';

const worker = buildRoute('/worker');

export const WORKER_API = {
  ME: worker(`/me`),
  JOIN: (id: string) => worker(`/joinUs/${id}`),
  PROFILE: (id: string) => worker(`/${id}/profile`),
  PROFILE_ABOUT: (id: string) => worker(`/${id}/profile/about`),
  REAPPLICATION: (id: string) => worker(`/${id}/reApply`),
} as const;
