import dayjs from 'dayjs';
import { CreditCard, Filter } from 'lucide-react';
import { useCallback, useState } from 'react';

import Button from '@/components/atoms/Button';
import { DatePicker } from '@/components/atoms/Datepicker';
import Select from '@/components/atoms/Select';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import {
  BOOKING_PAYMENT_STATUS_VALUES,
  BOOKING_STATUS_VALUES,
  ROLE,
  type BookingFilterStatus,
  type BookingPaymentStatus,
} from '@/constants';
import { BookingList } from '@/features/booking/components/BookingList';
import DisputeModal from '@/features/dispute/components/DisputeModal';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { cn } from '@/lib/utils';

import AdminReviewModal from '../components/AdminReviewModal';
import { useAdminBookingHandler, useAdminBookings } from '../hooks/useAdminBooking';

const CUSTOM_PARAMS = [
  { key: 'paymentStatus', defaultValue: 'all' },
  { key: 'fromDate', parser: (v: string) => (v ? dayjs(v).toDate() : null) },
  { key: 'toDate', parser: (v: string) => (v ? dayjs(v).toDate() : null) },
];

const formatDateForUrl = (date?: Date | null): string | null => {
  if (!date) {
    return null;
  }
  return dayjs(date).format('YYYY-MM-DD');
};

export default function AdminBookingsPage() {
  const [disputeBId, setDisputeBId] = useState<string | null>(null);
  const { search, status, updateParams, paymentStatus, fromDate, toDate } = useUrlFilterParams<{
    paymentStatus: string;
    fromDate: Date | null;
    toDate: Date | null;
  }>(CUSTOM_PARAMS);

  const { review } = useAdminBookingHandler();
  const { handleToggleReview, isTogglingReview, reviewData, setReviewData } = review;

  const handleSearchChange = useCallback(
    (v: string) => updateParams({ search: v }),
    [updateParams]
  );

  const clearAllFilters = useCallback(() => {
    updateParams({
      search: '',
      status: 'all',
      paymentStatus: 'all',
      fromDate: null,
      toDate: null,
    });
  }, [updateParams]);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminBookings({
      status: status as BookingFilterStatus,
      paymentStatus: paymentStatus as BookingPaymentStatus | 'all',
      search,
      fromDate: fromDate ? dayjs(fromDate).startOf('day').format('YYYY-MM-DD') : undefined,
      toDate: toDate ? dayjs(toDate).endOf('day').format('YYYY-MM-DD') : undefined,
    });

  const bookings = data?.pages.flatMap(p => p.bookings) ?? [];

  const isHideButton = fromDate || toDate || status !== 'all' || paymentStatus !== 'all' || search;
  return (
    <div className="py-6 space-y-6">
      <PageHeader title="All Bookings" description="Platform-wide booking management" />
      <div className="bg-card border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className={cn('sm:col-span-4', isHideButton ? 'sm:col-span-3' : '')}>
            <SearchInput
              disabled={isError}
              placeholder="Search by booking ID or name..."
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
                ...BOOKING_STATUS_VALUES.map(val => ({
                  label: val.charAt(0).toUpperCase() + val.slice(1),
                  value: val,
                })),
              ]}
            />
          </div>
          <div className="sm:col-span-2">
            <Select
              value={paymentStatus}
              onChange={v => updateParams({ paymentStatus: v })}
              leftIcon={<CreditCard className="w-4 h-4 text-primary" />}
              options={[
                { label: 'All Payments', value: 'all' },
                ...BOOKING_PAYMENT_STATUS_VALUES.map(val => ({
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
      <BookingList
        bookings={bookings}
        isLoading={isLoading}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        refetch={refetch}
        role={ROLE.ADMIN}
        detailBasePath="/admin/bookings"
        onReview={data => review.setReviewData({ id: data.id, reviewId: data.reviewId })}
      />
      {reviewData?.reviewId && (
        <AdminReviewModal
          onClose={() => setReviewData(null)}
          onToggleVisibility={handleToggleReview}
          isToggling={isTogglingReview}
          open={!!reviewData}
          reviewId={reviewData?.reviewId}
        />
      )}
      <DisputeModal
        open={!!disputeBId}
        role={ROLE.ADMIN}
        onClose={() => setDisputeBId(null)}
        bookingId={disputeBId}
      />
    </div>
  );
}
