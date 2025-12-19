import z from 'zod';
import { DESCRIPTION_REGEX, descriptionRuleOptional } from '@/lib/validation/rules';
import { WORKER_STATUSES } from '@/constants';

export const ReviewWorkerSchema = z
  .object({
    docName: z
      .string()
      .optional()
      .refine(val => !val || /^(?=(?:.*[A-Za-z]){3,})[A-Za-z0-9\s#\-\/.,]{3,50}$/.test(val), {
        message: 'Name must be 3–50 characters and contain at least 3 letters',
      }),
    reason: descriptionRuleOptional,
    status: z.enum(WORKER_STATUSES, {
      message: 'status is required',
    }),
    rejectReason: z
      .string()
      .optional()
      .refine(val => !val || DESCRIPTION_REGEX.test(val), {
        message: 'Reason must be minimum10 characters',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'verified') {
      if (!data.docName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Document Name/Label is required for verification',
          path: ['docName'],
        });
      }
    }

    if (data.status === 'needs_revision') {
      if (!data.reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Reason is required for revision request',
          path: ['reason'],
        });
      }
      if (!data.docName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Document Name/Label is required',
          path: ['docName'],
        });
      }
    }

    if (data.status === 'rejected') {
      if (!data.rejectReason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Rejection reason is required',
          path: ['rejectReason'],
        });
      }
    }
  });

export type ReviewWorkerSchemaType = z.infer<typeof ReviewWorkerSchema>;
