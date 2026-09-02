import { DISPUTE_API } from '@/constants';
import type { RaiseDisputeFormType } from '@/features/dispute/validation/raiseDispute.schema';
import type { ResolveDisputeFormType } from '@/features/dispute/validation/resolveDispute.schema';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
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
    const res = await api.post<ApiResponse<{ dispute: Dispute }>>(
      DISPUTE_API.BY_BOOKING_ID(bookingId),
      data
    );
    return {
      message: res.data.message,
      dispute: res.data.data.dispute,
    };
  },

  updateDispute: async (
    disputeId: string,
    data: RaiseDisputeFormType
  ): Promise<{ message: string; dispute: Dispute }> => {
    const res = await api.patch<ApiResponse<{ dispute: Dispute }>>(
      DISPUTE_API.UPDATE(disputeId),
      data
    );
    return {
      message: res.data.message,
      dispute: res.data.data.dispute,
    };
  },

  resolveDispute: async (
    disputeId: string,
    data: ResolveDisputeFormType
  ): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(DISPUTE_API.RESOLVE(disputeId), data);
    return { message: res.data.message };
  },

  getDisputeByBookingId: async (bookingId: string): Promise<Dispute | null> => {
    const res = await api.get<ApiResponse<Dispute | null>>(DISPUTE_API.BY_BOOKING_ID(bookingId));
    return res.data.data ?? null;
  },

  getAllDisputes: async (params: DisputeListQuery): Promise<DisputeListingResponse> => {
    const res = await api.get<ApiResponse<DisputeListingResponse>>(DISPUTE_API.ROOT, { params });
    return res.data.data;
  },

  getDisputeStats: async (params: {
    userId?: string;
    workerId?: string;
  }): Promise<DisputeStats> => {
    const res = await api.get<ApiResponse<DisputeStats>>(DISPUTE_API.STATS, { params });
    return res.data.data;
  },
};
