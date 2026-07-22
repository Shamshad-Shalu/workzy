import z from 'zod';

import { geoLocationSchema } from '@/features/worker/profile/validation/workerProfileSchema';
import { createDescriptionRule, descriptionRuleRequired, phoneRule } from '@/lib/validation/rules';

export const JoinWorkerSchema = z.object({
  displayName: createDescriptionRule('Name', true, 3, 80),
  tagline: createDescriptionRule('Tagline', true, 3, 80),
  about: descriptionRuleRequired,
  phone: phoneRule,
  profileImage: z.string().optional(),
  experience: z
    .number({ message: 'Experience is required' })
    .min(0, 'Experience must be a positive number')
    .max(100, 'Experience seems too high'),
  documents: z.object({
    aadhaar: z.url('Aadhaar document is required'),
    pan: z.url('PAN document is required'),
    selfie: z.url('Selfie verification is required'),
    profile: z.url('Profile photo is required'),
  }),
  location: geoLocationSchema,
  languages: z.array(z.string()),
});

export type JoinWorkerSchemaType = z.infer<typeof JoinWorkerSchema>;
