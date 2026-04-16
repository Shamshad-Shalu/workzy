import { buildRoute } from './routeBuilder';

const payment = buildRoute('/payments');
export const PAYMENT_API = {
  ROOT: payment(`/`),
  VERIFY_BY_ID: (id: string) => payment(`/verify/${id}`),
  BY_USER: payment('/user'),
  BY_WORKER: payment('/worker'),
} as const;
