import { CreditCard } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import type { BookingCard } from '@/types/booking';
import { formatCurrency } from '@/utils/currency';
import { formatSmartDate } from '@/utils/time.format';

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  onPayAmount: (id: string) => Promise<void>;
  booking: BookingCard | null;
  isSubmitting?: boolean;
}

export default function ExtraChargeModal({
  open,
  onClose,
  onPayAmount,
  booking,
  isSubmitting = false,
}: CancelModalProps) {
  if (!booking) {
    return null;
  }
  const { extraCharge } = booking;
  if (!extraCharge) {
    return null;
  }
  const { amount, reason, requestedAt, status, evidenceUrl } = extraCharge;

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
        Decline
      </Button>
      <Button
        variant="green"
        disabled={isSubmitting}
        onClick={() => onPayAmount(booking.id)}
        loading={isSubmitting}
        iconLeft={<CreditCard size={14} />}
      >
        {' '}
        Pay {formatCurrency(amount)}
      </Button>
    </div>
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Cancel Booking"
      canCloseOnOutsideClick={!isSubmitting}
      className="max-w-lg"
      footer={footer}
      hideFooter={status === 'approved'}
    >
      <>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex justify-between items-start mb-1.5">
            <p className="text-sm font-semibold text-amber-800">Worker Requested Extra Charge</p>
            <span className="text-lg font-bold text-muted-foreground">
              {formatCurrency(amount)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{reason}</p>
          <p className="text-xs text-amber-500 mt-2">Requested {formatSmartDate(requestedAt)}</p>
        </div>
        {evidenceUrl && (
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Receipt / Evidence
            </p>
            <img
              src={evidenceUrl}
              alt="evidence"
              className="w-full rounded-xl object-cover h-40 bg-slate-100"
            />
          </div>
        )}
        <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Original Total</span>
            <span>{formatCurrency(booking.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Extra Charge</span>
            <span className="text-amber-600">{formatCurrency(amount)}</span>
          </div>
          <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-800">
            <span>New Total</span>
            <span>{formatCurrency(booking.total + amount)}</span>
          </div>
        </div>
      </>
    </AppModal>
  );
}
