import Select from '@/components/atoms/Select';
import Table from '@/components/data-table/Table';
import PageHeader from '@/components/molecules/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { AlertCircle, Briefcase, Filter } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { WorkerResponse, WorkerRow } from '@/types/admin/worker';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminWorkerService from '@/services/admin/workerManagement.service';
import { useToggleStatus } from '../../hooks/useUserToggleStatus';
import { AppModal } from '@/components/molecules/AppModal';
import workerColumns from '../components/columns';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { ImageUpload } from '@/components/atoms/ImageUpload';

type CustomParams = { workerStatus: string };

export default function WorkerManagementPage() {
  const [selectedWorker, setSelectedWorker] = useState<WorkerRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const [docName, setDocName] = useState('');
  const [workerStatuss, setWorkerStatuss] = useState<string>('pending');
  const [adminNote, setAdminNote] = useState('');

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

  const handleSubmitReview = async () => {
    const payload = {
      status: workerStatuss,
      adminNote: adminNote,
      documentName: docName,
    };
    if (!selectedWorker?._id) {
      return;
    }
    AdminWorkerService.verifyWorker(selectedWorker?._id, payload);
    console.log('Submit Review Payload:', payload);
  };

  return (
    <div className="bg-baground py-6 px-0 xl:p-6">
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

      <AppModal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        title="Review Worker Application"
        confirmText="Update Status"
        onConfirm={handleSubmitReview}
        className="sm:max-w-2xl"
      >
        <div className="w-full max-h-[70vh] overflow-y-auto space-y-6">
          <div className="bg-card grid grid-cols-2 gap-4 bg-card-50 p-4 rounded-xl border border-border">
            <div className="col-span-1">
              <Label>Professional Name</Label>
              <p className="font-medium text-sm text-primary">{selectedWorker?.displayName}</p>
            </div>
            <div className="col-span-1">
              <Label>Experience</Label>
              <p className="font-medium text-sm">{selectedWorker?.experience} Years</p>
            </div>
            <div className="col-span-2">
              <Label>About</Label>
              <p className="text-sm bg-card-muted p-2 rounded border mt-1">
                {selectedWorker?.about}
              </p>
            </div>
          </div>

          {/* 2. ID Proof Verification */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-600" /> ID Proof Verification
            </h4>

            {selectedWorker?.documents?.[0]?.url ? (
              <ImageUpload
                isEditable={false}
                value={selectedWorker.documents[0].url}
                className="w-full mt-2"
              />
            ) : (
              <div className="p-4 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200 text-center italic">
                No verification document uploaded by worker.
              </div>
            )}

            <div>
              <Label>Document Name / Label</Label>
              <Input
                placeholder="e.g. Identity Card, License"
                value={docName}
                onChange={e => setDocName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Action</Label>
                <Select
                  value={workerStatuss}
                  onChange={val => setWorkerStatuss(val as any)}
                  options={[
                    { label: 'Pending', value: 'pending' },
                    { label: 'Verified / Approve', value: 'verified' },
                    { label: 'Needs Revision', value: 'needs_revision' },
                    { label: 'Rejected', value: 'rejected' },
                  ]}
                />
              </div>

              <div>
                <Label>Note / Reason (Optional)</Label>
                <Input
                  placeholder="e.g. ID is blurry, Please re-upload"
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {workerStatus === 'needs_revision' && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle size={12} /> The worker will be notified to fix their details based on
                your note.
              </p>
            )}
          </div>
        </div>
      </AppModal>
    </div>
  );
}
