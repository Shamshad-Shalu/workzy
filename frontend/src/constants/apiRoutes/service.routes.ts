import { buildRoute } from './routeBuilder';

const service = buildRoute('/services');

export const SERVICE_API = {
  ROOT: service(`/`),
  BY_WORKER: service(`/worker`),
  BY_ID: (id: string) => service(`/${id}`),
  FILTERS: service(`/service-filters`),
  STATUS: (id: string) => service(`/${id}/status`),
  UPDATE: (id: string) => service(`/${id}`),
} as const;
