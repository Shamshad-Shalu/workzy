import z from 'zod';

import { DOCUMENT_STATUS, DOCUMENT_TYPE, WORKER_STATUS } from '@/constants';
import { createDescriptionRule, mongoId } from '@/lib/validation/rules';

const REQUIRED_DOC_TYPES = [
  DOCUMENT_TYPE.AADHAAR,
  DOCUMENT_TYPE.PAN,
  DOCUMENT_TYPE.PROFILE_PHOTO,
  DOCUMENT_TYPE.SELFIE_VERIFICATION,
];
const documentSchema = z
  .object({
    id: mongoId,
    type: z.enum(Object.values(DOCUMENT_TYPE) as [string, ...string[]]),
    status: z.enum([DOCUMENT_STATUS.VERIFIED, DOCUMENT_STATUS.REJECTED, DOCUMENT_STATUS.IN_REVIEW]),
    rejectReason: createDescriptionRule('Reason', false),
  })
  .superRefine((doc, ctx) => {
    if (doc.status === DOCUMENT_STATUS.REJECTED && !doc.rejectReason) {
      ctx.addIssue({
        code: 'custom',
        path: ['rejectReason'],
        message: 'Rejection reason is required',
      });
    }
  });

export const workerReviewSchema = z
  .object({
    documents: z.array(documentSchema).min(4, 'All mandatory documents must be reviewed'),
    status: z.enum([
      WORKER_STATUS.IN_REVIEW,
      WORKER_STATUS.VERIFIED,
      WORKER_STATUS.NEEDS_REVISION,
      WORKER_STATUS.REJECTED,
    ]),
    rejectReason: createDescriptionRule('Reason', false),
  })
  .superRefine((data, ctx) => {
    const { documents, status, rejectReason } = data;
    const docTypes = documents.map(d => d.type);
    for (const requiredType of REQUIRED_DOC_TYPES) {
      if (!docTypes.includes(requiredType)) {
        ctx.addIssue({
          code: 'custom',
          path: ['documents'],
          message: `Missing required document: ${requiredType}`,
        });
      }
    }

    const hasRejectedDoc = documents.some(d => d.status === DOCUMENT_STATUS.REJECTED);
    const hasInReviewDoc = documents.some(d => d.status === DOCUMENT_STATUS.IN_REVIEW);
    const allVerified = documents.every(d => d.status === DOCUMENT_STATUS.VERIFIED);

    if (status === WORKER_STATUS.VERIFIED && !allVerified) {
      ctx.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'All documents must be verified to mark worker as VERIFIED',
      });
    }
    if (hasInReviewDoc && status !== WORKER_STATUS.IN_REVIEW) {
      ctx.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'Worker must be IN_REVIEW while documents are under review',
      });
    }
    if (hasRejectedDoc) {
      if (
        status !== WORKER_STATUS.REJECTED &&
        status !== WORKER_STATUS.IN_REVIEW &&
        status !== WORKER_STATUS.NEEDS_REVISION
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['status'],
          message: 'Worker must be REJECTED or NEEDS_REVISION if any document is rejected',
        });
      }
    }
    if (
      (status === WORKER_STATUS.REJECTED || status === WORKER_STATUS.NEEDS_REVISION) &&
      !rejectReason
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['rejectReason'],
        message: 'Reject reason is required',
      });
    }
  });
export type WorkerReviewFormType = z.infer<typeof workerReviewSchema>;
