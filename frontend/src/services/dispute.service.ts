import { DISPUTE_API, type Role } from '@/constants';
import type { DisputeResolveFormType } from '@/features/admin/disputes/validation/disputeResolveFormData';
import type { DisputeFormType } from '@/features/dispute/validation/disputeFormData';
import api from '@/lib/api/axios';
import type {
  Dispute,
  DisputeListingResponse,
  DisputeListQuery,
  DisputeStats,
} from '@/types/dispute';

export const disputeService = {
  raiseDispute: async (
    bookingId: string,
    data: DisputeFormType
  ): Promise<{ message: string; dispute: Dispute }> => {
    const res = await api.post(DISPUTE_API.BY_BOOKING_ID(bookingId), data);
    return res.data;
  },

  updateDispute: async (
    disputeId: string,
    data: DisputeFormType
  ): Promise<{ message: string; dispute: Dispute }> => {
    const res = await api.patch(DISPUTE_API.UPDATE(disputeId), data);
    return res.data;
  },

  resolveDispute: async (
    disputeId: string,
    data: DisputeResolveFormType
  ): Promise<{ message: string }> => {
    const res = await api.patch(DISPUTE_API.RESOLVE(disputeId), data);
    return res.data;
  },

  getDisputeByBookingId: async (bookingId: string): Promise<Dispute | null> => {
    const res = await api.get(DISPUTE_API.BY_BOOKING_ID(bookingId));
    console.log('dispute:::', res.data);
    return res.data;
  },

  getAllDisputes: async (params: DisputeListQuery): Promise<DisputeListingResponse> => {
    const res = await api.get(DISPUTE_API.ROOT, { params });
    return res.data;
  },

  getDisputeStats: async (role: Role): Promise<DisputeStats> => {
    const res = await api.get(DISPUTE_API.STATS, { params: { role } });
    return res.data;
  },
};
