import Select from '@/components/atoms/Select';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import { Filter } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function ServiceManagementPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const handleSearchChange = useCallback((v: string) => {
    setPageIndex(0);
    setSearch(v);
  }, []);

  return (
    <div className="bg-baground py-6 px-0 xl:p-6">
      <PageHeader title="Service Management" description="Manage your platform Services" />
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
              onChange={v => {
                setPageIndex(0);
                setStatus(v);
              }}
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
