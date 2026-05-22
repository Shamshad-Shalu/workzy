import z from 'zod';

import { ROLE } from '@/constants';
import { createDescriptionRule, mongoId } from '@/lib/validation/rules';

export const bookingRescheduleFormData = z.object({
  requestedBy: z.enum(Object.values(ROLE) as [string, ...string[]]),
  oldSlotId: mongoId,
  newSlotId: mongoId,
  reason: createDescriptionRule('Reason', true, 10, 500),
});

export type bookingRescheduleFormType = z.infer<typeof bookingRescheduleFormData>;
