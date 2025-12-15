import Select from '@/components/atoms/Select';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { Filter } from 'lucide-react';
import { useCallback } from 'react';

export default function WorkerManagementPage() {
  const { search, status, updateParams } = useUrlFilterParams();

  const handleSearchChange = useCallback((v: string) => {
    updateParams({ search: v, page: 0 });
  }, []);

  return (
    <div className="bg-baground py-6 px-0 xl:p-6">
      <PageHeader title="Worker Management" description="Manage your platform Workers" />
      <div className="bg-card border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <SearchInput
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:col-span-5">
            <Select
              value={status}
              onChange={v => updateParams({ status: v, page: 0 })}
              leftIcon={<Filter />}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'blocked' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
