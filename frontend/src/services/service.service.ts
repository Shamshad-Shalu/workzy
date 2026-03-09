import { WORKER_API } from '@/constants';
import { SERVICE_API } from '@/constants/apiRoutes/service.routes';
import type { WorkerListParams } from '@/features/user/services/components/WorkerList';
import type { ServiceFormType } from '@/features/worker/services/validation/ServiceFormData';
import api from '@/lib/api/axios';
import type { CategoryOption } from '@/types/category';
import type { Service, ServiceResponse } from '@/types/service';
import type { WorkerListingInfo } from '@/types/worker';

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

const ServiceManagement = {
  getServices: async (
    workerId: string,
    { page = 1, limit = 10, search = '', status = 'all', categoryId = null }: Filters
  ): Promise<ServiceResponse> => {
    const res = await api.get(SERVICE_API.BY_ID(workerId), {
      params: { page, limit, search, status, categoryId: categoryId === 'all' ? null : categoryId },
    });
    return res.data;
  },
  getWorkerServiceCategories: async (workerId: string): Promise<CategoryOption[]> => {
    const res = await api.get(SERVICE_API.FILTERS(workerId));
    return res.data;
  },

  toggleStatus: async (serviceId: string): Promise<{ message: string }> => {
    const res = await api.patch(SERVICE_API.STATUS(serviceId));
    return res.data;
  },

  updateService: async (serviceId: string, data: ServiceFormType): Promise<SResponse> => {
    const res = await api.patch(SERVICE_API.UPDATE(serviceId), data);
    return res.data;
  },
  addService: async (data: ServiceFormType): Promise<SResponse> => {
    const res = await api.post(SERVICE_API.ROOT, data);
    return res.data;
  },
  listWorkers: async (
    serviceId: string,
    params: WorkerListParams
  ): Promise<{ total: number; workers: WorkerListingInfo[] }> => {
    const res = await api.get(WORKER_API.LIST_BY_SERVICE(serviceId), { params });
    return res.data;
  },
};

export default ServiceManagement;
