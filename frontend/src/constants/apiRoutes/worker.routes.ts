import { buildRoute } from './routeBuilder';

const worker = buildRoute('/workers');

export const WORKER_API = {
  ROOT: worker('/'),
  PHONE: worker('/phone'),
  PROFILE: worker(`/profile`),
  PROFILE_IMAGE: worker(`/profile-url`),
  DETAILS: worker(`/details`),
  DASHBOARD: worker(`/worker/dashboard`),

  JOIN: (id: string) => worker(`/joinUs/${id}`),
  PROFILE_ABOUT: (id: string) => worker(`/${id}/profile/about`),
  REAPPLICATION: (id: string) => worker(`/${id}/reApply`),
  LIST_BY_SERVICE: (serviceId: string) => worker(`/service/${serviceId}`),

  BY_ID: (id: string) => worker(`/${id}`),
  DETAILS_BY_ID: (id: string) => worker(`/${id}/details`),

  STRIPE_CONNECT: worker('/stripe/connect'),
  STRIPE_STATUS: worker('/stripe/status'),
} as const;
