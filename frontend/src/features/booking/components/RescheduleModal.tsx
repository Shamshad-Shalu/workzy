import { toast } from 'sonner';

import { AppModal } from '@/components/molecules/AppModal';
import { ROLE, type Role } from '@/constants';
import type { BookingDetails } from '@/types/booking';
import { handleApiError } from '@/utils/handleApiError';

import { useRequestReschedule } from '../hooks/useReschedule';
import { useRescheduleFlow } from '../hooks/useRescheduleFlow';

import RescheduleForm from './RescheduleForm';
import ReschedulePendingView from './ReschedulePendingView';

import type { bookingRescheduleFormType } from '../validation/bookingRescheduleFormData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails;
  role?: Role;
}

export default function RescheduleModal({ isOpen, onClose, booking, role = ROLE.USER }: Props) {
  const hasPendingRequest = booking.rescheduleRequest?.status === 'pending';

  const ctx = useRescheduleFlow(booking, role);

  const { mutateAsync: requestReschedule, isPending: isRescheduling } = useRequestReschedule();
  const isLoading = ctx.isLoading || isRescheduling;

  const onSubmit = async (formData: bookingRescheduleFormType) => {
    try {
      const { message } = await requestReschedule({ bookingId: booking.id, data: formData });
      if (message) {
        toast.success(message);
      }
      onCloseModal();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const onCloseModal = async () => {
    await ctx.reset();
    onClose();
  };

  return (
    <AppModal
      open={isOpen}
      onClose={onCloseModal}
      title="Reschedule Booking"
      canCloseOnOutsideClick={!isLoading}
      hideFooter
      className="md:max-w-md"
    >
      {hasPendingRequest ? (
        <ReschedulePendingView booking={booking} role={role} onClose={onCloseModal} />
      ) : (
        <RescheduleForm
          booking={booking}
          ctx={ctx}
          onSubmit={onSubmit}
          isRescheduling={isRescheduling}
        />
      )}
    </AppModal>
  );
}
