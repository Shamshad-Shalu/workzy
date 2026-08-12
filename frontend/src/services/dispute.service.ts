import { DISPUTE_API } from '@/constants';
import type { ResolveDisputeFormType } from '@/features/admin/disputes/validation/resolveDispute.schema';
import type { RaiseDisputeFormType } from '@/features/dispute/validation/raiseDispute.schema';
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
    data: RaiseDisputeFormType
  ): Promise<{ message: string; dispute: Dispute }> => {
    const res = await api.post(DISPUTE_API.BY_BOOKING_ID(bookingId), data);
    return res.data;
  },

  updateDispute: async (
    disputeId: string,
    data: RaiseDisputeFormType
  ): Promise<{ message: string; dispute: Dispute }> => {
    const res = await api.patch(DISPUTE_API.UPDATE(disputeId), data);
    return res.data;
  },

  resolveDispute: async (
    disputeId: string,
    data: ResolveDisputeFormType
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

  getDisputeStats: async (params: {
    userId?: string;
    workerId?: string;
  }): Promise<DisputeStats> => {
    const res = await api.get(DISPUTE_API.STATS, { params });
    return res.data;
  },
};
