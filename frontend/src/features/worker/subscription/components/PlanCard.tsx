import dayjs from 'dayjs';
import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';

import { BILLING_CYCLE, BILLING_CYCLE_MONTHS, PLAN_BENEFITS } from '@/constants';
import type { BillingCycle } from '@/constants';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/plan';

interface PlanCardProps {
  plan: Plan;
  onAddPlan: (plan: Plan, cycle: BillingCycle) => void;
  isLoading?: boolean;
}

export default function PlanCard({ plan, onAddPlan, isLoading = false }: PlanCardProps) {
  const { name, validTill, description, isSpecialOffer, price } = plan;

  const days = !validTill ? 0 : Math.max(0, Math.ceil(dayjs(validTill).diff(dayjs(), 'hour') / 24));

  const availableCycles = useMemo(
    () =>
      Object.entries(price)
        .filter(([, v]) => typeof v === 'number')
        .map(([k]) => k as BillingCycle),
    [price]
  );

  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(
    availableCycles[0] ?? BILLING_CYCLE.MONTHLY
  );

  const selectedPrice = (price[selectedCycle] ?? price.monthly) as number;

  const save = useMemo(() => {
    if (selectedCycle === BILLING_CYCLE.MONTHLY) {return null;}
    const monthly = price.monthly;
    const cyclePrice = price[selectedCycle];
    if (!cyclePrice) {return null;}
    const diff = monthly * BILLING_CYCLE_MONTHS[selectedCycle] - cyclePrice;
    return diff > 0 ? `Save ₹${diff.toLocaleString()}` : null;
  }, [selectedCycle, price]);

  return (
    <div className="rounded-2xl bg-card border border-border hover:border-muted-foreground/30 overflow-hidden flex flex-col transition-all duration-200">
      <div
        className={cn(
          'h-[3px] w-full',
          isSpecialOffer
            ? 'bg-gradient-to-r from-amber-500 to-orange-400'
            : 'bg-gradient-to-r from-violet-600 to-violet-400'
        )}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          {isSpecialOffer && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
              Special Offer
            </span>
          )}
          <h3 className="font-bold text-foreground mt-0.5">{name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        </div>

        {isSpecialOffer && (
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/15 px-3 py-2">
            <span
              className={cn('text-xs font-medium', days <= 3 ? 'text-red-400' : 'text-amber-600')}
            >
              {days > 0
                ? `Ends ${dayjs(validTill).format('D MMMM YYYY')} · ${days} days left`
                : 'Offer has ended'}
            </span>
          </div>
        )}

        {availableCycles.length > 1 && (
          <div className="flex bg-muted rounded-lg p-0.5 gap-0.5">
            {availableCycles.map(cycle => (
              <button
                key={cycle}
                onClick={() => setSelectedCycle(cycle)}
                className={cn(
                  'flex-1 text-[11px] font-medium py-1.5 rounded-md transition-all',
                  selectedCycle === cycle
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {cycle}
              </button>
            ))}
          </div>
        )}

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              ₹{selectedPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">/ {selectedCycle}</span>
          </div>
          {save && <p className="text-xs text-emerald-500 font-medium mt-0.5">{save} vs monthly</p>}
        </div>

        <ul className="flex flex-col gap-2 flex-1">
          {PLAN_BENEFITS.map(benefit => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Check size={14} className="text-violet-400 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>

        <button
          disabled={isLoading}
          onClick={() => onAddPlan(plan, selectedCycle)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
                     bg-violet-600 hover:bg-violet-500
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors mt-auto"
        >
          {isLoading ? 'Redirecting...' : 'Get Premium'}
        </button>
      </div>
    </div>
  );
}
