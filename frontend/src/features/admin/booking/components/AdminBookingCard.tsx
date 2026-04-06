import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Eye,
  ImageIcon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ThumbsUp,
  CreditCard,
  User,
} from 'lucide-react';

import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import type { BookingStatus } from '@/constants';
import { StatusBadge } from '@/features/user/booking/components/bookingActions/UserBookingCard';
import { cn } from '@/lib/utils';
import type { BookingCard } from '@/types/booking';
import { formatCurrency } from '@/utils/currency';
import { formatSmartDate, formatTime12 } from '@/utils/time.format';

const STATUS_ACCENT: Record<BookingStatus | 'default', string> = {
  pending: 'border-l-yellow-400',
  confirmed: 'border-l-blue-400',
  in_progress: 'border-l-indigo-400',
  completed: 'border-l-green-400',
  approved: 'border-l-emerald-500',
  cancelled: 'border-l-zinc-400',
  rejected: 'border-l-red-400',
  disputed: 'border-l-orange-400',
  default: 'border-l-border',
};

const PAYMENT_CONFIG: Record<string, { label: string; cls: string }> = {
  paid: { label: 'Paid', cls: 'text-green-600 dark:text-green-400' },
  pending: { label: 'Unpaid', cls: 'text-yellow-600 dark:text-yellow-400' },
  refunded: { label: 'Refunded', cls: 'text-blue-500' },
  failed: { label: 'Payment Failed', cls: 'text-destructive' },
};

interface Props {
  booking: BookingCard;
  index?: number;
  onView?: (id: string) => void;
  onEvidence?: (b: BookingCard) => void;
  onCancel?: (b: BookingCard) => void;
  onDispute?: (b: BookingCard) => void;
  onApprove?: (b: BookingCard) => void;
  onPayExtra?: (b: BookingCard) => void;
  onReview?: (id: string) => void;
}

export function AdminBookingCard({
  booking: b,
  index = 0,
  onView,
  onEvidence,
  onCancel,
  onDispute,
  onApprove,
  onPayExtra,
  onReview,
}: Props) {
  const accent = STATUS_ACCENT[b.status] ?? STATUS_ACCENT.default;
  const pc = PAYMENT_CONFIG[b.paymentStatus] ?? {
    label: b.paymentStatus,
    cls: 'text-muted-foreground',
  };

  const extraPending = b.extraCharge && b.extraCharge.status === 'pending';
  const extraApproved = b.extraCharge?.status === 'approved';

  const statusReason = [...(b.statusHistory ?? [])]
    .reverse()
    .find(h => h.status === b.status)?.reason;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: 'easeOut' }}
      className={cn(
        'bg-card rounded-xl border border-border border-l-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden',
        accent
      )}
    >
      {extraPending && b.extraCharge?.amount && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 flex items-center gap-2">
          <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex-1">
            Extra charge of <strong>{formatCurrency(b.extraCharge.amount)}</strong> requested
          </p>
          <button
            onClick={() => onPayExtra?.(b)}
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
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground truncate">
                {b.worker.displayName}
              </p>
              {/* {b.worker.isPremium && (
                <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              )} */}
              <span className="text-border text-xs hidden sm:inline">·</span>
              <p className="text-xs text-muted-foreground hidden sm:inline">{b.bookingId}</p>
            </div>

            <p className="text-[13px] font-medium text-foreground mt-0.5 truncate">
              {b.category.name}
            </p>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {b.category.iconUrl && (
                <img
                  src={b.category.iconUrl}
                  alt=""
                  className="w-3.5 h-3.5 rounded object-cover flex-shrink-0"
                />
              )}
              {b.worker.averageRating > 0 && (
                <>
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

        <div className="mt-3 flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
          <ProfileImage src={b.user.profileImage} size={22} />
          <User size={11} className="text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Customer: <span className="font-medium text-foreground">{b.user.name}</span>
          </p>
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
          {b.addressLabel && (
            <span className="flex items-center gap-1.5 min-w-0">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate">{b.addressLabel}</span>
            </span>
          )}
        </div>

        {b.status === 'rejected' && statusReason && (
          <div className="mt-3 text-xs text-destructive bg-destructive/8 rounded-lg px-3 py-2 border border-destructive/15">
            <span className="font-semibold">Rejected: </span>
            <span className="line-clamp-2 opacity-90">{statusReason}</span>
          </div>
        )}
        {b.status === 'cancelled' && statusReason && (
          <div className="mt-3 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 border border-border">
            <span className="font-semibold text-foreground">Cancelled: </span>
            <span className="line-clamp-2">{statusReason}</span>
          </div>
        )}
        {b.status === 'disputed' && statusReason && (
          <div className="mt-3 text-xs text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 rounded-lg px-3 py-2 border border-orange-200 dark:border-orange-800">
            <span className="font-semibold">Dispute: </span>
            <span className="line-clamp-2">{statusReason}</span>
          </div>
        )}
        {extraApproved && b.extraCharge?.amount && (
          <div className="mt-3 text-xs font-medium text-muted-foreground bg-muted rounded-lg px-3 py-2 border border-green-200/50 dark:border-green-800/50 flex items-center gap-2">
            <CheckCircle2 size={12} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <span>
              Extra charge of <strong>{formatCurrency(b.extraCharge.amount)}</strong> approved
            </span>
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
              onClick={() => onView?.(b.id)}
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
                onClick={() => onEvidence?.(b)}
                size="sm"
              >
                Evidence
              </Button>
            )}

            {b.status === 'completed' && !extraPending && (
              <Button
                iconLeft={<ThumbsUp size={12} />}
                variant="green"
                onClick={() => onApprove?.(b)}
                size="sm"
              >
                Approve
              </Button>
            )}

            {b.status === 'completed' && extraPending && (
              <Button
                iconLeft={<CreditCard size={12} />}
                variant="warning"
                onClick={() => onPayExtra?.(b)}
                size="sm"
              >
                Pay Extra
              </Button>
            )}

            {/* {b.status === 'approved' && (
              <>
                <Button
                  iconLeft={<Star size={12} />}
                  variant={b.isReviewed ? 'ghost' : 'warning'}
                  onClick={() => {}}
                  size="sm"
                >
                  {b.isReviewed ? 'Reviewed ✓' : 'Review'}
                </Button>
                <Button iconLeft={<Download size={12} />} variant="secondary" onClick={() => onReview?.(b.id)} size="sm">
                  Receipt
                </Button>
              </>
            )} */}

            {(b.status === 'pending' || b.status === 'confirmed') && (
              <Button
                iconLeft={<XCircle size={12} />}
                variant="red"
                onClick={() => onCancel?.(b)}
                size="sm"
              >
                Cancel
              </Button>
            )}

            {(b.status === 'in_progress' || b.status === 'completed') && (
              <Button
                iconLeft={<ShieldAlert size={12} />}
                variant="red"
                onClick={() => onDispute?.(b)}
                size="sm"
              >
                Dispute
              </Button>
            )}

            {b.status === 'disputed' && (
              <Button
                iconLeft={<ShieldAlert size={12} />}
                variant="warning"
                onClick={() => onDispute?.(b)}
                size="sm"
              >
                View Dispute
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
