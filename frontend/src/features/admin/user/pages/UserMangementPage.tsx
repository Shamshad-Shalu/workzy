import { Filter } from 'lucide-react';
import { useCallback } from 'react';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { DataList } from '@/components/data-table/DataList';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import StatusChangeModal from '@/components/molecules/StatusChangeModal';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';

import userColumns from '../components/columns';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useToggleUserStatus } from '../hooks/useToggleUserStatus';

const CUSTOM_PARAMS = [{ key: 'role', defaultValue: 'all' }];
export default function UserManagementPage() {
  const { pageIndex, pageSize, search, status, updateParams, role } = useUrlFilterParams<{
    role: string;
  }>(CUSTOM_PARAMS);
  const { users, isLoading, error, isError, refetch, total } = useAdminUsers({
    page: pageIndex,
    limit: pageSize,
    search,
    status,
    role,
  });

  const {
    targetId,
    isModalOpen,
    openModal,
    closeModal,
    handleConfirm,
    isPending: isToggling,
  } = useToggleUserStatus();
  const selectedUser = users.find(u => u.id === targetId) ?? null;
  const handleSearchChange = useCallback(
    (v: string) => updateParams({ search: v, pageIndex: 0 }),
    [updateParams]
  );

  const isHideButton = search !== '' || status !== 'all' || role !== 'all';
  const clearAllFilters = useCallback(() => {
    updateParams({
      search: '',
      status: 'all',
      role: 'all',
      pageIndex: 0,
    });
  }, [updateParams]);

  return (
    <main className="p-4 lg:p-6">
      <PageHeader title="User Management" description="Manage your platform users" />
      <div className="bg-card border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <SearchInput
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={status}
              onChange={v => updateParams({ status: v, pageIndex: 0 })}
              leftIcon={<Filter />}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'blocked' },
              ]}
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={role}
              onChange={v => updateParams({ role: v, pageIndex: 0 })}
              leftIcon={<Filter />}
              options={[
                { label: 'All Role', value: 'all' },
                { label: 'User', value: 'user' },
                { label: 'Worker', value: 'worker' },
              ]}
            />
          </div>
        </div>
      </div>
      <DataList
        data={users}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        mode="table"
        isLoading={isLoading}
        onPageChange={v => updateParams({ pageIndex: v })}
        onPageSizeChange={v => updateParams({ pageSize: v, pageIndex: 0 })}
        pageCount={Math.ceil(total / pageSize) || 1}
        columns={userColumns(u => openModal(u.id))}
        isError={isError}
        errorState={<ErrorState onRetry={() => refetch()} description={error?.message} />}
        emptyState={
          <EmptyState
            title="No users found"
            description={
              isHideButton ? 'Try adjusting your filters or search' : 'No users available yet'
            }
            action={
              isHideButton ? (
                <Button onClick={clearAllFilters} variant="red" size="sm">
                  Clear Filters
                </Button>
              ) : null
            }
          />
        }
      />
      <StatusChangeModal
        open={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        fromStatus={selectedUser?.isBlocked ? 'Blocked' : 'Active'}
        toStatus={selectedUser?.isBlocked ? 'Active' : 'Blocked'}
        loading={isToggling}
        name={selectedUser?.name}
      />
    </main>
  );
}
