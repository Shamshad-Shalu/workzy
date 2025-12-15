import api from '@/lib/api/axios';
import type { WorkerInfo, WorkerStats } from '@/types/worker';

const WorkerProfileService = {
  getWorkerProfileById: async (
    workerId: string
  ): Promise<{ workerInfo: WorkerInfo; workerStats: WorkerStats }> => {
    const res = await api.get(`/worker/${workerId}/profile`);
    console.log('Worker Profile Response:', res.data);
    return res.data;
  },
};

export default WorkerProfileService;
