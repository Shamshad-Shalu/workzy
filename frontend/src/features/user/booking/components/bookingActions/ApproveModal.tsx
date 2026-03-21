import { AppModal } from '@/components/molecules/AppModal';
import type { BookingCard } from '@/types/booking';

interface ApproveModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: string) => Promise<void>;
  isSubmitting?: boolean;
  booking: BookingCard | null;
}

export default function ApproveModal({ open, onClose, isSubmitting }: ApproveModalProps) {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      // title="Cancel Booking"
      canCloseOnOutsideClick={!isSubmitting}
      className="max-w-2xl"
      hideFooter
    >
      <></>
    </AppModal>
  );
}
