import { LEAVE_API } from '@/constants';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
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
    const res = await api.get<ApiResponse<GetLeavesResponse>>(LEAVE_API.ROOT, { params });
    return res.data.data;
  },
  getStats: async (): Promise<LeaveStatsResponse> => {
    const res = await api.get<ApiResponse<LeaveStatsResponse>>(LEAVE_API.STATS);
    return res.data.data;
  },

  createLeave: async (data: CreateLeavePayload): Promise<{ message: string; data: Leave }> => {
    const res = await api.post<ApiResponse<{ data: Leave }>>(LEAVE_API.ROOT, data);
    return {
      message: res.data.message,
      data: res.data.data.data,
    };
  },

  cancelLeave: async (leaveId: string): Promise<{ message: string }> => {
    const res = await api.delete<ApiResponse<null>>(LEAVE_API.BY_ID(leaveId));
    return { message: res.data.message };
  },
};

export default LeaveService;
