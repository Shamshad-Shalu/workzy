import { buildRoute } from './routeBuilder';

const worker = buildRoute('/workers');

export const WORKER_API = {
  ROOT: worker('/'),
  PHONE: worker('/phone'),
  PROFILE: worker(`/profile`),
  PROFILE_IMAGE: worker(`/profile-url`),
  DETAILS: worker(`/details`),
  MY_PROFILE: worker('/me'),
  DASHBOARD: worker(`/worker/dashboard`),

  JOIN: worker(`/joinUs`),
  REAPPLICATION: (workerId: string) => worker(`/${workerId}/reApply`),

  PROFILE_ABOUT: (id: string) => worker(`/${id}/profile/about`),
  LIST_BY_SERVICE: (serviceId: string) => worker(`/service/${serviceId}`),

  BY_ID: (id: string) => worker(`/${id}`),
  DETAILS_BY_ID: (id: string) => worker(`/${id}/details`),

  STRIPE_CONNECT: worker('/stripe/connect'),
  STRIPE_STATUS: worker('/stripe/status'),
} as const;
