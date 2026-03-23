import { PlayCircle, Info } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import type { BookingCard } from '@/types/booking';
import { formatSmartDate, formatTime12 } from '@/utils/time.format';

interface WorkerStartJobModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string) => Promise<void>;
  booking: BookingCard | null;
  isSubmitting?: boolean;
}

export default function WorkerStartJobModal({
  open,
  onClose,
  onSubmit,
  booking,
  isSubmitting = false,
}: WorkerStartJobModalProps) {
  if (!booking) {
    return null;
  }

  const { category, date, startTime } = booking;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Start Job"
      canCloseOnOutsideClick={!isSubmitting}
      className="max-w-md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="blue"
            onClick={() => onSubmit(booking.id)}
            loading={isSubmitting}
            iconLeft={<PlayCircle size={16} />}
          >
            Confirm & Start
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 p-3 rounded-xl border bg-blue-50 text-blue-700 border-blue-200">
          <Info size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            Starting the job will notify the client that you have arrived and work is commencing.
            The status will change to "In Progress".
          </p>
        </div>

        <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Service</span>
            <span className="text-sm font-semibold text-foreground">{category.name}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Scheduled Date</span>
            <span className="font-medium text-foreground">{formatSmartDate(date)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Scheduled Time</span>
            <span className="font-medium text-foreground">{formatTime12(startTime)}</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Location</span>
            <span className="font-medium text-foreground text-right max-w-[200px] truncate">
              {booking.addressLabel}
            </span>
          </div>
        </div>
      </div>
    </AppModal>
  );
}
