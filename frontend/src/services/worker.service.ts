import { WORKER_API } from '@/constants';
import api from '@/lib/api/axios';
import type { WorkerInfo } from '@/types/worker';

const WorkerService = {
  getWorkerSummaryById: async (workerId: string): Promise<WorkerInfo> => {
    console.log('workerId', workerId);
    console.log('WORKER_API.BY_ID(workerId)', WORKER_API.BY_ID(workerId));
    const res = await api.get(WORKER_API.BY_ID(workerId));
    return res.data;
  },
};

export default WorkerService;
