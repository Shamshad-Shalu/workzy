import Select from '@/components/atoms/Select';
import Table from '@/components/data-table/Table';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import AdminService from '@/services/admin/serviceManagement.service';
import type { ServiceResponse, ServiceRow } from '@/types/admin/service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceColumns from '../components/columns';
import { AppModal } from '@/components/molecules/AppModal';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';

interface CustomParams {
  parentId: string | null;
}

export default function ServiceManagementPage() {
  const [selectedService, setSelectedService] = useState<ServiceRow | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { pageIndex, pageSize, search, status, parentId, updateParams } =
    useUrlFilterParams<CustomParams>([{ key: 'parentId' }]);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ServiceResponse, Error>({
    queryKey: ['admin-services', pageIndex, pageSize, search, status, parentId],
    queryFn: () => AdminService.getServices(pageIndex + 1, pageSize, search, status, parentId),
    placeholderData: prev => prev,
  });

  const openStatusModal = (service: ServiceRow) => {
    setSelectedService(service);
    setStatusModalOpen(true);
  };

  const handleSearchChange = useCallback((v: string) => {
    updateParams({ search: v, page: 0 });
  }, []);

  const onEdit = (service: ServiceRow) => {
    navigate(service._id);
    console.log('open service view,', service);
  };

  const queryClient = useQueryClient();

  const toggleStatusMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: id => AdminService.toggleStatus(id),
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setStatusModalOpen(false);
    },
    onError: error => {
      toast.error(handleApiError(error));
    },
  });

  const onViewChild = (service: ServiceRow) => {
    updateParams({
      parentId: service._id,
      search: null,
      status: 'all',
      page: 0,
    });
  };

  return (
    <div className="bg-baground py-6 px-0 xl:p-6">
      <PageHeader title="Service Management" />
      <div></div>
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
      <Table
        columns={serviceColumns(openStatusModal, onEdit, onViewChild)}
        data={data?.services ?? []}
        total={data?.total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={Math.ceil((data?.total ?? 0) / pageSize) || 1}
        manual={{
          serverSidePagination: true,
        }}
        isLoading={isLoading}
        onPageChange={p => updateParams({ page: p })}
        onPageSizeChange={s => updateParams({ pageSize: s, page: 0 })}
      />

      <AppModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        isTitleHidden={true}
        confirmText={selectedService?.isAvailable ? 'Block' : 'Unblock'}
        onConfirm={() => {
          if (!selectedService?._id) {
            return;
          }
          toggleStatusMutation.mutate(selectedService?._id);
        }}
        className="sm:mx-1"
      >
        <span className="block mb-2">
          Are you sure you want to {selectedService?.isAvailable ? 'Block' : 'Unblok'}{' '}
          <b>{selectedService?.name}</b>
        </span>
      </AppModal>
    </div>
  );
}
