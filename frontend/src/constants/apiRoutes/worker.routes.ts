import { buildRoute } from './routeBuilder';

const worker = buildRoute('/workers');

export const WORKER_API = {
  ROOT: worker('/'),
  PHONE: worker('/phone'),
  PROFILE: worker(`/profile`),
  PROFILE_IMAGE: worker(`/profile-url`),
  DETAILS: worker(`/details`),

  JOIN: (id: string) => worker(`/joinUs/${id}`),
  PROFILE_ABOUT: (id: string) => worker(`/${id}/profile/about`),
  REAPPLICATION: (id: string) => worker(`/${id}/reApply`),
  LIST_BY_SERVICE: (serviceId: string) => worker(`/service/${serviceId}`),

  BY_ID: (id: string) => worker(`/${id}`),

  STRIPE_CONNECT: worker('/stripe/connect'),
  STRIPE_STATUS: worker('/stripe/status'),
} as const;
