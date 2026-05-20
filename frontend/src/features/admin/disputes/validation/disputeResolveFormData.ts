import { z } from 'zod';

import { DISPUTE_STATUS_VALUES, DISPUTE_RESOLUTION_VALUES } from '@/constants/dispute';
import { createDescriptionRule } from '@/lib/validation/rules';

export const disputeResolveFormData = z.object({
  status: z.enum(DISPUTE_STATUS_VALUES as [string, ...string[]], {
    message: 'please select the status',
  }),
  resolution: z.enum(DISPUTE_RESOLUTION_VALUES as [string, ...string[]]).optional(),
  note: createDescriptionRule('Admin Note', true, 10, 2000),
  refundedAmount: z.preprocess(
    val => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().min(100, 'Refunded amount must be greater than 100').optional()
  ),
});

export type DisputeResolveFormType = z.infer<typeof disputeResolveFormData>;
