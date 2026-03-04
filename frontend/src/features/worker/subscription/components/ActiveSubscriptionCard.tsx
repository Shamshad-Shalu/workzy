import dayjs from 'dayjs';
import { AlertTriangle, Check } from 'lucide-react';

import { PLAN_BENEFITS } from '@/constants';
import type { SubscriptionInfo } from '@/types/subscription';

export default function ActiveSubscriptionCard({
  subscription,
}: {
  subscription: SubscriptionInfo;
}) {
  const { name, price, billingCycle, startDate, expiryDate, isSpecialOffer } = subscription;

  const accentBar = isSpecialOffer
    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
    : 'bg-gradient-to-r from-violet-600 to-violet-400';

  const start = dayjs(startDate);
  const end = dayjs(expiryDate);
  const today = dayjs();
  const totalDays = end.diff(start, 'day');
  const daysLeft = Math.max(0, Math.ceil(end.diff(today, 'hour') / 24));
  const progress = totalDays > 0 ? Math.round(((totalDays - daysLeft) / totalDays) * 100) : 0;

  const currentPrice = price[billingCycle as keyof typeof price] ?? 0;
  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className={`h-[3px] w-full ${accentBar}`} />

      <div className="p-6 flex flex-col gap-5">
        {isExpiringSoon && (
          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-4 py-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-500 font-medium">
              Your plan expires in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}.
            </p>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            {isSpecialOffer && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                Special Offer
              </span>
            )}
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-foreground">
                ₹{(currentPrice as number).toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">/ {billingCycle}</span>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Billing period</span>
            <span className="text-xs font-semibold text-foreground">{daysLeft} days remaining</span>
          </div>
          <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${accentBar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-muted-foreground">{start.format('D MMM YYYY')}</span>
            <span className="text-[11px] text-muted-foreground">{end.format('D MMM YYYY')}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-[11px] text-muted-foreground mb-3 font-medium uppercase tracking-wider">
            What's included
          </p>
          <ul className="flex flex-col gap-2">
            {PLAN_BENEFITS.map(benefit => (
              <li key={benefit} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Check size={14} className="text-violet-400 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
