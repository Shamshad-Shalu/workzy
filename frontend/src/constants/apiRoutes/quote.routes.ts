import { buildRoute } from './routeBuilder';

const quote = buildRoute('/quotes');

export const QUOTE_API = {
  ROOT: quote(`/`),
  BY_ID: (id: string) => quote(`/${id}`),
};
