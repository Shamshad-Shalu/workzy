import { AlertTriangle, CheckCircle2, Clock, ExternalLink, FileText, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { DOCUMENT_STATUS } from '@/constants';
import { WORKER_DOCUMENT_OPTIONS } from '@/features/admin/worker/utils/documentUtils';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category';
import type { WorkerDocument } from '@/types/worker';

interface CategoryDocumentChecklistProps {
  category?: Category | null;
  parentCategory?: Category | null;
  workerDocuments?: WorkerDocument[];
}

export function CategoryDocumentChecklist({
  category,
  parentCategory,
  workerDocuments = [],
}: CategoryDocumentChecklistProps) {
  const requiredDocTypes = Array.from(
    new Set([...(parentCategory?.requiredDocuments || []), ...(category?.requiredDocuments || [])])
  );

  if (requiredDocTypes.length === 0) {
    return (
      <div className="p-3.5 rounded-xl bg-section-blue border border-section-blue-border text-xs text-section-blue-text flex items-center gap-2">
        <CheckCircle2 size={15} className="shrink-0" />
        <span>No specific trade certificates required for this category.</span>
      </div>
    );
  }

  const documentLabelMap = Object.fromEntries(
    WORKER_DOCUMENT_OPTIONS.map(({ value, label }) => [value, label])
  );

  const docStatusList = requiredDocTypes.map(docType => {
    const label = documentLabelMap[docType] || docType;
    const workerDoc = workerDocuments.find(d => d.type === docType);

    if (!workerDoc) {
      return { type: docType, label, isVerified: false, status: 'MISSING', text: 'Not Uploaded' };
    }

    if (workerDoc.status === DOCUMENT_STATUS.VERIFIED) {
      return { type: docType, label, isVerified: true, status: 'VERIFIED', text: 'Verified' };
    }

    if (
      workerDoc.status === DOCUMENT_STATUS.PENDING ||
      workerDoc.status === DOCUMENT_STATUS.IN_REVIEW
    ) {
      return { type: docType, label, isVerified: false, status: 'IN_REVIEW', text: 'Under Review' };
    }

    return {
      type: docType,
      label,
      isVerified: false,
      status: 'REJECTED',
      text: 'Rejected',
      reason: workerDoc.rejectReason,
    };
  });

  const allVerified = docStatusList.every(item => item.isVerified);

  return (
    <div className="space-y-3 p-4 rounded-xl bg-section-blue border border-section-blue-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Category Required Credentials</h4>
        </div>
        <Link
          to="/worker/profile/documents"
          className="text-xs text-section-blue-text hover:underline flex items-center gap-1 font-medium"
        >
          Manage Documents <ExternalLink size={12} />
        </Link>
      </div>

      {allVerified ? (
        <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-600 text-white text-xs flex items-center gap-2 font-medium dark:bg-section-green dark:text-section-green-text dark:border-section-green-border">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>
            All required trade documents are verified. You are eligible to offer services in this
            category.
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-section-amber border border-section-amber-border text-xs text-section-amber-text flex items-start gap-2 font-medium">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Verification Required</p>
            <p className="opacity-90 mt-0.5">
              You must upload and receive admin verification for all required documents below before
              publishing this service.
            </p>
          </div>
        </div>
      )}

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {docStatusList.map(item => {
          const isverified = item.status === 'VERIFIED';
          const isInReview = item.status === 'IN_REVIEW';
          const isRejected = item.status === 'REJECTED';
          const isMissing = item.status === 'MISSING';

          return (
            <div
              key={item.type}
              className="flex items-center justify-between p-2.5 rounded-lg bg-card/80 border border-border shadow-xs"
            >
              <span className="text-xs font-medium text-foreground truncate pr-2">
                {item.label}
              </span>

              <Badge
                className={cn(
                  'text-[10px] py-0 px-2 shrink-0',
                  isMissing ? '' : 'flex items-center gap-1'
                )}
                variant={isverified ? 'green' : isInReview ? 'amber' : 'red'}
              >
                {isverified ? (
                  <CheckCircle2 size={11} />
                ) : isInReview ? (
                  <Clock size={11} />
                ) : isRejected ? (
                  <XCircle size={11} />
                ) : null}

                {item.text}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
