import { buildRoute } from './routeBuilder';

const slot = buildRoute('/slots');

export const SLOT_API = {
  ROOT: slot(`/`),
  BY_ID: (id: string) => slot(`/${id}`),
  REVERSE: slot(`/reserve`),
  DATES: slot(`/available-dates`),
} as const;
