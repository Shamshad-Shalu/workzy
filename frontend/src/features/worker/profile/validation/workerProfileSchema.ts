import z from 'zod';
import { availabilitySchema } from '../../validation/availabilitySchema';
import { descriptionRuleRequired, serviceNameRule } from '@/lib/validation/rules';

export const workerProfileSchema = z.object({
  displayName: serviceNameRule,
  tagline: serviceNameRule,
  about: descriptionRuleRequired,
  coverImage: z
    .union([z.string(), z.instanceof(File), z.null()])
    .optional()
    .refine(val => val !== null, {
      message: 'Image is required',
    }),
  defaultRate: z.object({
    amount: z.number({ message: 'Amount is required' }).min(1, 'Rate must be a valid amount'),
    type: z.enum(['hourly', 'fixed']),
  }),
  skills: z.array(z.string()).min(2, 'At least two skill required'),
  cities: z.array(z.string()).min(1, 'At least one skill required'),
  availability: availabilitySchema,
});

export type WorkerProfileSchemaType = z.infer<typeof workerProfileSchema>;
