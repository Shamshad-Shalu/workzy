import { ADMIN_API } from '@/constants';
import type { VerifyWorkerResponse } from '@/features/admin/worker/hooks/useWorkerMutations';
import type { ReviewWorkerSchemaType } from '@/features/admin/worker/validation/reviewWorkerShema';
import api from '@/lib/api/axios';
import type { WorkerResponse } from '@/types/admin/worker';

const AdminWorkerService = {
  getWorkers: async (
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    workerStatus = 'all'
  ): Promise<WorkerResponse> => {
    const res = await api.get(ADMIN_API.WORKER.WORKERS, {
      params: { page, limit, search, status, workerStatus },
    });
    return res.data;
  },

  verifyWorker: async (
    workerId: string,
    data: ReviewWorkerSchemaType
  ): Promise<VerifyWorkerResponse> => {
    const res = await api.patch(ADMIN_API.WORKER.WORKER_VERIFICATION(workerId), data);
    return res.data;
  },
};

export default AdminWorkerService;
