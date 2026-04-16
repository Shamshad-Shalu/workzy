import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { AppModal } from '@/components/molecules/AppModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookingDetails } from '@/hooks/useBookingDetails';
import { createDescriptionRule } from '@/lib/validation/rules';
import { formatSmartDate, formatTime12 } from '@/utils/time.format';

interface DisputeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  bookingId: string | null;
  isSubmitting?: boolean;
}

const disputeSchema = z.object({
  reason: createDescriptionRule('Dispute reason'),
});

type DisputeFormType = z.infer<typeof disputeSchema>;

export default function DisputeModal({
  open,
  onClose,
  onSubmit,
  bookingId,
  isSubmitting = false,
}: DisputeModalProps) {
  const { booking, error, isLoading } = useBookingDetails(bookingId);

  const form = useForm<DisputeFormType>({
    resolver: zodResolver(disputeSchema),
    mode: 'onChange',
    defaultValues: {
      reason: '',
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!open) {
      reset({ reason: '' });
    }
  }, [open, reset]);

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }
  if (error || !booking) {
    return null;
  }

  const onFormSubmit = async (data: DisputeFormType) => {
    await onSubmit(data.reason as string);
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Report a Dispute"
      canCloseOnOutsideClick={!isSubmitting}
      className="max-w-lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="red"
            disabled={isSubmitting}
            onClick={handleSubmit(onFormSubmit)}
            loading={isSubmitting}
          >
            Submit Dispute
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 p-3 rounded-xl border bg-orange-50 text-orange-700 border-orange-200">
          <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            Our support team will review your dispute. Please provide as much detail as possible
            about the issue you encountered.
          </p>
        </div>

        <div className="bg-muted/50 border border-border rounded-xl p-3 flex flex-col gap-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Booking Info
          </p>
          <p className="text-sm font-semibold">
            {booking.category.name} • {formatSmartDate(booking.date)} •{' '}
            {formatTime12(booking.startTime)}
          </p>
          <p className="text-xs text-muted-foreground italic">
            Professional: {booking.worker.name}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label>Describe the issue</Label>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <AlertCircle size={10} /> Min 10 chars
            </span>
          </div>
          <Textarea
            placeholder="Please explain what went wrong..."
            disabled={isSubmitting}
            error={errors.reason?.message}
            rows={4}
            {...register('reason')}
          />
        </div>
      </div>
    </AppModal>
  );
}
