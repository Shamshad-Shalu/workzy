import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useMemo } from 'react';

import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useAvailableSlots } from '@/features/user/slot/hooks/useSlot';
import type { AvailableSlot, BookingState } from '@/types/slot';
import type { PublicWorkerListItem } from '@/types/worker';
import { formatDuration, formatDate, formatTime12 } from '@/utils/time.format';

export default function SlotsStep({
  worker,
  booking,
  onSelectSlot,
  lat,
  lng,
}: {
  worker: PublicWorkerListItem;
  booking: BookingState;
  onSelectSlot: (slot: AvailableSlot) => void | Promise<void>;
  lat?: number;
  lng?: number;
}) {
  const { data, isLoading, error, refetch } = useAvailableSlots({
    workerId: worker.id,
    serviceId: worker.serviceId,
    date: booking.date,
    itemCount: booking.itemCount,
    lat,
    lng,
  });

  const totalMinutes = (worker?.estimatedDuration || 0) * (booking.itemCount || 1);
  const groups = useMemo(() => {
    if (!data?.slots) {
      return {} as Record<string, AvailableSlot[]>;
    }
    const slots = [...data.slots];
    if (booking.slot) {
      const already = slots.some(s => s.startTime === booking.slot?.startTime);
      if (!already) {
        slots.push(booking.slot);
        slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
      }
    }
    const g: Record<string, AvailableSlot[]> = { Morning: [], Afternoon: [], Evening: [] };
    slots.forEach(s => {
      const h = parseInt(s.startTime.split(':')[0], 10);
      if (h < 12) {
        g['Morning'].push(s);
      } else if (h < 17) {
        g['Afternoon'].push(s);
      } else {
        g['Evening'].push(s);
      }
    });
    return g;
  }, [data, booking.slot]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" /> Select Time
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(booking.date)}</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map(group => (
            <div key={group}>
              <Skeleton className="h-3 w-20 mb-3" />

              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState description="Failed to load time slots." onRetry={refetch} />
      ) : !data?.slots?.length ? (
        <EmptyState
          icon={<Clock className="w-5 h-5" />}
          title="No slots available"
          description="This worker has no available slots for the selected date."
          hint="Try selecting another date"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(groups).map(([period, slots]) => {
            if (!slots.length) {
              return null;
            }
            return (
              <div key={period}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {period}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map(slot => {
                    const selected = booking.slot?.startTime === slot.startTime;
                    return (
                      <motion.button
                        key={slot.startTime}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => onSelectSlot(slot)}
                        className={`py-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                          selected
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border bg-card hover:border-foreground/50'
                        }`}
                      >
                        <span>{formatTime12(slot.startTime)}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {booking.slot && worker.estimatedDuration && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center"
        >
          <p className="text-xs font-semibold text-emerald-700">
            ✓ {formatTime12(booking.slot.startTime)} →
            {formatTime12(
              dayjs(`2000-01-01 ${booking.slot.endTime}`)
                .subtract(worker.bufferTime, 'minute')
                .format('HH:mm')
            )}
          </p>
          <p className="text-[10px] text-muted-foreground">Includes setup & travel time</p>
        </motion.div>
      )}

      {totalMinutes && (
        <p className="text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg text-center">
          ⏱ Duration: {formatDuration(totalMinutes)}
        </p>
      )}
    </div>
  );
}
