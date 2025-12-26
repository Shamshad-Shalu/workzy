import z from 'zod';
import { DESCRIPTION_REGEX } from '@/lib/validation/rules';
import { WORKER_STATUSES } from '@/constants';

export const ReviewWorkerSchema = z
  .object({
    docName: z
      .string()
      .optional()
      .refine(val => !val || /^(?=(?:.*[A-Za-z]){3,})[A-Za-z0-9\s#\-\/.,]{3,50}$/.test(val), {
        message: 'Name must be 3–50 characters and valid',
      }),
    docId: z.string(),
    reason: z
      .string()
      .optional()
      .refine(val => !val || val.length >= 10, {
        message: 'Reason minimum 10 characters',
      })
      .refine(val => !val || DESCRIPTION_REGEX.test(val), {
        message: 'Note contains invalid characters',
      }),
    status: z.enum(WORKER_STATUSES, {
      message: 'status is required',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'verified') {
      if (!data.docName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Document Name is required',
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
    }

    if (data.status === 'rejected') {
      if (!data.reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Rejection reason is required',
          path: ['reason'],
        });
      }
    }
  });

export type ReviewWorkerSchemaType = z.infer<typeof ReviewWorkerSchema>;
