import { ADMIN_API } from '@/constants';
import type { ReviewWorkerDocumentSchemaType } from '@/features/admin/worker/validation/reviewWorkerDocumentSchema';
import type { WorkerReviewFormType } from '@/features/admin/worker/validation/workerReviewSchema';
import api from '@/lib/api/axios';
import type { AdminWorkerListQuery, AdminWorkerListResponse } from '@/types/admin/worker';
import type { WorkerStatsSummary } from '@/types/worker';

const AdminWorkerService = {
  ListWorkers: async (params: AdminWorkerListQuery): Promise<AdminWorkerListResponse> => {
    const res = await api.get(ADMIN_API.WORKER.WORKERS, { params });
    return res.data;
  },
  updateStatus: async (workerId: string, reason?: string): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.WORKER.STATUS_CHANGE(workerId), { reason });
    return res.data;
  },
  getWorkerStats: async (workerId: string): Promise<WorkerStatsSummary> => {
    const res = await api.get(ADMIN_API.WORKER.STATS(workerId));
    return res.data;
  },
  reviewWorker: async (
    workerId: string,
    data: WorkerReviewFormType
  ): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.WORKER.REVIEW(workerId), data);
    return res.data;
  },
  reviewWorkerDocument: async (
    workerId: string,
    data: ReviewWorkerDocumentSchemaType
  ): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.WORKER.REVIEW_DOCUMENT(workerId, data.id), {
      status: data.status,
      rejectReason: data.rejectReason,
    });
    return res.data;
  },
};

export default AdminWorkerService;
