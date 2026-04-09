import { buildRoute } from './routeBuilder';

const category = buildRoute('/categories');

export const CATEGORY_API = {
  ROOT: category('/'),
  DISCOVERY: category('/public'),
  BY_ID: (id: string) => category(`/${id}`),
  TOP_SERVICES: category(`/top-services`),
  SERVICE_SUGGESTIONS: (id: string) => category(`${id}/services`),
  ANCESTORS: (id: string) => category(`/${id}/ancestors`),
  LEVELS: category(`/levels`),
  CATEGORY_SUGGESTIONS: category(`/suggestions`),
  TRENDING: category(`/trending`),
} as const;
