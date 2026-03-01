import { PLAN_API } from '@/constants/apiRoutes/plan.routes';
import type { PlanFormData } from '@/features/admin/subcription/validation/plan-schema';
import api from '@/lib/api/axios';
import type { Plan, PlansListResponse } from '@/types/plan';
import type { ListBaseParams } from '@/types/query';

const PlanService = {
  getPlans: async ({
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
  }: ListBaseParams): Promise<PlansListResponse> => {
    const res = await api.get(PLAN_API.ROOT, {
      params: { page, limit, search, status },
    });
    return res.data;
  },

  getPlan: async (planId: string): Promise<Plan> => {
    const res = await api.get(PLAN_API.BY_ID(planId));
    return res.data;
  },

  addPlan: async (data: PlanFormData): Promise<{ message: string; plan: Plan }> => {
    const res = await api.post(PLAN_API.ROOT, data);
    return res.data;
  },
  updatePlan: async ({
    planId,
    data,
  }: {
    planId: string;
    data: PlanFormData;
  }): Promise<{ message: string; plan: Plan }> => {
    const res = await api.patch(PLAN_API.BY_ID(planId), data);
    return res.data;
  },
};

export default PlanService;
