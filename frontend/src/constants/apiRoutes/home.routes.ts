import { buildRoute } from './routeBuilder';

const home = buildRoute('/home');

export const HOME_API = {
  ROOT: home(`/`),
  NEARBY_WORKERS: home(`/nearby-workers`),
  LAYOUT: home(`/layout`),
  SECTIONS: home(`/sections`),
  SECTION_BY_ID: (id: string) => home(`/sections/${id}`),
  SECTION_STATUS: (id: string) => home(`/sections/${id}/toggle-status`),
} as const;
