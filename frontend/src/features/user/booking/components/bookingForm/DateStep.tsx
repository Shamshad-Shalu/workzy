import DateSelector from '@/features/slots/components/DateSelector';
import { useAvailableDates } from '@/features/slots/hooks/useSlot';
import type { BookingState } from '@/types/slot';
import type { PublicWorkerListItem } from '@/types/worker';

export default function DateStep({
  worker,
  booking,
  onDateSelect,
  lat,
  lng,
}: {
  worker: PublicWorkerListItem;
  booking: BookingState;
  onDateSelect: (date: string) => void | Promise<void>;
  lat: number;
  lng: number;
}) {
  const { data, isLoading, error, refetch } = useAvailableDates({
    workerId: worker.id,
    serviceId: worker.serviceId,
    itemCount: booking.itemCount,
    lat,
    lng,
  });

  return (
    <DateSelector
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      dates={data?.dates ?? {}}
      selectedDate={booking.date}
      onDateSelect={onDateSelect}
    />
  );
}
