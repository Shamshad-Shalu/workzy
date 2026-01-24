import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import { Filter, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useServiceMutations } from '../hooks/useServiceMutations';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import WorkerServiceCard from '../components/WorkerServiceCard';
import { DataList } from '@/components/data-table/DataList';
import type { Service } from '@/types/service';

type SelectOption = {
  label: string;
  value: string;
};

export default function WorkerServicesPageDummy() {
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  const filters = useUrlFilterParams<{ categoryId: string | null }>([{ key: 'categoryId' }]);

  const { pageIndex, pageSize, search, status, categoryId } = filters;
  const { updateParams } = filters;

  const { user } = useAppSelector((s: RootState) => s.auth);

  const workerId = user?.workerId;
  const navigate = useNavigate();
  const { data, categoriesList, error, isError, isLoading } = useServiceMutations(
    workerId!,
    filters
  );

  console.log({ data, categoriesList, error, isError, isLoading });

  const handleSearchChange = useCallback(
    (v: string) => {
      updateParams({ search: v, page: 0, categoryId });
    },
    [categoryId, updateParams]
  );

  const categoriesOptions: SelectOption[] = categoriesList.map(category => ({
    label: category.name,
    value: category.id,
  }));

  console.log({ data });

  return (
    <main>
      <div className="flex items-center justify-between">
        <PageHeader
          title="My Services"
          description="Manage your service offerings and availability"
        />
        <Button
          variant="blue"
          disabled={isError}
          size="responsiveLg"
          onClick={() => setServiceModalOpen(true)}
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
              onChange={v => updateParams({ status: v, page: 0 })}
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
              onChange={v => updateParams({ categoryId: v === 'all' ? null : v, page: 0 })}
              leftIcon={<Filter />}
              disabled={isError}
              options={[{ label: 'All Status', value: 'all' }, ...categoriesOptions]}
            />
          </div>
        </div>
      </div>
      <section className="@container pt-12">
        <DataList<Service>
          mode="card"
          data={data?.services ?? []}
          total={data?.total ?? 0}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={Math.ceil((data?.total ?? 0) / pageSize) || 1}
          onPageChange={p => updateParams({ page: p })}
          onPageSizeChange={s => updateParams({ pageSize: s, page: 0 })}
          isLoading={isLoading}
          emptyText="No services found"
          gridClassName="grid gap-5 grid-cols-1 @[480px]:grid-cols-2 @[800px]:grid-cols-3 @[1220px]:grid-cols-4"
          renderCard={service => <WorkerServiceCard service={service} key={service.id} />}
        />
      </section>
    </main>
  );
}
