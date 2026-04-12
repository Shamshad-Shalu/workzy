import { LEAVE_API } from '@/constants';
import api from '@/lib/api/axios';
import type {
  CreateLeavePayload,
  GetLeavesResponse,
  Leave,
  LeaveFilter,
  LeaveStatsResponse,
} from '@/types/leave';

const LeaveService = {
  getLeaves: async (params: {
    filter?: LeaveFilter;
    cursor?: string;
    limit?: number;
  }): Promise<GetLeavesResponse> => {
    const res = await api.get(LEAVE_API.ROOT, { params });
    return res.data;
  },
  getStats: async (): Promise<LeaveStatsResponse> => {
    const res = await api.get(LEAVE_API.STATS);
    return res.data;
  },

  createLeave: async (data: CreateLeavePayload): Promise<{ message: string; data: Leave }> => {
    const res = await api.post(LEAVE_API.ROOT, data);
    return res.data;
  },

  cancelLeave: async (leaveId: string): Promise<{ message: string }> => {
    const res = await api.delete(LEAVE_API.BY_ID(leaveId));
    return res.data;
  },
};

export default LeaveService;
