import type { JoinWorkerSchemaType } from '@/features/user/JoinUs/validation/JoinWorkerFormSchema';
import type { WorkerProfileSchemaType } from '@/features/worker/profile/validation/workerProfileSchema';
import api from '@/lib/api/axios';
import type {
  ResubmitDocumentPayload,
  Worker,
  WorkerInfo,
  WorkerProfile,
  WorkerStats,
} from '@/types/worker';

const WorkerProfileService = {
  getWorkerSummaryById: async (
    workerId: string
  ): Promise<{ workerInfo: WorkerInfo; workerStats: WorkerStats }> => {
    const res = await api.get(`/worker/${workerId}/profile`);
    return res.data;
  },

  getWorkerProfileById: async (workerId: string): Promise<WorkerProfile> => {
    const res = await api.get(`/worker/${workerId}/profile/about`);
    return res.data;
  },

  updateWorkerProfile: async (
    workerId: string,
    data: WorkerProfileSchemaType
  ): Promise<{ message: string; workerData: WorkerProfile }> => {
    const res = await api.patch(`/worker/${workerId}/profile`, data);
    return res.data;
  },

  addWorkerProfile: async (
    userId: string,
    data: JoinWorkerSchemaType
  ): Promise<{ worker: Worker; message: string }> => {
    const res = await api.post(`/worker/joinUs/${userId}`, data);
    return res.data;
  },

  getMe: async (): Promise<Worker> => {
    const res = await api.get('/worker/me');
    return res.data;
  },

  reSubmitWorkerInfo: async (
    workerId: string,
    data: ResubmitDocumentPayload
  ): Promise<{ worker: Worker; message: string }> => {
    const res = await api.patch(`/worker/${workerId}/reApply`, data);
    return res.data;
  },
};

export default WorkerProfileService;
