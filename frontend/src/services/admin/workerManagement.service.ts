import { ADMIN_API, type WorkerStatus } from '@/constants';
import type { ReviewWorkerSchemaType } from '@/features/admin/worker/validation/reviewWorkerShema';
import api from '@/lib/api/axios';
import type { AdminWorkerListQuery, AdminWorkerListResponse } from '@/types/admin/worker';

const AdminWorkerService = {
  ListWorkers: async (params: AdminWorkerListQuery): Promise<AdminWorkerListResponse> => {
    const res = await api.get(ADMIN_API.WORKER.WORKERS, { params });
    return res.data;
  },
  updateStatus: async (workerId: string, status: WorkerStatus): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.WORKER.STATUS_CHANGE(workerId), { status });
    return res.data;
  },

  verifyWorker: async (
    workerId: string,
    data: ReviewWorkerSchemaType
  ): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.WORKER.WORKER_VERIFICATION(workerId), data);
    return res.data;
  },
};

export default AdminWorkerService;
