import { WORKER_API } from '@/constants';
import type { StripeAccountStatus } from '@/constants/payment';
import api from '@/lib/api/axios';
import type { WorkerInfo } from '@/types/worker';

const WorkerService = {
  getWorkerSummaryById: async (workerId: string): Promise<WorkerInfo> => {
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
};

export default WorkerService;
