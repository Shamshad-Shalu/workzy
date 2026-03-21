import { AppModal } from '@/components/molecules/AppModal';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string | null;
}

export default function DetailModal({ open, onClose, bookingId }: DetailModalProps) {
  console.log('bookingId', bookingId);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      // title="Cancel Booking"
      // canCloseOnOutsideClick={!isSubmitting}
      className="max-w-2xl"
      hideFooter
    >
      <></>
    </AppModal>
  );
}
