import { ADMIN_ROUTES } from '@/constants';
import api from '@/lib/api/axios';
import type { ApiResponse } from '../hooks/useUserData';

export const userApi = {
  getUsers: async (params: URLSearchParams): Promise<ApiResponse> => {
    const res = await api.get(`${ADMIN_ROUTES.GETUSER}`, { params });
    return res.data;
  },
};
