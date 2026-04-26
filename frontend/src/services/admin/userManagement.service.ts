import { ADMIN_API } from '@/constants';
import api from '@/lib/api/axios';
import type { AdminUserListQuery, AdminUserListResponse } from '@/types/admin/user';

const AdminUserService = {
  getUsers: async (params: AdminUserListQuery): Promise<AdminUserListResponse> => {
    const res = await api.get(ADMIN_API.USER.USERS, {
      params,
    });
    return res.data;
  },

  toggleUserStatus: async (userId: string): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.USER.USER_STATUS(userId));
    return res.data;
  },
};

export default AdminUserService;
