import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { Plan } from '@/types/plan';

import { planSchema, type PlanFormData } from '../validation/plan-schema';

const defaultValues = {
  name: '',
  description: '',
  isActive: true,
  isSpecialOffer: true,
  price: {
    monthly: 1,
    quarterly: undefined,
    halfYearly: undefined,
    yearly: undefined,
  },
  validFrom: undefined,
  validTill: undefined,
};
export function usePlanForm(plan?: Plan | null) {
  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    if (plan) {
      reset(plan as Plan);
    } else {
      reset(defaultValues);
    }
  }, [plan, reset]);

  return form;
}
