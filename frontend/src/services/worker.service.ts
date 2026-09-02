import { WORKER_API, type StripeAccountStatus } from '@/constants';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { WorkerProfile, WorkerProfileDetails } from '@/types/worker';
import type { WorkerDashboardAnalytics } from '@/types/workerDashboard.types';

const WorkerService = {
  getWorkerProfile: async (workerId: string): Promise<WorkerProfile> => {
    const res = await api.get<ApiResponse<WorkerProfile>>(WORKER_API.BY_ID(workerId));
    return res.data.data;
  },
  getStripeStatus: async (): Promise<{
    status: StripeAccountStatus;
    stripeAccountId: string | null;
  }> => {
    const res = await api.get<
      ApiResponse<{
        status: StripeAccountStatus;
        stripeAccountId: string | null;
      }>
    >(WORKER_API.STRIPE_STATUS);
    return res.data.data;
  },
  connectStripe: async (): Promise<{ url: string }> => {
    const res = await api.get<ApiResponse<{ url: string }>>(WORKER_API.STRIPE_CONNECT);
    return res.data.data;
  },
  getWorkerProfileDetails: async (workerId: string): Promise<WorkerProfileDetails> => {
    const res = await api.get<ApiResponse<WorkerProfileDetails>>(
      WORKER_API.DETAILS_BY_ID(workerId)
    );
    return res.data.data;
  },
  getWorkerDashboardAnalytics: async (): Promise<WorkerDashboardAnalytics> => {
    const res = await api.get<ApiResponse<WorkerDashboardAnalytics>>(WORKER_API.DASHBOARD);
    return res.data.data;
  },
};

export default WorkerService;
