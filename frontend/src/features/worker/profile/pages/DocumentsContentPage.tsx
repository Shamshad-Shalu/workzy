import { FileText, Plus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import { MANDATORY_DOCUMENT_TYPES } from '@/features/admin/worker/utils/documentUtils';
import PageError from '@/pages/PageError';
import type { WorkerDocument } from '@/types/worker';

import { WorkerDocumentCard } from '../../components/WorkerDocumentCard';
import { WorkerDocumentSkeleton } from '../components/WorkerDocumentSkeleton';
import { WorkerDocumentUploadModal } from '../components/WorkerDocumentUploadModal';
import {
  useAddWorkerDocument,
  useUpdateWorkerDocument,
  useWorkerProfileDetails,
} from '../hooks/useWorkerProfile';

export default function WorkerDocumentsContentPage() {
  const [editDoc, setEditDoc] = useState<WorkerDocument | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const { data: worker, isLoading, isError, error } = useWorkerProfileDetails();

  const { mutateAsync: addDocument, isPending: isAdding } = useAddWorkerDocument();
  const { mutateAsync: updateDocument, isPending: isUpdating } = useUpdateWorkerDocument();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <WorkerDocumentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !worker) {
    return <PageError title={error?.message} />;
  }

  const documents = worker.documents || [];
  const mandatoryDocs = documents.filter(d => MANDATORY_DOCUMENT_TYPES.includes(d.type));
  const additionalDocs = documents.filter(d => !MANDATORY_DOCUMENT_TYPES.includes(d.type));

  const existingDocTypes = documents.map(d => d.type);
  const isSubmitting = isAdding || isUpdating;

  const handleDocumentSubmit = async (data: { type: string; url: string }) => {
    if (editDoc) {
      const res = await updateDocument({ documentId: editDoc.id, url: data.url });
      toast.success(res.message);
    } else {
      const res = await addDocument(data);
      toast.success(res.message);
    }
    setIsAddModalOpen(false);
    setEditDoc(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Identity Verification Documents</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Core identity documents are verified by the admin team during onboarding
        </p>
        {mandatoryDocs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mandatoryDocs.map(doc => (
              <WorkerDocumentCard
                key={doc.id}
                doc={doc}
                isMandatory={true}
                onUpdate={() => setEditDoc(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center text-xs text-muted-foreground">
            No mandatory identity documents uploaded yet.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Trade & Occupational Certifications
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Certificates required for offering specialized services (e.g. Electrical License,
              Police Clearance, HVAC Certificate).
            </p>
          </div>
          <Button
            variant="blue"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            iconLeft={<Plus size={14} />}
          >
            Add Trade Certificate
          </Button>
        </div>

        {additionalDocs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
            {additionalDocs.map(doc => (
              <WorkerDocumentCard key={doc.id} doc={doc} onUpdate={() => setEditDoc(doc)} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-3">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                No additional trade certificates uploaded
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload required category documents (e.g. Electrical License, Police Clearance) to
                publish specialized services.
              </p>
            </div>
            <Button
              variant="blue"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              iconLeft={<Plus size={14} />}
            >
              Add Trade Certificate
            </Button>
          </div>
        )}
      </div>

      {/* Upload/Update Modal */}
      {(isAddModalOpen || !!editDoc) && (
        <WorkerDocumentUploadModal
          open={isAddModalOpen || !!editDoc}
          editingDoc={editDoc}
          existingDocTypes={existingDocTypes}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditDoc(null);
          }}
          onSubmit={handleDocumentSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
