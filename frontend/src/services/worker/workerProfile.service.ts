import { WORKER_API } from '@/constants';
import type { JoinWorkerSchemaType } from '@/features/user/JoinUs/validation/JoinWorkerFormSchema';
import type { WorkerProfileSchemaType } from '@/features/worker/profile/validation/workerProfileSchema';
import api from '@/lib/api/axios';
import type { ResubmitDocumentPayload, Worker, WorkerProfileDetails } from '@/types/worker';

const WorkerProfileService = {
  getWorkerProfileDetails: async (): Promise<WorkerProfileDetails> => {
    const res = await api.get(WORKER_API.DETAILS);
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
    userId: string,
    data: JoinWorkerSchemaType
  ): Promise<{ worker: Worker; message: string }> => {
    const res = await api.post(WORKER_API.JOIN(userId), data);
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
