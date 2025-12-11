import api from '@/lib/api/axios';
import { ADMIN_ROUTES } from '@/constants';
import type { ServiceResponse } from '@/types/admin/service';

const AdminService = {
  getServices: async (
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    parentId: string | null = null
  ): Promise<ServiceResponse> => {
    const res = await api.get(ADMIN_ROUTES.GETSERVICE, {
      params: { page, limit, search, status, parentId },
    });
    console.log('data', res.data);
    return res.data;
  },

  toggleStatus: async (serviceId: string): Promise<{ message: string }> => {
    const res = await api.patch(`${ADMIN_ROUTES.TOGGLESERVICESTATUS}/${serviceId}`);
    return res.data;
  },
};

export default AdminService;
