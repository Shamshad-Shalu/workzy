import { buildRoute } from './routeBuilder';

const sub = buildRoute('/subscription');

export const SUBS_API = {
  ROOT: sub(`/`),
  ME: sub('/me'),
  ADD: sub('/add'),
  // TOGGLE_RENEW: (id: string) => sub(`/toggle-renew/${id}`),
} as const;
