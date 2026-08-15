import { WORKER_API, type StripeAccountStatus } from '@/constants';
import api from '@/lib/api/axios';
import type { WorkerProfile, WorkerProfileDetails } from '@/types/worker';
import type { WorkerDashboardAnalytics } from '@/types/workerDashboard.types';

const WorkerService = {
  getWorkerProfile: async (workerId: string): Promise<WorkerProfile> => {
    const res = await api.get(WORKER_API.BY_ID(workerId));
    return res.data;
  },
  getStripeStatus: async (): Promise<{
    status: StripeAccountStatus;
    stripeAccountId: string | null;
  }> => {
    const res = await api.get(WORKER_API.STRIPE_STATUS);
    return res.data;
  },
  connectStripe: async (): Promise<{ url: string }> => {
    const res = await api.get(WORKER_API.STRIPE_CONNECT);
    return res.data;
  },
  getWorkerProfileDetails: async (workerId: string): Promise<WorkerProfileDetails> => {
    const res = await api.get(WORKER_API.DETAILS_BY_ID(workerId));
    return res.data;
  },
  getWorkerDashboardAnalytics: async (): Promise<WorkerDashboardAnalytics> => {
    const res = await api.get(WORKER_API.DASHBOARD);
    return res.data;
  },
};

export default WorkerService;
