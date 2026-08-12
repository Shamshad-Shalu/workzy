import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { DataList } from '@/components/data-table/DataList';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/molecules/PageHeader';
import { ROLE } from '@/constants';
import { getPaymentColumns } from '@/features/payments';
import { PaymentFilterBar } from '@/features/payments';
import { usePaymentFilterParams } from '@/features/payments';
import { useAdminPayments } from '@/features/payments';

export default function AdminPaymentsPage() {
  const {
    search,
    status,
    billType,
    fromDate,
    toDate,
    fromDateString,
    toDateString,
    hasActiveFilters,
    handleSearchChange,
    handleStatusChange,
    handleBillTypeChange,
    handleFromDateChange,
    handleToDateChange,
    clearAllFilters,
  } = usePaymentFilterParams();

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminPayments({
      status,
      billType,
      search,
      fromDate: fromDateString,
      toDate: toDateString,
    });

  const payments = data?.pages.flatMap(p => p.payments) ?? [];

  return (
    <main className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <PageHeader title="Payments" description="Platform-wide transaction management" />
      </motion.div>

      <PaymentFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        billType={billType}
        onBillTypeChange={handleBillTypeChange}
        fromDate={fromDate}
        onFromDateChange={handleFromDateChange}
        toDate={toDate}
        onToDateChange={handleToDateChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearAllFilters}
        disabled={isError}
      />

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
                hasActiveFilters ? (
                  <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-4">
                    Clear filters
                  </Button>
                ) : null
              }
            />
          }
          columns={getPaymentColumns(ROLE.ADMIN)}
          mode="table"
          paginationType="cursor"
          hasNextPage={!!hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </main>
  );
}
