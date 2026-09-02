import { ADMIN_API } from '@/constants';
import api from '@/lib/api/axios';
import type {
  AdminUserListQuery,
  AdminUserListResponse,
  AdminUserStats,
  UserProfileDetails,
} from '@/types/admin/user';
import type { ApiResponse } from '@/types/api';

const AdminUserService = {
  getUsers: async (params: AdminUserListQuery): Promise<AdminUserListResponse> => {
    const res = await api.get<ApiResponse<AdminUserListResponse>>(ADMIN_API.USER.USERS, {
      params,
    });
    return res.data.data;
  },

  toggleUserStatus: async (userId: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(ADMIN_API.USER.USER_STATUS(userId));
    return { message: res.data.message };
  },

  getUserDetails: async (userId: string): Promise<UserProfileDetails> => {
    const res = await api.get<ApiResponse<UserProfileDetails>>(ADMIN_API.USER.USER_DETAILS(userId));
    return res.data.data;
  },

  getUserStats: async (userId: string): Promise<AdminUserStats> => {
    const res = await api.get<ApiResponse<AdminUserStats>>(ADMIN_API.USER.USER_STATS(userId));
    return res.data.data;
  },
};

export default AdminUserService;
