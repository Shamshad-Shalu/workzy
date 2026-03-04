import type { BillingCycle } from '@/constants';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/plan';

import PlanCard from './PlanCard';

interface PlansSectionProps {
  plans: { premium: Plan; special: Plan | null } | undefined;
  onAddPlan: (plan: Plan, cycle: BillingCycle) => void;
  isLoading: boolean;
}

export default function PlansSection({ plans, onAddPlan, isLoading }: PlansSectionProps) {
  const hasSpecial = !!plans?.special;
  const hasPremium = !!plans?.premium;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">Available Plans</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          All plans include the same Premium features.
        </p>
      </div>

      <div
        className={cn(
          'gap-5',
          hasSpecial && hasPremium ? 'grid grid-cols-1 sm:grid-cols-2' : 'flex justify-center'
        )}
      >
        {hasPremium && (
          <PlanCard plan={plans!.premium} onAddPlan={onAddPlan} isLoading={isLoading} />
        )}
        {hasSpecial && (
          <PlanCard plan={plans!.special!} onAddPlan={onAddPlan} isLoading={isLoading} />
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Plans activate immediately on payment.
        {hasSpecial && ' Special offer is available for a limited time only.'}
      </p>
    </div>
  );
}
