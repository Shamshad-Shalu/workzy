import z from 'zod';

import { descriptionRuleRequired, serviceNameRule } from '@/lib/validation/rules';

export const JoinWorkerSchema = z.object({
  displayName: serviceNameRule,
  tagline: serviceNameRule,
  about: descriptionRuleRequired,
  document: z.string().min(1, 'Please provide an ID proof image'),
  defaultRate: z.number({ message: 'Amount is required' }).min(1, 'Rate must be a valid amount'),
});

export type JoinWorkerSchemaType = z.infer<typeof JoinWorkerSchema>;
