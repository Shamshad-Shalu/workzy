import { buildRoute } from './routeBuilder';

const service = buildRoute('/services');

export const SERVICE_API = {
  ROOT: service(`/`),
  BY_WORKER: service(`/worker`),
  PUBLIC: (id: string) => service(`worker/${id}`),
  BY_ID: (id: string) => service(`/${id}`),
  SERVICE_CATEGORIES: service(`/service-categories`),
  STATUS: (id: string) => service(`/${id}/status`),
  UPDATE: (id: string) => service(`/${id}`),
} as const;
