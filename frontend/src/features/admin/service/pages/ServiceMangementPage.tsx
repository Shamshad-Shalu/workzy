import Select from '@/components/atoms/Select';
import Table from '@/components/data-table/Table';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import AdminService from '@/services/admin/serviceManagement.service';
import type { ServiceDTO, ServiceResponse, ServiceRow } from '@/types/admin/service';
import { useQuery } from '@tanstack/react-query';
import { Filter, Layers } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import serviceColumns from '../components/columns';
import { AppModal } from '@/components/molecules/AppModal';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import Button from '@/components/atoms/Button';
import { ServiceModal } from '../components/ServiceModal';
import { useServiceMutations } from '../hooks/useServiceMutations';
import AppBreadcrumb from '@/components/molecules/AppBreadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';

type ServiceCrumb = { id: string; name: string };
type CustomParams = { parentId: string | null };

export default function ServiceManagementPage() {
  const [selectedService, setSelectedService] = useState<ServiceRow | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [parentVal, setParentVal] = useState<ServiceRow | null>(null);
  const [editingService, setEditingService] = useState<ServiceRow | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const path = (location.state?.path as ServiceCrumb[]) || [];

  const { pageIndex, pageSize, search, status, parentId, updateParams } =
    useUrlFilterParams<CustomParams>([{ key: 'parentId' }]);

  const { addServiceMutation, updateServiceMutation, toggleStatusMutation } = useServiceMutations();

  const { data, isLoading } = useQuery<ServiceResponse, Error>({
    queryKey: ['admin-services', pageIndex, pageSize, search, status, parentId],
    queryFn: () => AdminService.getServices(pageIndex + 1, pageSize, search, status, parentId),
    placeholderData: prev => prev,
  });

  const breadcrumbItems = [
    {
      label: 'Services',
      href: '/admin/services',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/admin/services', { state: { path: [] } });
      },
    },
  ];

  if (path && Array.isArray(path)) {
    path.forEach((crumb, index) => {
      breadcrumbItems.push({
        label: crumb.name,
        href: '#',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          const newPath = path.slice(0, index + 1);
          navigate(`?parentId=${crumb.id}&page=1`, { state: { path: newPath } });
        },
      });
    });
  }

  const openStatusModal = (service: ServiceRow) => {
    setSelectedService(service);
    setStatusModalOpen(true);
  };

  const handleSearchChange = useCallback(
    (v: string) => {
      updateParams({ search: v, page: 0, parentId });
    },
    [parentId]
  );

  const onEdit = (service: ServiceRow) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  const onViewChild = (service: ServiceRow) => {
    setParentVal(service);
    const newPath = [...path, { id: service._id, name: service.name }];
    navigate(`?parentId=${service._id}&page=1`, {
      state: { path: newPath },
    });
  };
  useEffect(() => {
    if (!parentId) {
      setParentVal(null);
    }
  }, [parentId]);

  const handleServiceSubmit = async (serviceData: ServiceDTO) => {
    if (editingService) {
      if (typeof serviceData.iconUrl === 'string') {
        serviceData.iconUrl = null;
      }
      if (typeof serviceData.imageUrl === 'string') {
        serviceData.imageUrl = null;
      }

      await updateServiceMutation.mutateAsync({
        id: editingService._id,
        data: serviceData,
      });
    } else {
      await addServiceMutation.mutateAsync(serviceData);
    }
  };

  const handleCloseServiceModal = () => {
    setServiceModalOpen(false);
    setEditingService(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Service Management" />
        <Button
          variant="blue"
          size="lg"
          onClick={() => setServiceModalOpen(true)}
          iconLeft={<Layers />}
        >
          Add Service
        </Button>
      </div>
      <div className="mb-4">
        <AppBreadcrumb items={breadcrumbItems} />
      </div>
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
          toggleStatusMutation.mutate(selectedService?._id, {
            onSuccess: () => setStatusModalOpen(false),
          });
        }}
        className="sm:mx-1"
      >
        <span className="block mb-2">
          Are you sure you want to {selectedService?.isAvailable ? 'Block' : 'Unblok'}{' '}
          <b>{selectedService?.name}</b>
        </span>
      </AppModal>

      <ServiceModal
        open={serviceModalOpen}
        onClose={handleCloseServiceModal}
        onSubmit={handleServiceSubmit}
        parentServices={parentVal}
        service={editingService}
      />
    </div>
  );
}
