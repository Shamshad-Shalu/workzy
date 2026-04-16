import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCheck,
  Clock,
  Eye,
  MapPin,
  XCircle,
  CheckCircle,
  Navigation,
  PlayCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import { BOOKING_STATUS, ROLE } from '@/constants';
import type { BookingStatus, Role } from '@/constants';
import { cn } from '@/lib/utils';
import type { BookingListItem } from '@/types/booking';
import { formatCurrency } from '@/utils/currency';
import { formatSmartDate, formatTime12 } from '@/utils/time.format';

import { BOOKING_STATUS_META, PAYMENT_STATUS_META } from '../helper/bookingStatus.config';

export interface BookingCardHandlers {
  onAccept?: (id: string) => void;
  onStart?: (booking: BookingListItem) => void;
  onCancel?: (booking: BookingListItem) => void;
  onReject?: (id: string) => void;
  onReached?: (id: string) => void;
  onEnRoute?: (id: string) => void;
  onComplete?: (id: string) => void;
  onReqExtra?: (id: string) => void;
  onPayExtra?: (id: string) => void;
  onApprove?: (id: string) => void;
  onDispute?: (id: string) => void;
}

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

const ProfileImage = ({ src, size = 40, name }: { src?: string; size?: number; name: string }) => (
  <div
    className="rounded-xl bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    {src ? (
      <img src={src} alt={name} className="w-full h-full object-cover" />
    ) : (
      <span className="text-sm font-bold text-muted-foreground">
        {name?.[0]?.toUpperCase() ?? '?'}
      </span>
    )}
  </div>
);

interface Props {
  booking: BookingListItem;
  handlers?: BookingCardHandlers;
  role: Role;
  index: number;
  detailPath?: string;
}

export default function BookingCard({ booking: b, handlers, role, index, detailPath }: Props) {
  const cfg = BOOKING_STATUS_META[b.status];
  const pc = PAYMENT_STATUS_META[b.paymentStatus] ?? PAYMENT_STATUS_META.pending;
  const isAdmin = role === ROLE.ADMIN;
  const extraPending = b.extraCharge?.status === 'pending';
  const extraApproved = b.extraCharge?.status === 'approved';

  const otherAvatar = role === ROLE.WORKER ? b.user.profileImage : b.worker.profileImage;
  const otherName = role === ROLE.WORKER ? b.user.name : b.worker.name;
  const to = detailPath ?? `/bookings/${b.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04, ease: 'easeOut' }}
      className={cn(
        'bg-card rounded-2xl border border-border border-l-[3px] overflow-hidden',
        'shadow-sm hover:shadow-md transition-all duration-200',
        cfg.accent
      )}
    >
      {extraPending && b.extraCharge?.amount && (
        <div className="bg-amber-500/15 text-amber-400 border-amber-500/30 px-4 py-2.5 flex items-center gap-2">
          <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium flex-1">
            {role === ROLE.WORKER ? (
              <>
                Extra charge of <strong>{formatCurrency(b.extraCharge.amount)}</strong> awaiting
                approval
              </>
            ) : (
              <>
                Worker requested extra charge of{' '}
                <strong>{formatCurrency(b.extraCharge.amount)}</strong>
              </>
            )}
          </p>
          <Link
            to={to}
            className="text-xs text-amber-700 dark:text-amber-300 font-semibold underline underline-offset-2 whitespace-nowrap"
          >
            Review →
          </Link>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {isAdmin ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ProfileImage src={b.user.profileImage} size={32} name={b.user.name} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold leading-none mb-0.5">
                      Customer
                    </p>
                    <p className="text-sm font-semibold truncate">{b.user.name}</p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="hidden sm:block text-muted-foreground/40 flex-shrink-0"
                />
                <div className="flex items-center gap-2.5 min-w-0">
                  <ProfileImage src={b.worker.profileImage} size={32} name={b.worker.name} />
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold leading-none mb-0.5">
                      Worker
                    </p>
                    <p className="text-sm font-semibold truncate">{b.worker.name}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <ProfileImage src={otherAvatar} size={44} name={otherName} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{otherName}</p>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded hidden sm:inline">
                      #{b.bookingId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {b.category.iconUrl && (
                      <img
                        src={b.category.iconUrl}
                        alt=""
                        className="w-3.5 h-3.5 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {b.category.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <StatusBadge status={b.status} />
        </div>
        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-dashed border-border flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-lg">
              {b.category.iconUrl && (
                <img src={b.category.iconUrl} alt="" className="w-3.5 h-3.5 object-cover rounded" />
              )}
              <span className="text-xs font-semibold text-foreground">{b.category.name}</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{b.bookingId}</span>
          </div>
        )}
        <div
          className={cn(
            'mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground',
            !isAdmin && 'sm:ml-[56px]'
          )}
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="flex-shrink-0" />
            {formatSmartDate(b.date)}
            {b.totalDays > 1 && (
              <span className="text-muted-foreground/60">
                +{b.totalDays - 1} day{b.totalDays > 2 ? 's' : ''}
              </span>
            )}
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
        {extraApproved && b.extraCharge?.amount && (
          <div className="mt-3 text-xs font-medium text-muted-foreground bg-muted/60 rounded-xl px-3 py-2 border border-green-200/60 dark:border-green-800/40 flex items-center gap-2">
            <CheckCheck size={12} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            Extra charge of <strong>{formatCurrency(b.extraCharge.amount)}</strong> approved and
            added to total
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className={cn('text-[10px] font-bold uppercase tracking-wide', pc.badge)}>
              {pc.label}
            </p>
            <p className="text-lg font-bold text-foreground leading-tight">
              {formatCurrency(b.total)}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            <Link to={to}>
              <Button variant="secondary" iconLeft={<Eye size={12} />} size="sm">
                Details
              </Button>
            </Link>
            {/* {b.status === BOOKING_STATUS.CONFIRMED && (
              <Button
                variant="blue"
                size="sm"
                iconLeft={<Phone size={12} />}
                onClick={() => handlers?.onEvide?.(b.id)}
              >
                Evidence
              </Button>
            )} */}
            {role === ROLE.USER && (
              <>
                {(b.status === BOOKING_STATUS.PENDING || b.status === BOOKING_STATUS.CONFIRMED) && (
                  <Button
                    variant="red"
                    size="sm"
                    iconLeft={<XCircle size={12} />}
                    onClick={() => handlers?.onCancel?.(b)}
                  >
                    Cancel
                  </Button>
                )}
                {b.status === BOOKING_STATUS.COMPLETED && (
                  <Button
                    variant="green"
                    size="sm"
                    iconLeft={<CheckCircle size={12} />}
                    onClick={() => handlers?.onApprove?.(b.id)}
                  >
                    Approve
                  </Button>
                )}
                {b.status === BOOKING_STATUS.COMPLETED &&
                  b.extraCharge?.amount &&
                  b.extraCharge.status === 'pending' && (
                    <Button
                      variant="warning"
                      size="sm"
                      iconLeft={<CheckCircle size={12} />}
                      onClick={() => {
                        console.log('hello::', b.id);
                        handlers?.onPayExtra?.(b.id);
                      }}
                    >
                      Pay Extra
                    </Button>
                  )}
                {(BOOKING_STATUS.IN_PROGRESS === b.status ||
                  BOOKING_STATUS.DISPUTED === b.status ||
                  BOOKING_STATUS.COMPLETED === b.status) && (
                  <Button
                    iconLeft={<ShieldAlert size={12} />}
                    variant="red"
                    onClick={() => handlers?.onDispute?.(b.id)}
                    size="sm"
                  >
                    Dispute
                  </Button>
                )}
              </>
            )}
            {BOOKING_STATUS.DISPUTED === b.status && (
              <Button
                iconLeft={<ShieldAlert size={12} />}
                variant="red"
                onClick={() => handlers?.onDispute?.(b.id)}
                size="sm"
              >
                Dispute
              </Button>
            )}
            {role === ROLE.WORKER && (
              <>
                {b.status === BOOKING_STATUS.PENDING && (
                  <>
                    <Button
                      variant="green"
                      size="sm"
                      iconLeft={<CheckCircle size={12} />}
                      onClick={() => handlers?.onAccept?.(b.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="red"
                      size="sm"
                      iconLeft={<XCircle size={12} />}
                      onClick={() => handlers?.onReject?.(b.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {b.status === BOOKING_STATUS.CONFIRMED && (
                  <Button
                    variant="blue"
                    size="sm"
                    iconLeft={<Navigation size={12} />}
                    onClick={() => handlers?.onEnRoute?.(b.id)}
                  >
                    On My Way
                  </Button>
                )}
                {b.status === BOOKING_STATUS.EN_ROUTE && (
                  <Button
                    variant="blue"
                    size="sm"
                    iconLeft={<CheckCircle size={12} />}
                    onClick={() => handlers?.onReached?.(b.id)}
                  >
                    I've Arrived
                  </Button>
                )}
                {b.status === BOOKING_STATUS.IN_PROGRESS && (
                  <Button
                    variant="warning"
                    size="sm"
                    iconLeft={<AlertTriangle size={12} />}
                    onClick={() => handlers?.onReqExtra?.(b.id)}
                  >
                    Request Extra Charge
                  </Button>
                )}
                {b.status === BOOKING_STATUS.REACHED && (
                  <Button
                    variant="blue"
                    size="sm"
                    iconLeft={<PlayCircle size={12} />}
                    onClick={() => handlers?.onStart?.(b)}
                  >
                    Enter OTP & Start Job
                  </Button>
                )}
                {b.status === BOOKING_STATUS.IN_PROGRESS && (
                  <Button
                    variant="blue"
                    size="sm"
                    iconLeft={<PlayCircle size={12} />}
                    onClick={() => handlers?.onComplete?.(b.id)}
                  >
                    Finish Job
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
