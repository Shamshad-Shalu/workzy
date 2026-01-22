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
import type { CategoryOption } from '@/types/category';
import { useNavigate } from 'react-router-dom';

type SelectOption = {
  label: string;
  value: string;
};

export default function WorkerServicesPageDummy() {
  const [serviceModalOpen, serServiceModalOpen] = useState(false);

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

  const handleCategoryNavigate = (categoryId: string) => {
    const category = categoriesList?.find(c => c.id === categoryId);
    if (!category) {return;}

    const newPath = [{ id: category.id, name: category.name }];

    navigate(`?category=${category.name}&page=1`, {
      state: { path: newPath },
    });
  };

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
          onClick={() => serServiceModalOpen(true)}
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
              value={''}
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
              value={status}
              onChange={handleCategoryNavigate}
              leftIcon={<Filter />}
              disabled={isError}
              options={[{ label: 'All Status', value: 'all' }, ...categoriesOptions]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
