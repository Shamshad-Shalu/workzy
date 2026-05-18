import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { CreditCard, Filter } from 'lucide-react';
import { useCallback } from 'react';

import Button from '@/components/atoms/Button';
import { DatePicker } from '@/components/atoms/Datepicker';
import Select from '@/components/atoms/Select';
import { DataList } from '@/components/data-table/DataList';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import { BILL_TYPE, PAYMENT_STATUS, type BillType, type PaymentStatus } from '@/constants/payment';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { cn } from '@/lib/utils';

import paymentColumns from '../components/paymentColumns';
import { useAdminPayments } from '../hooks/useAdminPayments';

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
      <div className="mt-6">
        <DataList
          data={payments}
          isLoading={isLoading}
          isError={isError}
          errorState={
            <ErrorState
              title="Couldn't load payments"
              description="Something went wrong while fetching payment data."
              onRetry={refetch}
            />
          }
          emptyState={
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
          }
          columns={paymentColumns()}
          mode="table"
          paginationType="cursor"
          hasNextPage={!!hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
