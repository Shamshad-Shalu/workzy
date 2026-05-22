import { useMemo } from 'react';

import TimeSlotSelector from '@/features/slots/components/TimeSlotSelector';
import { useAvailableSlots } from '@/features/slots/hooks/useSlot';
import type { AvailableSlot, BookingState } from '@/types/slot';
import type { PublicWorkerListItem } from '@/types/worker';

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

  const slots = useMemo<AvailableSlot[]>(() => {
    if (!data?.slots) {
      return [];
    }
    const merged = [...data.slots];
    if (booking.slot && !merged.some(s => s.startTime === booking.slot?.startTime)) {
      merged.push(booking.slot);
      merged.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return merged;
  }, [data, booking.slot]);

  const totalMinutes = (worker.estimatedDuration ?? 0) * (booking.itemCount ?? 1);

  return (
    <TimeSlotSelector
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      slots={slots}
      selectedDate={booking.date}
      selectedSlot={booking.slot ?? null}
      onSelectSlot={onSelectSlot}
      estimatedDuration={totalMinutes}
      bufferTime={worker.bufferTime}
    />
  );
}
