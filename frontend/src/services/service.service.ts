import api from '@/lib/api/axios';
import type { CategoryOption } from '@/types/category';
import type { ServiceResponse } from '@/types/service';

interface Filters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string | null;
}

const ServiceMangement = {
  getServices: async (
    workerId: string,
    { page = 1, limit = 10, search = '', status = 'all', categoryId = null }: Filters
  ): Promise<ServiceResponse> => {
    const res = await api.get(`/services/${workerId}`, {
      params: { page, limit, search, status, categoryId: categoryId === 'all' ? null : categoryId },
    });
    console.log('services:', res.data);
    return res.data;
  },
  getWorkerServiceCategories: async (workerId: string): Promise<CategoryOption[]> => {
    const res = await api.get(`services/${workerId}/service-filters`);
    return res.data;
  },

  toggleStatus: async (serviceId: string): Promise<{ message: string }> => {
    const res = await api.patch(`services${serviceId}/status`);
    return res.data;
  },
};

export default ServiceMangement;
