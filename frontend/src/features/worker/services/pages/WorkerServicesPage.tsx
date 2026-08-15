import { Filter, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import StatusChangeModal from '@/components/molecules/StatusChangeModal';
import WorkerServiceCard from '@/features/service/components/WorkerServiceCard';
import WorkerServiceGridSkeleton from '@/features/service/components/WorkerServiceCardSkeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import type { Service } from '@/types/service';

import { WorkerServiceModal } from '../components/WorkerServiceModal';
import {
  useAddService,
  useToggleServiceStatus,
  useUpdateService,
  useWorkerServiceCategories,
  useWorkerServices,
} from '../hooks/useServiceHooks';

import type { ServiceFormType } from '../validation/ServiceFormData';

type SelectOption = { label: string; value: string };

export default function WorkerServicesPage() {
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [statusService, setStatusService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { categoryId, pageSize, search, status, updateParams } = useUrlFilterParams<{
    categoryId: string | null;
  }>([{ key: 'categoryId' }]);

  const {
    data,
    isError,
    error,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorkerServices({ categoryId, limit: pageSize, search, status });

  const { categories, isLoading: categoriesLoading } = useWorkerServiceCategories();
  const { addService } = useAddService();
  const { updateService } = useUpdateService();
  const { toggleServiceStatus, isTogglingStatus } = useToggleServiceStatus();

  const services = data?.pages.flatMap(p => p.services) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const isHideButton = search !== '' || status !== 'all';
  const clearAllFilters = useCallback(() => {
    updateParams({
      search: '',
      status: 'all',
    });
  }, [updateParams]);

  const handleSearchChange = useCallback(
    (v: string) => {
      updateParams({ search: v, page: 0, categoryId });
    },
    [categoryId, updateParams]
  );

  const categoriesOptions: SelectOption[] = categories.map(category => ({
    label: category.name,
    value: category.id,
  }));

  const handleSumbit = async (serviceData: ServiceFormType) => {
    if (editingService) {
      await updateService({ id: editingService.id, data: serviceData });
    } else {
      await addService(serviceData);
    }
    setEditingService(null);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };
  const handleToggleStatus = async () => {
    if (!statusService?.id) {
      return;
    }
    const res = await toggleServiceStatus(statusService.id);
    if (res.message) {
      setStatusService(null);
    }
  };

  return (
    <main className="p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="My Services"
          description="Manage your service offerings and availability"
        />
        <Button
          variant="blue"
          disabled={isError}
          size="responsiveLg"
          onClick={() => {
            setServiceModalOpen(true);
          }}
          iconLeft={<Plus />}
        >
          Add Service
        </Button>
      </div>
      <div className="bg-card  border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <SearchInput
              disabled={isError}
              placeholder="Search by name or description..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              placeholder="All Status"
              value={status}
              onChange={v => updateParams({ status: v })}
              leftIcon={<Filter />}
              disabled={isError}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'blocked' },
              ]}
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={categoryId ?? 'all'}
              onChange={v => updateParams({ categoryId: v === 'all' ? null : v })}
              leftIcon={<Filter />}
              disabled={categoriesLoading}
              options={[{ label: 'All Status', value: 'all' }, ...categoriesOptions]}
            />
          </div>
        </div>
      </div>
      <section className="@container pt-12">
        {isLoading ? (
          <WorkerServiceGridSkeleton />
        ) : isError ? (
          <ErrorState onRetry={refetch} description={error.message} />
        ) : services.length === 0 ? (
          <EmptyState
            title="No Services found"
            description={
              isHideButton ? 'Try adjusting your filters or search' : 'No Service available yet'
            }
            action={
              isHideButton ? (
                <Button onClick={clearAllFilters} variant="red" size="sm">
                  Clear Filters
                </Button>
              ) : null
            }
          />
        ) : (
          <>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map(service => (
                <WorkerServiceCard
                  key={service.id}
                  service={service}
                  mode="worker"
                  onEdit={openEditModal}
                  onToggleStatus={setStatusService}
                />
              ))}
            </div>
            <div ref={sentinelRef} className="h-20" />
            {isFetchingNextPage && <WorkerServiceGridSkeleton count={6} />}
          </>
        )}
      </section>
      <StatusChangeModal
        open={!!statusService}
        onClose={() => setStatusService(null)}
        fromStatus={statusService?.isAvailable ? 'Unblock' : 'Block'}
        toStatus={statusService?.isAvailable ? 'Block' : 'Unblock'}
        loading={isTogglingStatus}
        onConfirm={handleToggleStatus}
      />
      <WorkerServiceModal
        key={editingService?.id ?? 'add'}
        open={serviceModalOpen}
        onClose={() => {
          setServiceModalOpen(false);
          setEditingService(null);
        }}
        service={editingService}
        onSubmit={handleSumbit}
      />
    </main>
  );
}
