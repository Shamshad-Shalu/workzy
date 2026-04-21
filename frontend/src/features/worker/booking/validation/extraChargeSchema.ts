import { z } from 'zod';

import { createDescriptionRule } from '@/lib/validation/rules';

export const ExtraChargeSchema = z.object({
  amount: z.number({ message: 'Amount must be a number' }).min(60, 'Minimum extra charge is ₹60'),
  reason: createDescriptionRule('Reason'),
  evidenceUrl: z
    .string({ message: 'Evidence is required' })
    .min(1, 'Evidence is required')
    .url('Invalid URL'),
});

export type ExtraChargeFormType = z.infer<typeof ExtraChargeSchema>;
