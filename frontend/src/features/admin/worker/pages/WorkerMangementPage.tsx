import Select from '@/components/atoms/Select';
import Table from '@/components/data-table/Table';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { Filter } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { WorkerResponse, WorkerRow } from '@/types/admin/worker';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminWorkerService from '@/services/admin/workerManagement.service';
import { useToggleStatus } from '../../hooks/useUserToggleStatus';
import { AppModal } from '@/components/molecules/AppModal';
import workerColumns from '../components/columns';
import ReviewWorkerModal from '../components/ReviewWorkerModal';
import { useVerifyWorker } from '../hooks/useWorkerMutations';
import type { ReviewWorkerSchemaType } from '../validation/reviewWorkerShema';

type CustomParams = { workerStatus: string };

export default function WorkerManagementPage() {
  const [selectedWorker, setSelectedWorker] = useState<WorkerRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const { pageIndex, pageSize, search, status, workerStatus, updateParams } =
    useUrlFilterParams<CustomParams>([{ key: 'workerStatus' }]);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<WorkerResponse, Error>({
    queryKey: ['admin-workers', pageIndex, pageSize, search, status, workerStatus],
    queryFn: () =>
      AdminWorkerService.getWorkers(pageIndex + 1, pageSize, search, status, workerStatus),
    placeholderData: prev => prev,
  });

  const toggleStatusMutation = useToggleStatus(() => setModalOpen(false));
  const verifyWorkerMutation = useVerifyWorker(() => setVerifyModalOpen(false));

  const handleSearchChange = useCallback((v: string) => {
    updateParams({ search: v, page: 0 });
  }, []);

  const openStatusModal = (worker: WorkerRow) => {
    setSelectedWorker(worker);
    setModalOpen(true);
  };
  const openView = (id: string) => {
    navigate(id);
    console.log('open worker view,', id);
  };
  const openVerifyView = (worker: WorkerRow) => {
    setSelectedWorker(worker);
    setVerifyModalOpen(true);
  };

  const handleSubmitReview = async (data: ReviewWorkerSchemaType) => {
    if (!selectedWorker?._id) {
      return;
    }
    verifyWorkerMutation.mutate({ id: selectedWorker._id, data });
  };

  return (
    <div>
      <PageHeader title="Worker Management" description="Manage your platform Workers" />
      <div className="bg-card border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <SearchInput
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:col-span-3">
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
          <div className="sm:col-span-4">
            <Select
              value={workerStatus}
              onChange={v => updateParams({ workerStatus: v, page: 0 })}
              leftIcon={<Filter />}
              options={[
                { label: 'All Worker Status', value: 'all' },
                { label: 'Pending', value: 'pending' },
                { label: 'Verified', value: 'verified' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Needs Revision', value: 'needs_revision' },
              ]}
            />
          </div>
        </div>
      </div>
      <Table
        columns={workerColumns(openStatusModal, openView, openVerifyView)}
        data={data?.workers ?? []}
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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isTitleHidden={true}
        confirmText={selectedWorker?.isBlocked ? 'Unblock' : 'Block'}
        onConfirm={() => {
          if (!selectedWorker?._id) {
            return;
          }
          toggleStatusMutation.mutate(selectedWorker?.userId);
        }}
        className="sm:mx-1"
      >
        <span className="block mb-2">
          Are you sure you want to {selectedWorker?.isBlocked ? 'Unblok' : 'Block'}{' '}
          <b>{selectedWorker?.name}</b>
        </span>
      </AppModal>
      <ReviewWorkerModal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        onSubmit={handleSubmitReview}
        selectedWorker={selectedWorker}
      />
    </div>
  );
}
