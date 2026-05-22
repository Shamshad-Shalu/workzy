import { buildRoute } from './routeBuilder';

const slot = buildRoute('/slots');

export const SLOT_API = {
  ROOT: slot(`/`),
  BY_ID: (id: string) => slot(`/${id}`),
  RESERVE: slot(`/reserve`),
  DATES: slot(`/available-dates`),
  DATES_BY_ID: (id: string) => slot(`/quotes/available-dates/${id}`),
  RESCHEDULE_DATES: (id: string) => slot(`/reschedule-dates/${id}`),
  RESCHEDULE_SLOTS: (id: string) => slot(`/reschedule-slots/${id}`),
  RESCHEDULE_OPTIONS: (id: string) => slot(`/reschedule-options/${id}`),
  RESERVE_RESCHEDULE: (id: string) => slot(`/reserve-reschedule/${id}`),
} as const;
