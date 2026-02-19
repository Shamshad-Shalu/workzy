const BASE = '/api';

export const buildRoute = (prefix: string) => (path: string) =>
  `${BASE}${prefix}${path.startsWith('/') ? '' : '/'}${path}`;
