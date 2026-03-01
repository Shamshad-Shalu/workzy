import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import PlanService from '@/services/plan.service';

import type { PlanFormData } from '../validation/plan-schema';

interface PlansProps {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export function usePlans({
  pageIndex = 1,
  pageSize = 10,
  search = '',
  status = 'all',
}: PlansProps) {
  const queryClient = useQueryClient();

  const {
    data: planData,
    error: planError,
    isLoading,
  } = useQuery({
    queryKey: ['subcriptions-plans', pageIndex, pageSize, search, status],
    queryFn: () => PlanService.getPlans({ page: pageIndex + 1, limit: pageSize, search, status }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const addPlan = useMutation({
    mutationFn: (data: PlanFormData) => PlanService.addPlan(data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['subcriptions-plans'] });
    },
  });

  const updatePlan = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: PlanFormData }) =>
      PlanService.updatePlan({ planId, data }),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['subcriptions-plans'] });
    },
  });

  return {
    planData,
    planError,
    isLoading,
    addPlan,
    updatePlan,
  };
}
