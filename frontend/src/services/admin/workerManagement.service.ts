import api from '@/lib/api/axios';

import { ADMIN_ROUTES } from '@/constants';

const AdminWorkerService = {
  getWorkers: async (
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    workerStatus = 'all'
  ): Promise<any> => {
    const res = await api.get(ADMIN_ROUTES.GETWORKER, {
      params: { page, limit, search, status, workerStatus },
    });
    return res.data;
  },

  verifyWorker: async (workerId: string, data: any): Promise<any> => {
    const res = await api.patch(`${ADMIN_ROUTES.VERIFYWORKER}/${workerId}`, data);
    return res.data;
  },
};

export default AdminWorkerService;
