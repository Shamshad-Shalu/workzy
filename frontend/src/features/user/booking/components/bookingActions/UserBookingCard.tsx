import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  Clock,
  CreditCard,
  Download,
  Eye,
  ImageIcon,
  MapPin,
  ShieldAlert,
  Star,
  ThumbsUp,
  XCircle,
} from 'lucide-react';

import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import { type BookingStatus } from '@/constants';
import { cn } from '@/lib/utils';
import type { BookingCard } from '@/types/booking';
import { formatCurrency } from '@/utils/currency';
import { formatSmartDate, formatTime12 } from '@/utils/time.format';

import { BOOKING_STATUS_META, PAYMENT_STATUS_META } from '../../helper/bookingStatus.config';



export interface BookingCardHandlers {
  onView: (id: string) => void;
  onCancel: (booking: BookingCard) => void;
  onPayExtra: (booking: BookingCard) => void;
  onApprove: (booking: BookingCard) => void;
  onEvidence: (booking: BookingCard) => void;
  onDispute: (id: string) => void;
  onReview: (id: string) => void;
}

interface Props {
  booking: BookingCard;
  handlers: BookingCardHandlers;
  index: number;
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const c = BOOKING_STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full',
        'text-[11px] font-medium border whitespace-nowrap',
        c.badge
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', c.dot)} />
      {c.label}
    </span>
  );
}

export default  function UserBookingCard({ booking: b, handlers, index }: Props) {
  const { onView, onApprove, onCancel, onDispute, onEvidence, onPayExtra, onReview } = handlers;
  const cfg = BOOKING_STATUS_META[b.status];
  const pc = PAYMENT_STATUS_META[b.paymentStatus] ?? PAYMENT_STATUS_META.pending;

  const extraPending = b.extraCharge && b.extraCharge.status === 'pending';
  const extraApproved = b.extraCharge && b?.extraCharge.status === 'approved';

  const statusReasons = b.statusHistory.reduce<Partial<Record<BookingStatus, string>>>(
    (acc, item) => {
      if (item.reason) {acc[item.status] = item.reason;}
      return acc;
    },
    {}
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: 'easeOut' }}
      className={cn(
        'bg-card rounded-xl border border-border',
        'border-l-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        cfg.accent
      )}
    >
      {extraPending &&b.extraCharge?.amount && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 flex items-center gap-2">
          <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex-1">
            Worker requested extra charge of{' '}
            <strong>{formatCurrency(b.extraCharge?.amount)}</strong>
          </p>
          <button
            onClick={() => onPayExtra(b)}
            className="text-xs text-amber-700 dark:text-amber-300 font-semibold underline underline-offset-2 whitespace-nowrap"
          >
            Review →
          </button>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ProfileImage src={b.worker.profileImage} size={40} />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {b.worker.displayName}
              </p>
              <span className="text-border text-xs hidden sm:inline">·</span>
              <p className="text-xs text-muted-foreground hidden sm:inline">{b.bookingId}</p>
            </div>

            <p className="text-[13px] font-medium text-foreground mt-0.5 truncate">
              {b.serviceName}
            </p>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {b.category.iconUrl && (
                <img
                  src={b.category.iconUrl}
                  alt=""
                  className="w-3.5 h-3.5 rounded object-cover flex-shrink-0"
                />
              )}
              <span className="text-xs text-muted-foreground">{b.category.name}</span>
              {b.worker.averageRating > 0 && (
                <>
                  <span className="text-border text-xs">·</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        size={10}
                        className={
                          i <= Math.round(b.worker.averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-muted text-muted'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {b.worker.averageRating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>
          <StatusBadge status={b.status} />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="flex-shrink-0" />
            {formatSmartDate(b.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} className="flex-shrink-0" />
            {formatTime12(b.startTime)} – {formatTime12(b.endTime)}
          </span>
          <span className="flex items-center gap-1.5 min-w-0">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{b.addressLabel}</span>
          </span>
        </div>
        {b.status === 'rejected' && (
          <div className="mt-3 text-xs text-destructive bg-destructive/8 rounded-lg px-3 py-2 border border-destructive/15">
            <span className="font-semibold">Rejected: </span>
            <span className="line-clamp-2 opacity-90">{statusReasons[b.status]}</span>
          </div>
        )}
        {b.status === 'cancelled' && (
          <div className="mt-3 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 border border-border">
            <span className="font-semibold text-foreground">Cancelled: </span>
            <span className="line-clamp-2">{statusReasons[b.status]}</span>
          </div>
        )}
        {b.status === 'disputed' && (
          <div className="mt-3 text-xs text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 rounded-lg px-3 py-2 border border-orange-200 dark:border-orange-800">
            <span className="font-semibold">Dispute: </span>
            <span className="line-clamp-2">{statusReasons[b.status]}</span>
          </div>
        )}
        {extraApproved && b.extraCharge?.amount && (
          <div className="mt-3 text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40 rounded-lg px-3 py-2 border border-green-200 dark:border-green-800">
            Extra charge of <strong>{formatCurrency(b.extraCharge?.amount)}</strong> approved and
            added to total
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className={cn('text-[11px] font-medium', pc.cls)}>{pc.label}</p>
            <p className="text-lg font-bold text-foreground tracking-tight">
              {formatCurrency(b.total)}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            <Button
              onClick={() => onView(b.id)}
              variant="secondary"
              iconLeft={<Eye size={12} />}
              size="sm"
            >
              Details
            </Button>
            {b.evidence && (
              <Button
                iconLeft={<ImageIcon size={12} />}
                variant="blue"
                onClick={() => onEvidence(b)}
                size="sm"
              >
                Evidence
              </Button>
            )}
            {b.status === 'completed' && !extraPending && (
              <Button
                iconLeft={<ThumbsUp size={12} />}
                variant="green"
                onClick={() => onApprove(b)}
                size="sm"
              >
                Approve
              </Button>
            )}
            {b.status === 'completed' && extraPending && (
              <Button
                iconLeft={<CreditCard size={12} />}
                variant="warning"
                onClick={() => onPayExtra(b)}
                size="sm"
              >
                Pay Extra
              </Button>
            )}
            {b.status === 'approved' && (
              <>
                <Button
                  iconLeft={<Star size={12} />}
                  variant={b.isReviewed ? 'ghost' : 'warning'}
                  onClick={() => {}}
                  size="sm"
                >
                  {' '}
                  {b.isReviewed ? 'Reviewed ✓' : 'Review'}
                </Button>
                <Button
                  iconLeft={<Download size={12} />}
                  variant="secondary"
                  onClick={() => onReview(b.id)}
                  size="sm"
                >
                  {' '}
                  Receipt
                </Button>
              </>
            )}
            {(b.status === 'pending' || b.status === 'confirmed') && (
              <Button
                iconLeft={<XCircle size={12} />}
                variant="red"
                onClick={() => onCancel(b)}
                size="sm"
              >
                {' '}
                Cancel{' '}
              </Button>
            )}
            {(b.status === 'in_progress' || b.status === 'completed') && (
              <Button
                iconLeft={<ShieldAlert size={12} />}
                variant="red"
                onClick={() => onDispute(b.id)}
                size="sm"
              >
                {' '}
                Dispute{' '}
              </Button>
            )}
            {b.status === 'disputed' && (
              <Button
                iconLeft={<ShieldAlert size={12} />}
                variant="warning"
                onClick={() => onDispute(b.id)}
                size="sm"
              >
                {' '}
                View Dispute{' '}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
