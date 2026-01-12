import api from '@/lib/api/axios';
import { ADMIN_ROUTES } from '@/constants';
import type { ServiceResponse } from '@/types/admin/service';
import type { ServiceFormData } from '@/features/admin/service/validation/serviceSchema';

const AdminService = {
  getServices: async (
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    parentId: string | null = null
  ): Promise<ServiceResponse> => {
    const res = await api.get("/categories", {
      params: { page, limit, search, status, parentId },
    });
    console.log(res.data)
    return res.data;
  },

  toggleStatus: async (serviceId: string): Promise<{ message: string }> => {
    const res = await api.patch(`${ADMIN_ROUTES.TOGGLESERVICESTATUS}/${serviceId}`);
    return res.data;
  },

  createService: async (data: ServiceFormData) => {
    const response = await api.post(ADMIN_ROUTES.ADDCATEGORY, data);
    return response.data;
  },

  updateService: async (id: string, data: ServiceFormData) => {
    const response = await api.patch(`${ADMIN_ROUTES.EDITCATEGORY}/${id}`, data);
    return response.data;
  },
};

export default AdminService;
