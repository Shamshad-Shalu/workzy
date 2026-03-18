import dayjs from 'dayjs';
import { XCircle } from 'lucide-react';

import PageHeader from '@/components/molecules/PageHeader';
import { type BillingCycle } from '@/constants';
import type { Plan } from '@/types/plan';

import ActiveSubscriptionCard from '../components/ActiveSubscriptionCard';
import ActiveSubscriptionCardSkeleton from '../components/ActiveSubscriptionCardSkeleton';
import PlansSection from '../components/PlansSection';
import PlansSkeleton from '../components/PlansSkeleton';
import { useSubscriptions } from '../hooks/useSubscriptions';

export default function SubscriptionPage() {
  const {
    plans,
    plansLoading,
    plansError,
    currentSub,
    isSubLoading,
    isActive,
    isExpired,
    addSubscription,
  } = useSubscriptions();

  const handleAddPlan = (plan: Plan, cycle: BillingCycle) => {
    console.log({ plan, cycle });
    addSubscription.mutate({ planId: plan.id, billingCycle: cycle });
  };

  return (
    <main className="min-h-screen">
      <PageHeader title="Subscription" description="Manage your Premium plan and billing." />

      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-8">
        {isSubLoading ? (
          <ActiveSubscriptionCardSkeleton />
        ) : isActive ? (
          <ActiveSubscriptionCard subscription={currentSub!} />
        ) : (
          <>
            {isExpired && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 flex items-center gap-3">
                <XCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400 font-medium">
                  Your plan expired on {dayjs(currentSub!.expiryDate).format('D MMMM YYYY')}.{' '}
                  Subscribe again to restore access.
                </p>
              </div>
            )}

            {plansLoading ? (
              <PlansSkeleton />
            ) : plansError ? (
              <p className="text-sm text-red-500">Failed to load plans. Please try again.</p>
            ) : (
              <PlansSection
                plans={plans}
                onAddPlan={handleAddPlan}
                isLoading={addSubscription.isPending}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
