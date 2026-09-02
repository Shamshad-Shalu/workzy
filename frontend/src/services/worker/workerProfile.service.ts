import { WORKER_API } from '@/constants';
import type { JoinWorkerSchemaType } from '@/features/user/JoinUs/validation/JoinWorkerFormSchema';
import type { WorkerProfileSchemaType } from '@/features/worker/profile/validation/workerProfileSchema';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { WorkerProfileDetails } from '@/types/worker';

const WorkerProfileService = {
  getWorkerProfileDetails: async (): Promise<WorkerProfileDetails> => {
    const res = await api.get<ApiResponse<WorkerProfileDetails>>(WORKER_API.DETAILS);
    return res.data.data;
  },
  getMyWorkerProfile: async (): Promise<WorkerProfileDetails> => {
    const res = await api.get<ApiResponse<WorkerProfileDetails>>(WORKER_API.MY_PROFILE);
    return res.data.data;
  },
  updateWorkerProfile: async (
    data: WorkerProfileSchemaType
  ): Promise<{ message: string; workerData: WorkerProfileDetails }> => {
    const res = await api.patch<ApiResponse<{ workerData: WorkerProfileDetails }>>(
      WORKER_API.PROFILE,
      data
    );
    return {
      message: res.data.message,
      workerData: res.data.data.workerData,
    };
  },
  updateWorkerPhone: async (phone: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(WORKER_API.PHONE, { phone });
    return { message: res.data.message };
  },
  updateProfileImage: async (url: string): Promise<{ url: string }> => {
    const res = await api.patch<ApiResponse<{ url: string }>>(WORKER_API.PROFILE_IMAGE, { url });
    return res.data.data;
  },
  addWorkerProfile: async (
    data: JoinWorkerSchemaType
  ): Promise<{ worker: WorkerProfileDetails; message: string }> => {
    const res = await api.post<ApiResponse<{ worker: WorkerProfileDetails }>>(
      WORKER_API.JOIN,
      data
    );
    return {
      message: res.data.message,
      worker: res.data.data.worker,
    };
  },
  reSubmitWorkerInfo: async (
    workerId: string,
    payload: JoinWorkerSchemaType
  ): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<{ worker: WorkerProfileDetails }>>(
      WORKER_API.REAPPLICATION(workerId),
      payload
    );
    return { message: res.data.message };
  },
  addWorkerDocument: async (data: {
    type: string;
    url: string;
  }): Promise<{ message: string; workerData: WorkerProfileDetails }> => {
    const res = await api.post<ApiResponse<WorkerProfileDetails>>(WORKER_API.DOCUMENTS, data);
    return {
      message: res.data.message,
      workerData: res.data.data,
    };
  },
  updateWorkerDocument: async (
    documentId: string,
    url: string
  ): Promise<{ message: string; workerData: WorkerProfileDetails }> => {
    const res = await api.patch<ApiResponse<WorkerProfileDetails>>(
      WORKER_API.UPDATE_DOCUMENT(documentId),
      { url }
    );
    return {
      message: res.data.message,
      workerData: res.data.data,
    };
  },
};

export default WorkerProfileService;
