import { Filter } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import Select from '@/components/atoms/Select';
import { DataList } from '@/components/data-table/DataList';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import {
  BOOKING_PAYMENT_STATUS_VALUES,
  BOOKING_STATUS_VALUES,
  type BookingFilterStatus,
  type BookingPaymentStatus,
} from '@/constants';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import type { BookingCard } from '@/types/booking';
import { handleApiError } from '@/utils/handleApiError';

import { AdminBookingCard } from '../components/AdminBookingCard';
import { useAdminBookings } from '../hooks/useAdminBookings';

export default function AdminBookingPage() {
  const { pageIndex, pageSize, search, status, updateParams, paymentStatus } = useUrlFilterParams<{
    paymentStatus: string;
  }>([{ key: 'paymentStatus', defaultValue: 'all' }]);

  const { data, isLoading, isError, error } = useAdminBookings({
    status: status as BookingFilterStatus | 'all',
    paymentStatus: paymentStatus as BookingPaymentStatus | 'all',
    page: pageIndex + 1,
    limit: pageSize,
    search: search,
  });

  useEffect(() => {
    if (isError) {
      toast.error(handleApiError(error));
    }
  }, [isError, error]);

  const handleSearchChange = useCallback(
    (v: string) => {
      updateParams({ search: v, page: 0 });
    },
    [updateParams]
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Booking Management"
          description="Track, monitor and manage all service bookings across the platform"
        />
      </div>
      <div className="bg-card border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <SearchInput
              disabled={isError}
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:col-span-4">
            <Select
              value={status}
              onChange={v => updateParams({ status: v, page: 0 })}
              leftIcon={<Filter />}
              disabled={isError}
              options={[
                { label: 'All Status', value: 'all' },
                ...BOOKING_STATUS_VALUES.map(val => ({
                  label: val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                  value: val,
                })),
              ]}
            />
          </div>
          <div className="sm:col-span-4">
            <Select
              value={status}
              onChange={v => updateParams({ status: v, page: 0 })}
              leftIcon={<Filter />}
              disabled={isError}
              options={[
                { label: 'All Status', value: 'all' },
                ...BOOKING_PAYMENT_STATUS_VALUES.map(val => ({
                  label: val.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                  value: val,
                })),
              ]}
            />
          </div>
        </div>
      </div>
      <section className="@container pt-12">
        <DataList<BookingCard>
          mode="card"
          data={data?.bookings ?? []}
          total={data?.total ?? 0}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={Math.ceil((data?.total ?? 0) / pageSize) || 1}
          onPageChange={p => updateParams({ page: p })}
          onPageSizeChange={s => updateParams({ pageSize: s, page: 0 })}
          isLoading={isLoading}
          emptyText="No Bookings found"
          gridClassName="grid gap-5 grid-cols-1 @[800px]:grid-cols-2 @[1220px]:grid-cols-3"
          renderCard={booking => (
            <AdminBookingCard
              booking={booking}
              // onView={id => router.push(`/admin/bookings/${id}`)}
              // onEvidence={b => setEvidenceTarget(b)}
              // onCancel={b => setCancelTarget(b)}
              // onDispute={b => setDisputeTarget(b)}
              // onApprove={b => setApproveTarget(b)}
              // onPayExtra={b => setExtraTarget(b)}
              // onReview={id => handleDownloadReceipt(id)}
            />
          )}
        />
      </section>
    </div>

    // <div className="space-y-8 pb-10">
    //   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    //     <PageHeader
    //       title="Booking Management"
    //       description="Track, monitor and manage all service bookings across the platform"
    //     />

    //     <div className="flex flex-col sm:flex-row items-center gap-3 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
    //       <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background rounded-xl shadow-sm border border-border/50">
    //         <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
    //         <span className="text-xs font-bold text-foreground">{(data?.total ?? 0).toLocaleString()} Total Bookings</span>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Filters Section */}
    //   <div className="bg-card border rounded-3xl p-6 shadow-sm border-border/60">
    //     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
    //       <div className="lg:col-span-5 space-y-2.5">
    //         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">
    //           Search Booking
    //         </label>
    //         <SearchInput
    //           value={search}
    //           onChange={v => updateParams({ search: v, pageIndex: 0 })}
    //           placeholder="Search by Booking ID (e.g. BK-12345)"
    //           className="h-12 rounded-2xl border-border/50"
    //         />
    //       </div>

    //       <div className="lg:col-span-3 space-y-2.5">
    //         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">
    //           Booking Status
    //         </label>
    //         <Select
    //           value={status}
    //           onChange={v => updateParams({ status: v, pageIndex: 0 })}
    //           leftIcon={<Filter className="w-4 h-4 text-primary" />}
    //           options={[
    //             { label: 'All Statuses', value: 'all' },
    //             { label: 'Pending', value: 'pending' },
    //             { label: 'Confirmed', value: 'confirmed' },
    //             { label: 'In Progress', value: 'in_progress' },
    //             { label: 'Completed', value: 'completed' },
    //             { label: 'Approved', value: 'approved' },
    //             { label: 'Cancelled', value: 'cancelled' },
    //             { label: 'Rejected', value: 'rejected' },
    //             { label: 'Disputed', value: 'disputed' },
    //           ]}
    //           customClass="h-12 rounded-2xl border-border/50 bg-background"
    //         />
    //       </div>

    //       <div className="lg:col-span-3 space-y-2.5">
    //         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">
    //           Payment Status
    //         </label>
    //         <Select
    //           value={paymentStatus}
    //           onChange={v => updateParams({ paymentStatus: v, pageIndex: 0 })}
    //           leftIcon={<CreditCard className="w-4 h-4 text-primary" />}
    //           options={[
    //             { label: 'All Payments', value: 'all' },
    //             { label: 'Pending', value: 'pending' },
    //             { label: 'Held', value: 'held' },
    //             { label: 'Released', value: 'released' },
    //             { label: 'Refunded', value: 'refunded' },
    //             { label: 'Cancelled', value: 'cancelled' },
    //             { label: 'Failed', value: 'failed' },
    //           ]}
    //           customClass="h-12 rounded-2xl border-border/50 bg-background"
    //         />
    //       </div>

    //       <div className="lg:col-span-1">
    //          <button
    //            onClick={() => updateParams({ status: 'all', paymentStatus: 'all', search: '', pageIndex: 0 })}
    //            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground transition-colors border border-border/50"
    //            title="Reset Filters"
    //          >
    //            <Filter className="w-4 h-4 rotate-180" />
    //          </button>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="space-y-4">
    //     {isLoading ? (
    //       <div className="space-y-4">
    //         {[...Array(5)].map((_, i) => (
    //           <div key={i} className="h-32 w-full bg-muted/40 animate-pulse rounded-2xl border border-border/50" />
    //         ))}
    //       </div>
    //     ) : isError ? (
    //        <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-12 text-center">
    //          <p className="text-destructive font-semibold">Failed to load bookings</p>
    //          <p className="text-sm text-destructive/70 mt-1">{handleApiError(error)}</p>
    //        </div>
    //     ) : data?.bookings.length === 0 ? (
    //       <EmptyState
    //         title="No bookings found"
    //         description={search ? `No bookings match your search "${search}"` : "Try adjusting your filters to find what you're looking for."}
    //         icon={<Search className="w-12 h-12 text-muted-foreground/40" />}
    //         className="bg-card border-dashed border-2 rounded-3xl py-20"
    //       />
    //     ) : (
    //       <>
    //         <div className="grid grid-cols-1 gap-4">
    //           {data?.bookings.map((booking) => (
    //             <AdminBookingCard key={booking.id} booking={booking} />
    //           ))}
    //         </div>

    //         <div className="mt-10 pt-6 border-t border-border/40">
    //           <Pagination
    //             pageIndex={pageIndex}
    //             pageCount={totalPages}
    //             onPageChange={(p) => updateParams({ pageIndex: p })}
    //           />
    //         </div>
    //       </>
    //     )}
    //   </div>
    // </div>
  );
}
