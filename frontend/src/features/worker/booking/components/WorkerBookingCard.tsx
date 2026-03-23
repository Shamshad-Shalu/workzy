import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  PlayCircle,
  CheckCheck,
  PlusCircle,
} from 'lucide-react';

import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import { type BookingStatus } from '@/constants';
import {
  BOOKING_STATUS_META,
  PAYMENT_STATUS_META,
} from '@/features/user/booking/helper/bookingStatus.config';
import { cn } from '@/lib/utils';
import type { BookingCard } from '@/types/booking';
import { formatCurrency } from '@/utils/currency';
import { formatSmartDate, formatTime12 } from '@/utils/time.format';

import { StatusBadge } from '../../../user/booking/components/bookingActions/UserBookingCard';

export interface WorkerBookingCardHandlers {
  onView: (id: string) => void;
  onAccept: (id: string) => void;
  onReject: (booking: BookingCard) => void;
  onStart: (id: string) => void;
  onComplete: (booking: BookingCard) => void;
  onRequestExtra: (booking: BookingCard) => void;
}

interface Props {
  booking: BookingCard;
  handlers: WorkerBookingCardHandlers;
  index: number;
}

export default function WorkerBookingCard({ booking: b, handlers, index }: Props) {
  const { onView, onAccept, onReject, onStart, onComplete, onRequestExtra } = handlers;
  const cfg = BOOKING_STATUS_META[b.status];
  const pc = PAYMENT_STATUS_META[b.paymentStatus] ?? PAYMENT_STATUS_META.pending;

  const extraPending = b.extraCharge && b.extraCharge.status === 'pending';
  const extraApproved = b.extraCharge && b?.extraCharge.status === 'approved';

  const statusReasons = b.statusHistory.reduce<Partial<Record<BookingStatus, string>>>(
    (acc, item) => {
      if (item.reason) {
        acc[item.status] = item.reason;
      }
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
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ProfileImage src={b.user.profileImage} size={40} />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{b.user.name}</p>
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
              <span className="text-xs text-muted-foreground">{b.category.name}</span>
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

        {extraPending && (
          <div className="mt-3 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg px-3 py-2 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
            <AlertTriangle size={12} className="flex-shrink-0" />
            <span>
              Extra charge of {formatCurrency(b.extraCharge?.amount || 0)} is pending client
              approval
            </span>
          </div>
        )}

        {extraApproved && (
          <div className="mt-3 text-xs font-medium text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-lg px-3 py-2 border border-green-200/50 dark:border-green-800/50 flex items-center gap-2">
            <CheckCheck size={12} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <span>
              Extra charge of {formatCurrency(b.extraCharge?.amount || 0)} approved and added to
              total
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
              onClick={() => onView(b.id)}
              variant="secondary"
              iconLeft={<Eye size={12} />}
              size="sm"
            >
              Details
            </Button>

            {b.status === 'pending' && (
              <>
                <Button
                  iconLeft={<CheckCircle size={12} />}
                  variant="green"
                  onClick={() => onAccept(b.id)}
                  size="sm"
                >
                  Accept
                </Button>
                <Button
                  iconLeft={<XCircle size={12} />}
                  variant="red"
                  onClick={() => onReject(b)}
                  size="sm"
                >
                  Reject
                </Button>
              </>
            )}

            {b.status === 'confirmed' && (
              <Button
                iconLeft={<PlayCircle size={12} />}
                variant="blue"
                onClick={() => onStart(b.id)}
                size="sm"
              >
                Start Job
              </Button>
            )}

            {b.status === 'in_progress' && (
              <>
                <Button
                  iconLeft={<PlusCircle size={12} />}
                  variant="warning"
                  onClick={() => onRequestExtra(b)}
                  size="sm"
                >
                  {b.extraCharge ? 'View Extra' : 'Extra Charge'}
                </Button>
                <Button
                  iconLeft={<CheckCheck size={12} />}
                  variant="green"
                  onClick={() => onComplete(b)}
                  size="sm"
                >
                  Complete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
