import { Clock } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { Badge } from '@/components/ui/badge';
import { PRICING_MODE, SERVICE_TYPE } from '@/constants';
import { cn } from '@/lib/utils';
import type { PublicWorkerServiceItem } from '@/types/service';
import { formatCurrency } from '@/utils/currency';
import { formatDuration } from '@/utils/time.format';

export function PublicServiceCard({ service }: { service: PublicWorkerServiceItem }) {
  const {
    categoryName,
    serviceName,
    estimatedDuration,
    iconUrl,
    pricingMode,
    serviceType,
    rate,
    bulkDiscounts,
    description,
  } = service;

  console.log('service::', service);
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
              'border'
            )}
          >
            <img src={iconUrl} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{serviceName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{categoryName}</p>
          </div>
          <Badge variant={serviceType === SERVICE_TYPE.CONSULTATION ? 'secondary' : 'blue'}>
            {serviceType}
          </Badge>
          {/* <span className={cn(
            'shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
            cfg.badge
          )}>
            <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
            {svc.serviceType}
          </span> */}
        </div>
        {description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {formatDuration(estimatedDuration)}
          </span>
          {/* <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3 w-3" />
            {svc.pricingMode === PRICING_MODE.PER_UNIT ? 'Per unit' : 'Fixed'}
          </span>
          {svc.allowSuddenBooking && (
            <span className="flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-medium text-green-700 dark:text-green-400">
              <Zap className="h-2.5 w-2.5" /> Instant
            </span>
          )} */}
        </div>
        {bulkDiscounts && bulkDiscounts?.length > 0 && (
          <div className="rounded-xl border border-dashed border-rose-500/20 bg-rose-500/[0.04] px-3 py-2">
            {/* <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-rose-500">
              Bulk discounts · up to {bulkDiscounts[0].count}% off
            </p> */}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5">
              {bulkDiscounts?.map(d => (
                <span key={d.count} className="text-[11px] text-muted-foreground">
                  {d.count}+ →{' '}
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {d.percent}% off
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-lg font-black text-foreground">{formatCurrency(rate)}</p>
            {pricingMode === PRICING_MODE.PER_UNIT && (
              <p className="text-[10px] text-muted-foreground">
                {pricingMode === PRICING_MODE.PER_UNIT ? 'per item' : 'flat fee'}
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="shrink-0 opacity-90 transition-opacity group-hover:opacity-100"
            // onClick={() => onBook(svc)}
          >
            Book now
          </Button>
        </div>
      </div>
    </div>
  );
}
