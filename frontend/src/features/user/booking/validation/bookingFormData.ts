import { z } from 'zod';

import { LocationSchema } from '@/features/profile/validation/profileSchema';
import { mongoId } from '@/lib/validation/rules';

const AddressSchema = z.object({
  label: z.string().min(1),
  location: LocationSchema,
});

export const bookingSchema = z.object({
  serviceId: mongoId,
  workerId: mongoId,
  slotId: mongoId,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  duration: z.number().int().positive(),
  itemCount: z.number().int().min(1),
  address: AddressSchema.nullable(),
  userNote: z.string().trim().optional(),
});

export type bookingFormData = z.infer<typeof bookingSchema>;
