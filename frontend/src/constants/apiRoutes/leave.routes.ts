import { buildRoute } from './routeBuilder';

const leave = buildRoute('/leave');

export const LEAVE_API = {
  ROOT: leave(`/`),
  BY_ID: (id: string) => leave(`/${id}`),
  ACTIVE: leave('/active-offers'),
  STATS: leave('/stats'),
} as const;
