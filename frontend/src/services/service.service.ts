import { WORKER_API } from '@/constants';
import { SERVICE_API } from '@/constants/apiRoutes/service.routes';
import type { WorkerListParams } from '@/features/user/services/components/WorkerList';
import type { ServiceFormType } from '@/features/worker/services/validation/ServiceFormData';
import api from '@/lib/api/axios';
import type {
  CategoryOption,
  PublicServiceFilters,
  PublicWorkerServicesResponse,
  Service,
  ServiceFilters,
  WorkerServicesResponse,
} from '@/types/service';
import type { PublicWorkerListItem } from '@/types/worker';

interface SResponse {
  message: string;
  service: Service;
}

const ServiceManagement = {
  getServices: async (params: ServiceFilters): Promise<WorkerServicesResponse> => {
    const res = await api.get(SERVICE_API.BY_WORKER, {
      params,
    });
    return res.data;
  },
  listWorkerPublicServices: async (
    workerId: string,
    params: PublicServiceFilters
  ): Promise<PublicWorkerServicesResponse> => {
    const res = await api.get(SERVICE_API.PUBLIC(workerId), {
      params,
    });
    return res.data;
  },
  getWorkerServiceCategories: async (): Promise<{ categories: CategoryOption[] }> => {
    const res = await api.get(SERVICE_API.SERVICE_CATEGORIES);
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
  ): Promise<{ total: number; workers: PublicWorkerListItem[] }> => {
    const res = await api.get(WORKER_API.LIST_BY_SERVICE(serviceId), { params });
    return res.data;
  },
};

export default ServiceManagement;
