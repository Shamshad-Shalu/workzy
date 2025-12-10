import api from '@/lib/api/axios';
import type { UserResponse } from '@/types/admin/user';
import { ADMIN_ROUTES } from '@/constants';

const AdminUserService = {
  getUsers: async (page = 1, limit = 10, search = '', status = 'all'): Promise<UserResponse> => {
    const res = await api.get(ADMIN_ROUTES.GETUSER, {
      params: { page, limit, search, status },
    });
    console.log('us', res.data);
    return res.data;
  },

  toggleStatus: async (userId: string): Promise<{ message: string }> => {
    const res = await api.patch(`${ADMIN_ROUTES.TOGGLESTATUS}/${userId}`);
    return res.data;
  },
};

export default AdminUserService;
