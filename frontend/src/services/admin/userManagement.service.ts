import { ADMIN_API } from '@/constants';
import api from '@/lib/api/axios';
import type { UserResponse } from '@/types/admin/user';

const AdminUserService = {
  getUsers: async (page = 1, limit = 10, search = '', status = 'all'): Promise<UserResponse> => {
    const res = await api.get(ADMIN_API.USER.USERS, {
      params: { page, limit, search, status },
    });
    return res.data;
  },

  toggleStatus: async (userId: string): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.USER.USER_STATUS(userId));
    return res.data;
  },
};

export default AdminUserService;
