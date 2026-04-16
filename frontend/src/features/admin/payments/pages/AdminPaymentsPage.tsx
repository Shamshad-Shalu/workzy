import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { ArrowUpDown, CreditCard, Eye, Filter } from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import { DatePicker } from '@/components/atoms/Datepicker';
import Select from '@/components/atoms/Select';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BILL_TYPE, PAYMENT_STATUS, type BillType, type PaymentStatus } from '@/constants/payment';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { cn } from '@/lib/utils';
import type { PaymentAdmin } from '@/types/payment';

import TableSkeleton from '../components/TableSkeleton';
import { useAdminPayments } from '../hooks/useAdminPayments';

type BadgeVariant = 'green' | 'blue' | 'amber' | 'red' | 'slate' | 'secondary';

const STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  succeeded: { label: 'Succeeded', variant: 'green' },
  released: { label: 'Released', variant: 'blue' },
  pending: { label: 'Pending', variant: 'amber' },
  failed: { label: 'Failed', variant: 'red' },
  refunded: { label: 'Refunded', variant: 'slate' },
  cancelled: { label: 'Cancelled', variant: 'secondary' },
};

const BILL_TYPE_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  subscription: { label: 'Subscription', variant: 'blue' },
  booking: { label: 'Booking', variant: 'green' },
  extra_charge: { label: 'Extra Charge', variant: 'amber' },
  refund: { label: 'Refund', variant: 'red' },
};

const CUSTOM_PARAMS = [
  { key: 'billType', defaultValue: 'all' },
  { key: 'fromDate', parser: (v: string) => (v ? dayjs(v).toDate() : null) },
  { key: 'toDate', parser: (v: string) => (v ? dayjs(v).toDate() : null) },
  { key: 'minAmount', parser: (v: string) => (v ? parseFloat(v) : null) },
  { key: 'maxAmount', parser: (v: string) => (v ? parseFloat(v) : null) },
];

const formatDateForUrl = (date: Date | null | undefined): string | null => {
  if (!date) {
    return null;
  }
  return dayjs(date).format('YYYY-MM-DD');
};

export default function AdminPaymentsPage() {
  const { search, status, updateParams, billType, fromDate, toDate, maxAmount, minAmount } =
    useUrlFilterParams<{
      billType: string;
      fromDate: Date | null;
      toDate: Date | null;
      minAmount: number | null;
      maxAmount: number | null;
    }>(CUSTOM_PARAMS);

  const handleSearchChange = useCallback(
    (v: string) => updateParams({ search: v }),
    [updateParams]
  );

  const clearAllFilters = useCallback(() => {
    updateParams({
      search: '',
      status: 'all',
      billType: 'all',
      fromDate: null,
      toDate: null,
      minAmount: null,
      maxAmount: null,
    });
  }, [updateParams]);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminPayments({
      billType: billType as BillType | 'all',
      status: status as PaymentStatus | 'all',
      search,
      fromDate: fromDate ? dayjs(fromDate).startOf('day').format('YYYY-MM-DD') : undefined,
      toDate: toDate ? dayjs(toDate).endOf('day').format('YYYY-MM-DD') : undefined,
      minAmount: minAmount ?? undefined,
      maxAmount: maxAmount ?? undefined,
    });

  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  const payments = data?.pages.flatMap(p => p.payments) ?? [];
  const isHideButton =
    fromDate ||
    toDate ||
    status !== 'all' ||
    billType !== 'all' ||
    search ||
    minAmount !== null ||
    maxAmount !== null;
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="px-6 pt-8 pb-4"
      >
        <PageHeader title="Payments" description="Platform-wide transaction management" />
      </motion.div>
      <div className="bg-card border rounded-xl p-6 pb-0 mt-6 mb-3">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className={cn('sm:col-span-4', isHideButton ? 'sm:col-span-3' : '')}>
            <SearchInput
              disabled={isError}
              placeholder="Search by transaction ID or name..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:col-span-2">
            <Select
              value={status}
              onChange={v => updateParams({ status: v })}
              leftIcon={<Filter className="w-4 h-4 text-primary" />}
              options={[
                { label: 'All Statuses', value: 'all' },
                ...Object.values(PAYMENT_STATUS).map(val => ({
                  label: val.charAt(0).toUpperCase() + val.slice(1),
                  value: val,
                })),
              ]}
            />
          </div>
          <div className="sm:col-span-2">
            <Select
              value={billType}
              onChange={v => updateParams({ billType: v })}
              leftIcon={<CreditCard className="w-4 h-4 text-primary" />}
              options={[
                { label: 'All Payments', value: 'all' },
                ...Object.values(BILL_TYPE).map(val => ({
                  label: val.charAt(0).toUpperCase() + val.slice(1),
                  value: val,
                })),
              ]}
            />
          </div>
          <div className="sm:col-span-2">
            <DatePicker
              value={fromDate ?? undefined}
              onChange={date => updateParams({ fromDate: formatDateForUrl(date) })}
              placeholder="From Date"
              disabled={date => dayjs(date).isAfter(dayjs(), 'day')}
            />
          </div>
          <div className="sm:col-span-2">
            <DatePicker
              value={toDate ?? undefined}
              onChange={date => updateParams({ toDate: formatDateForUrl(date) })}
              placeholder="To Date"
              disabled={date => {
                if (fromDate && dayjs(date).isBefore(fromDate, 'day')) {
                  return true;
                }
                if (dayjs(date).isAfter(dayjs(), 'day')) {
                  return true;
                }
                return false;
              }}
            />
          </div>
          {isHideButton && (
            <div className="sm:col-span-1">
              <Button variant="red" size="sm" onClick={clearAllFilters} className="h-10">
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-card border  rounded-xl ">
        <div className="max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <TableSkeleton rows={6} />
          ) : isError ? (
            <ErrorState
              title="Couldn't load payments"
              description="Something went wrong while fetching payment data."
              onRetry={refetch}
            />
          ) : payments.length === 0 ? (
            <EmptyState
              title="No payments found"
              description="No payments found matching your filters."
              icon={<CreditCard className="w-8 h-8" />}
              action={
                <>
                  {isHideButton && (
                    <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-4">
                      Clear filters
                    </Button>
                  )}
                </>
              }
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1fr_1fr_0.8fr_0.8fr_auto] px-5 py-3 border-b border-border/50 bg-muted/50">
                {[
                  { label: 'Transaction', icon: <ArrowUpDown className="w-3 h-3" /> },
                  { label: 'Title' },
                  { label: 'User' },
                  { label: 'Worker' },
                  { label: 'Amount', icon: <ArrowUpDown className="w-3 h-3" /> },
                  { label: 'Type' },
                  { label: 'Status' },
                  { label: '' },
                ].map(({ label, icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {label}
                    {icon && <span className="opacity-50">{icon}</span>}
                  </div>
                ))}
              </div>
              <div>
                {payments.map((p, i) => (
                  <PaymentRow key={`${p.id}-${i}`} payment={p} index={i} />
                ))}
                {isFetchingNextPage &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1.5fr_1.2fr_1.2fr_1fr_1fr_0.8fr_auto] px-5 py-4 border-b border-border/50 items-center gap-4"
                    >
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  ))}
                <div ref={sentinelRef} className="h-10" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentRow({ payment, index }: { payment: PaymentAdmin; index: number }) {
  const statusCfg = STATUS_CONFIG[payment.status] ?? {
    label: payment.status,
    variant: 'secondary' as BadgeVariant,
  };
  const billCfg = BILL_TYPE_CONFIG[payment.billType] ?? {
    label: payment.billType,
    variant: 'secondary' as BadgeVariant,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.4) }}
      className="group grid grid-cols-[1.5fr_1.2fr_1.2fr_1fr_1fr_0.8fr_0.8fr_auto] px-5 py-3.5 border-b border-border/50 text-sm items-center hover:bg-muted/40 transition-colors duration-150"
    >
      <div className="flex flex-col gap-0.5">
        {payment.billType === BILL_TYPE.BOOKING && (
          <Link
            to={`/admin/bookings/${payment.id}`}
            className="font-mono text-xs font-semibold text-primary hover:underline underline-offset-2 truncate max-w-[160px]"
            title={payment.refId}
          >
            {payment.transactionId}
          </Link>
        )}
        <span className="text-[11px] text-muted-foreground">
          {dayjs(payment.createdAt).format('MMM D, YYYY · h:mm A')}
        </span>
      </div>
      <div>
        <span className="font-medium text-foreground">{payment.title}</span>
      </div>

      <div>
        <Link
          to={`/admin/users/${payment.user.id}`}
          className="text-foreground font-medium hover:text-primary hover:underline underline-offset-2 transition-colors text-sm"
        >
          {payment.user.name}
        </Link>
      </div>
      <div>
        <Link
          to={`/admin/workers/${payment.worker.id}`}
          className="text-foreground font-medium hover:text-primary hover:underline underline-offset-2 transition-colors text-sm"
        >
          {payment.worker.name}
        </Link>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-foreground">
          ₹{payment.amount.toLocaleString('en-IN')}
        </span>
        {payment.platformFee !== null && payment.platformFee !== undefined && (
          <span className="text-[11px] text-muted-foreground">Fee: ₹{payment.platformFee}</span>
        )}
      </div>
      <div>
        <Badge variant={billCfg.variant}>{billCfg.label}</Badge>
      </div>
      <div>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </div>
      <div className="flex justify-end h-8 w-8">
        {payment.billType === BILL_TYPE.BOOKING && (
          <Link
            to={`/admin/bookings/${payment.refId}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted transition-all duration-150 group-hover:opacity-100 opacity-60"
            title="View booking"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
