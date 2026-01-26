import type { ServiceFormType } from '@/features/worker/services/validation/ServiceFormData';
import api from '@/lib/api/axios';
import type { CategoryOption } from '@/types/category';
import type { Service, ServiceResponse } from '@/types/service';

interface Filters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string | null;
}
interface SResponse {
  message: string;
  service: Service;
}

const ServiceMangement = {
  getServices: async (
    workerId: string,
    { page = 1, limit = 10, search = '', status = 'all', categoryId = null }: Filters
  ): Promise<ServiceResponse> => {
    const res = await api.get(`/services/${workerId}`, {
      params: { page, limit, search, status, categoryId: categoryId === 'all' ? null : categoryId },
    });
    return res.data;
  },
  getWorkerServiceCategories: async (workerId: string): Promise<CategoryOption[]> => {
    const res = await api.get(`services/${workerId}/service-filters`);
    return res.data;
  },

  toggleStatus: async (serviceId: string): Promise<{ message: string }> => {
    const res = await api.patch(`services/${serviceId}/status`);
    return res.data;
  },

  updateService: async (serviceId: string, data: ServiceFormType): Promise<SResponse> => {
    const res = await api.patch(`services/${serviceId}`, data);
    return res.data;
  },
  addService: async (data: ServiceFormType): Promise<SResponse> => {
    const res = await api.post('services', data);
    return res.data;
  },
};

export default ServiceMangement;
