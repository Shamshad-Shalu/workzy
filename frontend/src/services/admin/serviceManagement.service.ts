import api from '@/lib/api/axios';
import { ADMIN_ROUTES } from '@/constants';
import type { ServiceDTO, ServiceResponse } from '@/types/admin/service';
import { serviceToFormData } from '@/utils/admin/serviceFormData';

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
    return res.data;
  },

  toggleStatus: async (serviceId: string): Promise<{ message: string }> => {
    const res = await api.patch(`${ADMIN_ROUTES.TOGGLESERVICESTATUS}/${serviceId}`);
    return res.data;
  },

  createService: async (data: ServiceDTO) => {
    const formData = serviceToFormData(data);
    const response = await api.post('/admin/services/add', formData);
    console.log('response:', response);
    return response.data;
  },

  updateService: async (id: string, data: ServiceDTO) => {
    const formData = serviceToFormData(data);
    console.log('foem:', formData);
    const response = await api.patch(`/admin/services/edit/${id}`, formData);
    console.log('response:', response);
    return response.data;
  },
};

export default AdminService;
