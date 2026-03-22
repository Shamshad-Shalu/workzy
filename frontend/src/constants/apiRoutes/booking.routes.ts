import { buildRoute } from './routeBuilder';
const payment = buildRoute('/payment');
export const PAYMENT_API = {
  ROOT: payment(`/`),
  VERIFY_BY_ID: (id: string) => payment(`/verify/${id}`),
} as const;

const booking = buildRoute('/booking');

export const BOOKING_API = {
  ROOT: booking('/'),
  BY_ID: (id: string) => booking(`/${id}`),
  BY_USER: booking('/user'),
  BY_WORKER: booking('/worker'),

  CANCEL: (id: string) => booking(`/${id}/cancel`),
  ACCEPT: (id: string) => booking(`/${id}/accept`),
  REJECT: (id: string) => booking(`/${id}/reject`),
  START: (id: string) => booking(`/${id}/start`),
  COMPLETE: (id: string) => booking(`/${id}/complete`),
  APPROVE: (id: string) => booking(`/${id}/approve`),

  DISPUTE: (id: string) => booking(`/${id}/dispute`),
  EVIDENCE: (id: string) => booking(`/${id}/evidence`),

  EXTRA_CHARGE: (id: string) => booking(`/${id}/extra-charge`),
} as const;
