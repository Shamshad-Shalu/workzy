import z from 'zod';

import { descriptionRuleRequired, serviceNameRule } from '@/lib/validation/rules';

import { availabilitySchema } from './availabilitySchema';

export const geoLocationSchema = z.object({
  type: z.literal('Point'),
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90, {
      message: 'Invalid coordinates',
    }),
  addressLabel: z.string().min(1, 'Address is required'),
});

export const workerProfileSchema = z.object({
  displayName: serviceNameRule,
  tagline: serviceNameRule,
  about: descriptionRuleRequired,
  coverImage: z.string().optional(),
  location: geoLocationSchema,
  availability: availabilitySchema,
  languages: z.array(z.string()),
});

export type WorkerProfileSchemaType = z.infer<typeof workerProfileSchema>;
