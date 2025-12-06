import api from '@/lib/api/axios';
import type { BackendUserResponse, UserResponse } from '@/types/admin/user';
import { ADMIN_ROUTES } from '@/constants';

const AdminUserService = {
  getUsers: async (page = 1, limit = 10, search = '', status = 'all'): Promise<UserResponse> => {
    const res = await api.get<BackendUserResponse>(ADMIN_ROUTES.GETUSER, {
      params: { page, limit, search, status },
    });

    const { users, total, currentPage } = res.data;

    console.log({ users, total, currentPage });
    return {
      users,
      total,
      page: currentPage,
      totalPages: Math.ceil(total / limit),
    };
  },

  toggleStatus: async (userId: string): Promise<void> => {
    await api.patch(`${ADMIN_ROUTES.TOGGLESTATUS}/${userId}`);
  },
};

export default AdminUserService;
