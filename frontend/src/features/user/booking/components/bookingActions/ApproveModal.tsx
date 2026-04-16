import { CheckCircle2, Star, ThumbsUp } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookingDetails } from '@/hooks/useBookingDetails';
import { formatCurrency } from '@/utils/currency';

interface ApproveModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string | null;
  onSubmit: (id: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function ApproveModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  bookingId,
}: ApproveModalProps) {
  const { booking, error, isLoading } = useBookingDetails(bookingId);

  if (isLoading) {
    return (
      <AppModal open={open} onClose={onClose} title="Accept Booking">
        <Skeleton className="h-40 w-full" />
      </AppModal>
    );
  }

  if (error || !booking) {
    return null;
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
        Go Back
      </Button>
      <Button
        variant="green"
        disabled={isSubmitting}
        onClick={() => onSubmit(booking.id)}
        loading={isSubmitting}
        iconLeft={<ThumbsUp size={14} />}
      >
        Approve & Release Payment
      </Button>
    </div>
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Approve Completion"
      canCloseOnOutsideClick={!isSubmitting}
      className="max-w-md"
      footer={footer}
    >
      <div className="space-y-6 py-2">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-foreground">Finalize Booking?</h4>
            <p className="text-sm text-muted-foreground mt-1">
              By approving, you confirm the work is completed to your satisfaction. The payment of{' '}
              <span className="font-bold text-foreground">{formatCurrency(booking.total)}</span>{' '}
              will be released to the worker.
            </p>
          </div>
        </div>

        {booking.workerNote && (
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Worker's Completion Note
            </p>
            <p className="text-sm italic text-foreground tracking-tight">"{booking.workerNote}"</p>
          </div>
        )}

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
          <div className="mt-1">
            <Star size={18} className="text-indigo-600 fill-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-900">What happens next?</p>
            <p className="text-xs text-indigo-700 leading-relaxed mt-0.5">
              After approval, you can leave a review for the worker and download your formal
              receipt.
            </p>
          </div>
        </div>
      </div>
    </AppModal>
  );
}
