import type { BillingCycle } from '@/constants';
import { SUBS_API } from '@/constants/apiRoutes/subscription.routes';
import api from '@/lib/api/axios';
import type { SubscriptionInfo } from '@/types/subscription';

const SubscriptionService = {
  getMySubscription: async (): Promise<{ subscription: SubscriptionInfo | null }> => {
    const res = await api.get(SUBS_API.ME);
    return res.data;
  },
  addSubscription: async (data: {
    planId: string;
    billingCycle: BillingCycle;
  }): Promise<{ url: string }> => {
    const res = await api.post(SUBS_API.ADD, data);
    return res.data;
  },
};
export default SubscriptionService;
