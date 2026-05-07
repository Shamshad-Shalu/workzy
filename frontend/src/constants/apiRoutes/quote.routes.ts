import { buildRoute } from './routeBuilder';

const quote = buildRoute('/quotes');

export const QUOTE_API = {
  ROOT: quote(`/`),
  BY_WORKER: quote(`/worker`),
  BY_USER: quote(`/user`),
  WORKER_STATS: quote(`/worker/stats`),
  BY_ID: (id: string) => quote(`/${id}`),
  ACCEPT: (id: string) => quote(`/${id}/accept`),
  REJECT: (id: string) => quote(`/${id}/reject`),
};
