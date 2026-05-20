import { buildRoute } from './routeBuilder';
const disputes = buildRoute('/disputes');

export const DISPUTE_API = {
  ROOT: disputes('/'),
  STATS: disputes('/stats'),
  BY_BOOKING_ID: (bookingId: string) => disputes(`/${bookingId}`),
  RESOLVE: (disputeId: string) => disputes(`/${disputeId}/resolve`),
  UPDATE: (disputeId: string) => disputes(`/${disputeId}`),
};
