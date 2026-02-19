import { WORKER_API } from '@/constants';
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
    const res = await api.get(WORKER_API.PROFILE(workerId));
    return res.data;
  },

  getWorkerProfileById: async (workerId: string): Promise<WorkerProfile> => {
    const res = await api.get(WORKER_API.PROFILE_ABOUT(workerId));
    return res.data;
  },

  updateWorkerProfile: async (
    workerId: string,
    data: WorkerProfileSchemaType
  ): Promise<{ message: string; workerData: WorkerProfile }> => {
    const res = await api.patch(WORKER_API.PROFILE(workerId), data);
    return res.data;
  },

  addWorkerProfile: async (
    userId: string,
    data: JoinWorkerSchemaType
  ): Promise<{ worker: Worker; message: string }> => {
    const res = await api.post(WORKER_API.JOIN(userId), data);
    return res.data;
  },

  getMe: async (): Promise<Worker> => {
    const res = await api.get(WORKER_API.ME);
    return res.data;
  },

  reSubmitWorkerInfo: async (
    workerId: string,
    data: ResubmitDocumentPayload
  ): Promise<{ worker: Worker; message: string }> => {
    const res = await api.patch(WORKER_API.REAPPLICATION(workerId), data);
    return res.data;
  },
};

export default WorkerProfileService;
