import { buildRoute } from './routeBuilder';

const booking = buildRoute('/booking');

export const BOOKING_API = {
  ROOT: booking(`/`),
  BY_ID: (id: string) => booking(`/${id}`),
} as const;

const payment = buildRoute("/payment");
export const PAYMENT_API = {
  ROOT: payment(`/`),
  VERIFY_BY_ID:(id:string) => payment(`/verify/${id}`),
} as const;
