import Select from '@/components/atoms/Select';
import Table from '@/components/data-table/Table';
import PageHeader from '@/components/molecules/PageHeader';
import type { UserResponse, UserRow } from '@/types/admin/user';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import userColumns from '../components/columns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminUserService from '@/services/admin/userManagement.service';
import { AppModal } from '@/components/molecules/AppModal';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';
import SearchInput from '@/components/molecules/SearchInput';

export default function UserManagementPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UserResponse, Error>({
    queryKey: ['admin-users', pageIndex, pageSize, search, status],
    queryFn: () => AdminUserService.getUsers(pageIndex + 1, pageSize, search, status),
    placeholderData: prev => prev,
  });

  const toggleStatusMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: id => AdminUserService.toggleStatus(id),
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setModalOpen(false);
    },
    onError: error => {
      toast.error(handleApiError(error));
    },
  });

  const openStatusModal = (user: UserRow) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const openView = (id: string) => {
    console.log('open User view,', id);
  };

  return (
    <div className="bg-baground py-6 px-0 xl:p-6">
      <PageHeader title="User Management" description="Manage your platform users" />
      <div className="bg-card border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <SearchInput
              placeholder="Search by name or email..."
              value={search}
              onChange={v => {
                setPageIndex(0);
                setSearch(v);
              }}
              leftIcon={<Search />}
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
      <Table
        columns={userColumns(openStatusModal, openView)}
        data={data?.users ?? []}
        total={data?.total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={Math.ceil((data?.total ?? 0) / pageSize) || 1}
        manual={{
          serverSidePagination: true,
        }}
        isLoading={isLoading}
        onPageChange={p => setPageIndex(p)}
        onPageSizeChange={s => {
          setPageSize(s);
          setPageIndex(0);
        }}
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isTitleHidden={true}
        confirmText={selectedUser?.isBlocked ? 'Unblock' : 'Block'}
        onConfirm={() => {
          if (!selectedUser?._id) {
            return;
          }
          toggleStatusMutation.mutate(selectedUser?._id);
        }}
        className="sm:mx-1"
      >
        <span className="block mb-2">
          Are you sure you want to {selectedUser?.isBlocked ? 'Unblok' : 'Block'}{' '}
          <b>{selectedUser?.name}</b>
        </span>
      </AppModal>
    </div>
  );
}
