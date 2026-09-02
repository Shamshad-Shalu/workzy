import { ADMIN_API } from '@/constants';
import type { ReviewWorkerDocumentSchemaType } from '@/features/admin/worker/validation/reviewWorkerDocumentSchema';
import type { WorkerReviewFormType } from '@/features/admin/worker/validation/workerReviewSchema';
import api from '@/lib/api/axios';
import type { AdminWorkerListQuery, AdminWorkerListResponse } from '@/types/admin/worker';
import type { ApiResponse } from '@/types/api';
import type { CategoryOption, ServiceFilters, WorkerServicesResponse } from '@/types/service';
import type { WorkerStatsSummary } from '@/types/worker';

const AdminWorkerService = {
  ListWorkers: async (params: AdminWorkerListQuery): Promise<AdminWorkerListResponse> => {
    const res = await api.get<ApiResponse<AdminWorkerListResponse>>(ADMIN_API.WORKER.WORKERS, {
      params,
    });
    return res.data.data;
  },
  updateStatus: async (workerId: string, reason?: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(ADMIN_API.WORKER.STATUS_CHANGE(workerId), {
      reason,
    });
    return { message: res.data.message };
  },
  getWorkerStats: async (workerId: string): Promise<WorkerStatsSummary> => {
    const res = await api.get<ApiResponse<WorkerStatsSummary>>(ADMIN_API.WORKER.STATS(workerId));
    return res.data.data;
  },
  reviewWorker: async (
    workerId: string,
    data: WorkerReviewFormType
  ): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(ADMIN_API.WORKER.REVIEW(workerId), data);
    return { message: res.data.message };
  },
  reviewWorkerDocument: async (
    workerId: string,
    data: ReviewWorkerDocumentSchemaType
  ): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(
      ADMIN_API.WORKER.REVIEW_DOCUMENT(workerId, data.id),
      {
        status: data.status,
        rejectReason: data.rejectReason,
      }
    );
    return { message: res.data.message };
  },
  getWorkerServices: async (
    workerId: string,
    params: ServiceFilters
  ): Promise<WorkerServicesResponse> => {
    const res = await api.get<ApiResponse<WorkerServicesResponse>>(
      ADMIN_API.WORKER.SERVICES(workerId),
      { params }
    );
    return res.data.data;
  },
  getWorkerServiceCategories: async (
    workerId: string
  ): Promise<{ categories: CategoryOption[] }> => {
    const res = await api.get<ApiResponse<{ categories: CategoryOption[] }>>(
      ADMIN_API.WORKER.SERVICE_CATEGORIES(workerId)
    );
    return res.data.data;
  },
};

export default AdminWorkerService;
