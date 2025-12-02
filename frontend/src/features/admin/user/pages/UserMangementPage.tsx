import PageHeader from '@/components/molecules/PageHeader';
import { useEffect, useState } from 'react';
import { useUserData, type ApiUser } from '../hooks/useUserData';
import type { Column } from '@/components/organisms/Table';
import Button from '@/components/atoms/Button';
import { Eye, Filter, MoreVertical, Search } from 'lucide-react';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Table from '@/components/organisms/Table';

function UserMangementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, loading, error, fetchUsers } = useUserData();

  useEffect(() => {
    fetchUsers({
      page: currentPage,
      search: searchInput,
      status: statusFilter,
      limit: 5,
    });
  }, [currentPage, searchInput, statusFilter, fetchUsers]);

  const coloums: Column<ApiUser>[] = [
    {
      key: 'id',
      label: '#',
      width: '50px',
      render: (_, row: ApiUser) => (
        <span className="text-muted-foreground">
          {data?.users.indexOf(row) ? data.users.indexOf(row) + 1 : 1}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'User',
      width: '200px',
      render: (_: string, row: ApiUser) => (
        <div className="flex items-center gap-3">
          <img src={row.profileImage} alt={row.name} className="w-10 h-10 rounded-full" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => <span className="text-muted-foreground text-sm">{value}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: number) => (
        <span className="text-muted-foreground text-sm">{value || '-'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => (
        <span className="text-muted-foreground text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => {
        return <span className={`text-xs font-medium px-2.5 py-1 rounded-full`}>{value}</span>;
      },
    },
    {
      key: 'isBlocked',
      label: 'Status',
      render: (value: boolean) => {
        return (
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full`}>
            {value ? 'Blocked' : 'Active'}
          </span>
        );
      },
    },
    {
      key: 'id',
      label: 'Action',
      render: () => (
        <div className="flex items-center gap-2">
          <Button
            variant="blue"
            className="text-xs py-1 px-3"
            iconLeft={<Eye className="w-3 h-3" />}
          >
            View
          </Button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="User Management" description="Manage your platform users" />
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <Select
              value={statusFilter}
              onChange={v => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
              placeholder="All Status"
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'blocked' },
              ]}
              leftIcon={<Filter className="w-4 h-4" />}
            />
          </div>
        </div>

        <Table
          columns={coloums}
          data={data?.users || []}
          isLoading={loading}
          error={error}
          pagination={{
            currentPage: data?.currentPage || currentPage,
            totalItems: data?.totalCount || 0,
            totalPages: data?.totalPages || 1,
            itemsPerPage: data?.itemsPerPage || 5,
            onPageChange: setCurrentPage,
          }}
          onRowClick={row => {
            console.log('userclikc', row);
          }}
          emptyMessage="No User Found"
        />
      </div>
    </div>
  );
}

export default UserMangementPage;
