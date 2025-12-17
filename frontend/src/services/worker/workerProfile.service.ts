import api from '@/lib/api/axios';
import type { WorkerInfo, WorkerProfile, WorkerStats } from '@/types/worker';

const WorkerProfileService = {
  getWorkerSummaryById: async (
    workerId: string
  ): Promise<{ workerInfo: WorkerInfo; workerStats: WorkerStats }> => {
    const res = await api.get(`/worker/${workerId}/profile`);
    console.log('Worker Profile Response:', res.data);
    return res.data;
  },

  getWorkerProfileById: async (workerId: string): Promise<WorkerProfile> => {
    const res = await api.get(`/worker/${workerId}/profile/about`);
    return res.data;
  },

  updateWorkerProfile: async (workerId: string, data: any): Promise<string> => {
    const res = await api.patch(`/worker/${workerId}/profile`, data);
    return res.data;
  },

  addWorkerProfile: async (userId: string, data: any): Promise<string> => {
    const res = await api.post(`joinUs:${userId}`, data);
    return res.data;
  },
};

export default WorkerProfileService;
