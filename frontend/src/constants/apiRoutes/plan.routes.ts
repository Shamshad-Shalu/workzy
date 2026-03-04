import { buildRoute } from './routeBuilder';

const plan = buildRoute('/plans');

export const PLAN_API = {
  ROOT: plan(`/`),
  BY_ID: (id: string) => plan(`/${id}`),
  ACTIVE: plan('/active-offers'),
} as const;
