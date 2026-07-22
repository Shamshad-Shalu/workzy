import { WORKER_API } from '@/constants';
import type { JoinWorkerSchemaType } from '@/features/user/JoinUs/validation/JoinWorkerFormSchema';
import type { WorkerProfileSchemaType } from '@/features/worker/profile/validation/workerProfileSchema';
import api from '@/lib/api/axios';
import type { WorkerProfileDetails } from '@/types/worker';

const WorkerProfileService = {
  getWorkerProfileDetails: async (): Promise<WorkerProfileDetails> => {
    const res = await api.get(WORKER_API.DETAILS);
    return res.data;
  },
  getMyWorkerProfile: async (): Promise<WorkerProfileDetails> => {
    const res = await api.get(WORKER_API.MY_PROFILE);
    return res.data;
  },
  updateWorkerProfile: async (
    data: WorkerProfileSchemaType
  ): Promise<{ message: string; workerData: WorkerProfileDetails }> => {
    const res = await api.patch(WORKER_API.PROFILE, data);
    return res.data;
  },
  updateWorkerPhone: async (phone: string): Promise<{ message: string }> => {
    console.log({ phone });
    const res = await api.patch(WORKER_API.PHONE, { phone });
    return res.data;
  },
  updateProfileImage: async (url: string): Promise<{ url: string }> => {
    const res = await api.patch(WORKER_API.PROFILE_IMAGE, { url });
    return res.data;
  },
  addWorkerProfile: async (
    data: JoinWorkerSchemaType
  ): Promise<{ worker: WorkerProfileDetails; message: string }> => {
    const res = await api.post(WORKER_API.JOIN, data);
    return res.data;
  },
  reSubmitWorkerInfo: async (
    workerId: string,
    payload: JoinWorkerSchemaType
  ): Promise<{ message: string }> => {
    const res = await api.patch(WORKER_API.REAPPLICATION(workerId), payload);
    return res.data;
  },
};

export default WorkerProfileService;
