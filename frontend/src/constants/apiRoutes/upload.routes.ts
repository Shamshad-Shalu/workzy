import { buildRoute } from './routeBuilder';

const upload = buildRoute('/upload');

export const UPLOAD_API = {
  REQUEST_URL: upload(`/request-url`),
} as const;
