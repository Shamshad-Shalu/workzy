import z from 'zod';
import { descriptionRuleRequired, phoneRule, serviceNameRule } from '@/lib/validation/rules';

export const JoinWorkerSchema = z.object({
  displayName: serviceNameRule,
  tagline: serviceNameRule,
  about: descriptionRuleRequired,
  phone: phoneRule,
  age: z
    .number({ message: 'age is required' })
    .min(18, 'You must be at least 18 years old')
    .max(100, 'Invalid age'),
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
