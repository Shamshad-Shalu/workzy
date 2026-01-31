import z from 'zod';
import { availabilitySchema } from '../../validation/availabilitySchema';
import { descriptionRuleRequired, serviceNameRule } from '@/lib/validation/rules';

export const workerProfileSchema = z.object({
  displayName: serviceNameRule,
  tagline: serviceNameRule,
  about: descriptionRuleRequired,
  coverImage: z.string().optional(),
  defaultRate: z.number({ message: 'Amount is required' }).min(1, 'Rate must be a valid amount'),
  cities: z.array(z.string()).min(1, 'At least one skill required'),
  availability: availabilitySchema,
});

export type WorkerProfileSchemaType = z.infer<typeof workerProfileSchema>;
