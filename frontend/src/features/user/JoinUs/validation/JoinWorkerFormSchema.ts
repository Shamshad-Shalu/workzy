import z from 'zod';
import { descriptionRuleRequired, serviceNameRule } from '@/lib/validation/rules';

export const JoinWorkerSchema = z.object({
  displayName: serviceNameRule,
  tagline: serviceNameRule,
  about: descriptionRuleRequired,
  document: z
    .union([z.literal(''), z.instanceof(File), z.null()])
    .refine(val => val !== null && val !== '', {
      message: 'Please provide an ID proof image.',
    }),
  defaultRate: z.object({
    amount: z.number({ message: 'Amount is required' }).min(1, 'Rate must be a valid amount'),
    type: z.enum(['hourly', 'fixed']),
  }),
});

export type JoinWorkerSchemaType = z.infer<typeof JoinWorkerSchema>;
