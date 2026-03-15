import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { useMemo } from 'react';

import ErrorState from '@/components/molecules/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import type { BookingState } from '@/types/slot';
import type { WorkerListingInfo } from '@/types/worker';

import { useAvailableDates } from '../../slot/hooks/useSlot';

export default function DateStep({
  worker,
  booking,
  onDateSelect,
  lat,
  lng,
}: {
  worker: WorkerListingInfo;
  booking: BookingState;
  onDateSelect: (date: string) => void | Promise<void>;
  lat?: number;
  lng?: number;
}) {
  const { data, isLoading, error, refetch } = useAvailableDates({
    workerId: worker.workerId,
    serviceId: worker.serviceId,
    itemCount: booking.itemCount,
    lat,
    lng,
  });

  const days = useMemo(() => Array.from({ length: 30 }, (_, i) => dayjs().add(i, 'day')), []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold flex items-center gap-2">
        <CalendarDays className="w-4 h-4" /> Select Date
      </p>

      {isLoading ? (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border border-border min-w-[52px] gap-1"
            >
              <Skeleton className="h-2 w-6 rounded" />
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-2 w-8 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState description="Failed to load available dates." onRetry={refetch} />
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {days.map(day => {
            const dateStr = day.format('YYYY-MM-DD');
            const available = data?.dates[dateStr] ?? false;
            const selected = booking.date === dateStr;

            return (
              <motion.button
                key={dateStr}
                whileTap={available ? { scale: 0.93 } : {}}
                onClick={() => available && onDateSelect(dateStr)}
                disabled={!available}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border text-center min-w-[52px] transition-all ${
                  !available
                    ? 'border-border bg-muted/20 opacity-40 cursor-not-allowed'
                    : selected
                      ? 'border-foreground bg-foreground text-background shadow-sm'
                      : 'border-border bg-card hover:border-foreground/50'
                }`}
              >
                <span className="text-[10px] font-medium uppercase">{day.format('ddd')}</span>
                <span className="text-base font-bold leading-tight">{day.format('D')}</span>
                <span className="text-[10px]">{day.format('MMM')}</span>
                {!available && (
                  <span className="text-[8px] text-muted-foreground/50 mt-0.5 leading-none">
                    Off
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
