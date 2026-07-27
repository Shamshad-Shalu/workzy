import { z } from 'zod';

import { DISPUTE_REASON_VALUES } from '@/constants/dispute';
import { createDescriptionRule } from '@/lib/validation/rules';

export const raiseDisputeSchema = z.object({
  reason: z.enum(DISPUTE_REASON_VALUES as [string, ...string[]]),
  description: createDescriptionRule('Description', true, 10, 2000),
  evidence: z
    .array(
      z.object({
        url: z.string().url('Invalid evidence URL'),
        type: z.enum(['image', 'video']),
      })
    )
    .min(1, 'At least one evidence is required')
    .max(5, 'Maximum 5 evidence files allowed'),
});

export type RaiseDisputeFormType = z.infer<typeof raiseDisputeSchema>;
