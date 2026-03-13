import { buildRoute } from './routeBuilder';

const booking = buildRoute('/booking');

export const BOOKING_API = {
  ROOT: booking(`/`),
  BY_ID: (id: string) => booking(`/${id}`),
} as const;
