import { z } from 'zod';

import { mongoId } from '@/lib/validation/rules';

import { LocationSchema } from '../../profile/validation/profileSchema';

const AddressSchema = z.object({
  label: z.string().min(1),
  location: LocationSchema,
});

export const bookingSchema = z.object({
  serviceId: mongoId,
  workerId: mongoId,
  slotId: mongoId,
  itemCount: z.number().int().min(1),
  address: AddressSchema.nullable(),
  userNote: z.string().trim().optional(),
});

export type bookingFormData = z.infer<typeof bookingSchema>;
