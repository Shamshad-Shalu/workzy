import { buildRoute } from './routeBuilder';

const quote = buildRoute('/quotes');

export const QUOTE_API = {
  ROOT: quote(`/`),
  WORKER_STATS: quote(`/worker/stats`),
  BY_ID: (id: string) => quote(`/${id}`),
  ACCEPT: (id: string) => quote(`/${id}/accept`),
  REJECT: (id: string) => quote(`/${id}/reject`),
};
