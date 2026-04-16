import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Package,
  Package2,
  Phone,
  Receipt,
  Star,
  Timer,
  Users,
  Video,
  Wallet,
  Zap,
  User,
  Navigation,
  PlayCircle,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { MediaViewer, type MediaItem } from '@/components/organisms/MediaViewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { BOOKING_STATUS, ROLE } from '@/constants';
import type { BookingStatus, Role } from '@/constants';
import { cn } from '@/lib/utils';
import BookingService from '@/services/booking.service';
import type { BookingDetails, EvidenceItem, ExtraChargeStatus } from '@/types/booking';
import { formatCurrency } from '@/utils/currency';
import { formatDuration } from '@/utils/time.format';

import { StatusBadge } from '../components/BookingCard';
import { BOOKING_STATUS_META, PAYMENT_STATUS_META } from '../helper/bookingStatus.config';

import type { BookingCardHandlers } from '../components/BookingCard';

interface BookingDetailsResponse {
  booking: BookingDetails;
}

export interface BookingDetailsPageProps {
  role: Role;
  handlers?: BookingCardHandlers;
  bookingId?: string;
}

function useBookingDetails(id: string) {
  return useQuery<BookingDetailsResponse>({
    queryKey: ['booking', id],
    queryFn: () => BookingService.getBookingDetails(id),
    enabled: !!id,
  });
}
const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const EXTRA_CHARGE_META: Record<ExtraChargeStatus, { label: string; badge: string; dot: string }> =
  {
    pending: {
      label: 'Pending',
      badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500',
    },
    approved: {
      label: 'Approved',
      badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    rejected: {
      label: 'Rejected',
      badge: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
      dot: 'bg-red-500',
    },
  };

function ExtraChargeStatusBadge({ status }: { status: ExtraChargeStatus }) {
  const c = EXTRA_CHARGE_META[status];
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

export default function BookingDetailsPage({
  role,
  handlers,
  bookingId: propBookingId,
}: BookingDetailsPageProps) {
  const { bookingId: paramId } = useParams<{ bookingId: string }>();
  const id = propBookingId ?? paramId ?? '';

  const { data, isLoading, error } = useBookingDetails(id);

  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }
  if (error || !data?.booking) {
    return <ErrorState />;
  }

  const b = data.booking;
  const primaryDate = b.dates[0];
  const pCfg = PAYMENT_STATUS_META[b.paymentStatus] ?? PAYMENT_STATUS_META.pending;
  // const sCfg = BOOKING_STATUS_META[b.status] ?? BOOKING_STATUS_META.pending;

  // const isAdmin = role === ROLE.ADMIN;
  // const isWorker = role === ROLE.WORKER;
  // const isUser = role === ROLE.USER;

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden border-b border-border"
      >
        <div
          className="pointer-events-none absolute  left-1/3 h-96 w-96 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, color-mix(in oklch, var(--color-primary) 12%, transparent) 0%, transparent 70%)`,
          }}
        />
        <div className="section-container relative py-8 md:py-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="space-y-3">
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
              >
                <span>Bookings</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{b.bookingId}</span>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-3">
                {b.category?.iconUrl && (
                  <img
                    src={b.category.iconUrl}
                    alt=""
                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-border"
                  />
                )}
                <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                  {b.category?.name ?? b.bookingId}
                </h1>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
                <StatusBadge status={b.status} />
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
                    pCfg.badge
                  )}
                >
                  {pCfg.label}
                </span>
                {b.isReviewed && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">
                    <BadgeCheck className="h-3 w-3" /> Reviewed
                  </span>
                )}
              </motion.div>
            </div>

            {/* Right: quick stat strip */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-5 rounded-2xl border border-border bg-card/60 px-5 py-4 backdrop-blur-md md:gap-8"
            >
              <QuickStat label="Total" value={formatCurrency(b.total)} icon={Wallet} />
              <QuickStat label="Duration" value={formatDuration(b.duration)} icon={Timer} />
              <QuickStat label="Items" value={String(b.itemCount)} icon={Package2} />
              {primaryDate && (
                <QuickStat
                  label="Date"
                  value={dayjs(primaryDate.date).format('DD MMM YYYY')}
                  icon={Calendar}
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="section-container space-y-5 py-8">
        {/* Row 1: Schedule · Parties · Financials */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-5 lg:grid-cols-3"
        >
          {/* Schedule */}
          <motion.div variants={fadeUp}>
            <GlassCard title="Schedule" icon={Calendar}>
              <div className="space-y-2.5">
                {b.dates.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3.5"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                      <span className="text-[9px] font-bold uppercase text-amber-500">
                        {dayjs(slot.date).format('MMM')}
                      </span>
                      <span className="text-lg font-black leading-none text-amber-500">
                        {dayjs(slot.date).format('DD')}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {dayjs(slot.date).format('dddd, YYYY')}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {slot.startTime} — {slot.endTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InfoChip label="Duration" value={formatDuration(b.duration)} icon={Timer} />
                <InfoChip label="Items" value={`${b.itemCount} items`} icon={Package} />
                <InfoChip label="Rate" value={`${formatCurrency(b.rate)}/item`} icon={Zap} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Parties */}
          <motion.div variants={fadeUp}>
            <GlassCard title="Parties" icon={Users}>
              <PartyCard
                label="Customer"
                name={b.user.name}
                phone={b.user.phone}
                avatar={b.user.profileImage}
                accent="sky"
              />
              <PartyCard
                label="Worker"
                name={b.worker.name}
                phone={b.worker.phone}
                avatar={b.worker.profileImage}
                accent="violet"
                rating={b.worker.rating}
              />
            </GlassCard>
          </motion.div>

          {/* Financials */}
          <motion.div variants={fadeUp}>
            <GlassCard title="Financials" icon={CreditCard}>
              <div className="space-y-2">
                <FinancialLine label="Subtotal" value={b.subtotal} />
                <FinancialLine
                  label={`Discount (${b.discountPercent}%)`}
                  value={-b.discountAmount}
                  accent="emerald"
                />
                <FinancialLine label="Travel Cost" value={b.travelCost} />
                <FinancialLine
                  label={`Platform Fee (${b.platformFeePercent}%)`}
                  value={b.platformFee}
                  accent="violet"
                />
                {b.extraCharge?.status === 'approved' && b.extraCharge.amount && (
                  <FinancialLine label="Extra Charge" value={b.extraCharge.amount} accent="amber" />
                )}
                <div className="my-2 h-px bg-border" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-2xl font-black text-foreground">
                    {formatCurrency(b.total)}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Row 2: Location · Notes */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-5 lg:grid-cols-2"
        >
          <motion.div variants={fadeUp}>
            <GlassCard title="Location" icon={MapPin}>
              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-2">
                    <MapPin className="h-4 w-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{b.address.label}</p>
                    {b.address.location?.coordinates && (
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {b.address.location.coordinates[1].toFixed(6)},{' '}
                        {b.address.location.coordinates[0].toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
                {b.address.location?.coordinates && (
                  <a
                    href={`https://maps.google.com?q=${b.address.location.coordinates[1]},${b.address.location.coordinates[0]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-1.5 text-xs font-medium text-sky-500 transition-colors hover:text-sky-400"
                  >
                    Open in Google Maps
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeUp}>
            <GlassCard title="Notes" icon={FileText}>
              <div className="space-y-2.5">
                {b.userNote ? (
                  <NoteCard label="Customer Note" content={b.userNote} color="sky" icon={User} />
                ) : (
                  <EmptyNote label="No customer note" />
                )}
                {b.workerNote ? (
                  <NoteCard
                    label="Worker Note"
                    content={b.workerNote}
                    color="violet"
                    icon={Users}
                  />
                ) : null}
                {b.adminNote ? (
                  <NoteCard
                    label="Admin Note"
                    content={b.adminNote}
                    color="amber"
                    icon={FileText}
                  />
                ) : null}
                {!b.userNote && !b.workerNote && !b.adminNote && (
                  <EmptyNote label="No notes added" />
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Row 3: Status Timeline · Side panel */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-5 lg:grid-cols-3"
        >
          {/* Status Timeline */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <GlassCard title="Status Timeline" icon={CheckCircle2}>
              <StatusTimeline history={b.statusHistory} />
            </GlassCard>
          </motion.div>

          {/* Side column: Actions + Extra Charge + Evidence */}
          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            {/* Role-aware action panel */}
            <GlassCard title="Actions" icon={Zap}>
              <ActionPanel booking={b} role={role} handlers={handlers} />
            </GlassCard>

            {/* Extra Charge */}
            <GlassCard title="Extra Charge" icon={Receipt}>
              {b.extraCharge ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-foreground">
                      {formatCurrency(b.extraCharge.amount)}
                    </span>
                    <ExtraChargeStatusBadge status={b.extraCharge.status} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {b.extraCharge.reason}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60">
                    Requested {dayjs(b.extraCharge.requestedAt).format('DD MMM YYYY, HH:mm')}
                  </p>
                  {b.extraCharge.respondedAt && (
                    <p className="text-[11px] text-muted-foreground/60">
                      Responded {dayjs(b.extraCharge.respondedAt).format('DD MMM YYYY, HH:mm')}
                    </p>
                  )}
                </div>
              ) : (
                <EmptySection icon={Receipt} label="No extra charges" />
              )}
            </GlassCard>

            {/* Evidence */}
            {b.evidence && (
              <GlassCard title="Evidence" icon={ImageIcon}>
                <EvidenceSection label="Before" items={b.evidence.before} />
                <EvidenceSection label="After" items={b.evidence.after} />
                {!b.evidence.before?.length && !b.evidence.after?.length && (
                  <EmptySection icon={ImageIcon} label="No evidence uploaded" />
                )}
              </GlassCard>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function ActionPanel({
  booking: b,
  role,
  handlers,
}: {
  booking: BookingDetails;
  role: Role;
  handlers?: BookingCardHandlers;
}) {
  const isAdmin = role === ROLE.ADMIN;
  const isUser = role === ROLE.USER;
  const isWorker = role === ROLE.WORKER;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <ActionBtn icon={Phone} label="Call Worker" accent="violet" />
        <ActionBtn icon={MessageCircle} label="Open Chat" accent="sky" />
      </div>

      {isUser && (
        <>
          {(b.status === BOOKING_STATUS.PENDING || b.status === BOOKING_STATUS.CONFIRMED) && (
            <ActionBtn
              icon={XCircle}
              label="Cancel Booking"
              accent="red"
              onClick={() => handlers?.onCancel?.(b)}
              full
            />
          )}
          {b.status === BOOKING_STATUS.COMPLETED && (
            <ActionBtn
              icon={CheckCircle}
              label="Approve Completion"
              accent="green"
              onClick={() => handlers?.onApprove?.(b.id)}
              full
            />
          )}
        </>
      )}

      {isWorker && (
        <>
          {b.status === BOOKING_STATUS.PENDING && (
            <div className="grid grid-cols-2 gap-2">
              <ActionBtn
                icon={CheckCircle}
                label="Accept"
                accent="green"
                onClick={() => handlers?.onAccept?.(b.id)}
              />
              <ActionBtn
                icon={XCircle}
                label="Reject"
                accent="red"
                onClick={() => handlers?.onReject?.(b.id)}
              />
            </div>
          )}
          {b.status === BOOKING_STATUS.CONFIRMED && (
            <ActionBtn
              icon={Navigation}
              label="On My Way"
              accent="sky"
              onClick={() => handlers?.onEnRoute?.(b.id)}
              full
            />
          )}
          {b.status === BOOKING_STATUS.EN_ROUTE && (
            <ActionBtn
              icon={CheckCircle}
              label="I've Arrived"
              accent="sky"
              onClick={() => handlers?.onReached?.(b.id)}
              full
            />
          )}
          {b.status === BOOKING_STATUS.REACHED && (
            <ActionBtn
              icon={PlayCircle}
              label="Enter OTP & Start"
              accent="violet"
              onClick={() => handlers?.onStart?.(b)}
              full
            />
          )}
        </>
      )}

      {isAdmin && b.status === BOOKING_STATUS.COMPLETED && (
        <ActionBtn
          icon={CheckCircle}
          label="Approve & Release Payment"
          accent="green"
          onClick={() => handlers?.onApprove?.(b.id)}
          full
        />
      )}
    </div>
  );
}
function StatusTimeline({
  history,
}: {
  history: { status: BookingStatus; changedAt: Date; changedBy?: string; reason?: string }[];
}) {
  return (
    <div className="relative space-y-1 pl-2">
      {/* Connector line */}
      <div className="pointer-events-none absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-border via-border/40 to-transparent" />

      {history.map((h, i) => {
        const cfg = BOOKING_STATUS_META[h.status] ?? BOOKING_STATUS_META.pending;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * i + 0.2 }}
            className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-muted/40"
          >
            {/* Dot */}
            <div
              className={cn(
                'relative z-10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ring-2 ring-background',
                cfg.dot
              )}
            >
              <CheckCircle2 className="h-2.5 w-2.5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                    cfg.badge
                  )}
                >
                  {cfg.label}
                </span>
                <time className="flex-shrink-0 font-mono text-[11px] text-muted-foreground">
                  {dayjs(h.changedAt).format('DD MMM, HH:mm')}
                </time>
              </div>

              {h.changedBy && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  by <span className="capitalize text-foreground/70">{h.changedBy}</span>
                </p>
              )}
              {h.reason && (
                <p className="mt-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground">
                  {h.reason}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Evidence Section with MediaViewer ───────────────────────────────────────

function EvidenceSection({ label, items }: { label: string; items: EvidenceItem[] }) {
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);

  if (!items?.length) {
    return null;
  }

  const mediaItems: MediaItem[] = items.map(i => ({
    url: i.url,
    type: i.type,
    caption: `${label} — ${i.type}`,
  }));

  return (
    <>
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setViewerIdx(i)}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Video className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {viewerIdx !== null && (
          <MediaViewer
            item={mediaItems[viewerIdx]}
            hasPrev={viewerIdx > 0}
            hasNext={viewerIdx < mediaItems.length - 1}
            counter={`${viewerIdx + 1} / ${mediaItems.length}`}
            onClose={() => setViewerIdx(null)}
            onPrev={() => setViewerIdx(v => (v !== null && v > 0 ? v - 1 : v))}
            onNext={() => setViewerIdx(v => (v !== null && v < mediaItems.length - 1 ? v + 1 : v))}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Primitive UI pieces ──────────────────────────────────────────────────────

function GlassCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <div className="rounded-lg border border-border bg-muted p-1.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-bold text-foreground">{title}</span>
      </div>
      <div className="flex-1 space-y-3 p-5">{children}</div>
    </div>
  );
}

function QuickStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function InfoChip({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-3">
      <Icon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-xs font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function PartyCard({
  label,
  name,
  phone,
  avatar,
  accent,
  rating,
}: {
  label: string;
  name: string;
  phone: string;
  avatar: string;
  accent: 'sky' | 'violet';
  rating?: number;
}) {
  const accentCls: Record<string, string> = {
    sky: 'from-sky-500/10 to-sky-500/[0.03] border-sky-500/20',
    violet: 'from-violet-500/10 to-violet-500/[0.03] border-violet-500/20',
  };
  return (
    <div className={cn('rounded-xl border bg-gradient-to-br p-4', accentCls[accent])}>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 ring-1 ring-border">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-muted text-sm font-bold text-muted-foreground">
            {name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            {phone || 'No phone'}
          </p>
          {typeof rating === 'number' && (
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-amber-500">
              <Star className="h-3 w-3 fill-amber-500" />
              {rating > 0 ? rating.toFixed(1) : 'New'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FinancialLine({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: 'emerald' | 'violet' | 'amber';
}) {
  const colorCls: Record<string, string> = {
    emerald: 'text-emerald-500 dark:text-emerald-400',
    violet: 'text-violet-500 dark:text-violet-400',
    amber: 'text-amber-500 dark:text-amber-400',
  };
  const cls = accent ? colorCls[accent] : 'text-foreground';
  const display = value < 0 ? `-${formatCurrency(Math.abs(value))}` : formatCurrency(value);

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-semibold', cls)}>{display}</span>
    </div>
  );
}

function NoteCard({
  label,
  content,
  color,
  icon: Icon,
}: {
  label: string;
  content: string;
  color: 'sky' | 'violet' | 'amber';
  icon: React.ElementType;
}) {
  const cls: Record<string, string> = {
    sky: 'bg-sky-500/[0.07] border-sky-500/20 text-sky-600 dark:text-sky-400',
    violet: 'bg-violet-500/[0.07] border-violet-500/20 text-violet-600 dark:text-violet-400',
    amber: 'bg-amber-500/[0.07] border-amber-500/20 text-amber-600 dark:text-amber-400',
  };
  return (
    <div className={cn('rounded-xl border p-3', cls[color])}>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="text-xs leading-relaxed text-foreground/80">{content}</p>
    </div>
  );
}

function EmptyNote({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
      <FileText className="h-3.5 w-3.5 opacity-50" />
      {label}
    </div>
  );
}

function EmptySection({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground">
      <Icon className="h-7 w-7 opacity-25" />
      <span className="text-xs">{label}</span>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  accent,
  onClick,
  full = false,
}: {
  icon: React.ElementType;
  label: string;
  accent: 'violet' | 'sky' | 'amber' | 'green' | 'red';
  onClick?: () => void;
  full?: boolean;
}) {
  const cls: Record<string, string> = {
    violet:
      'hover:border-violet-500/30 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10',
    sky: 'hover:border-sky-500/30 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-500/10',
    amber:
      'hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10',
    green:
      'hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10',
    red: 'hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10',
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-all duration-200',
        cls[accent],
        full && 'col-span-2 w-full'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ─── Skeleton & Error ─────────────────────────────────────────────────────────

function BookingDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-container border-b border-border py-10">
        <Skeleton className="mb-3 h-10 w-64" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="section-container space-y-5 py-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-3 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="text-sm text-muted-foreground">Failed to load booking details.</p>
      </div>
    </div>
  );
}
