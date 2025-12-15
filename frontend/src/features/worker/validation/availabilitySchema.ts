import { z } from 'zod';

export const timeRegex = /^\d{2}:\d{2}$/;

export const slotSchema = z
  .object({
    startTime: z.string().regex(timeRegex),
    endTime: z.string().regex(timeRegex),
  })
  .refine(slot => slot.startTime < slot.endTime, {
    message: 'End time must be after start time',
  });

export const availabilitySchema = z
  .object({
    monday: z.array(slotSchema),
    tuesday: z.array(slotSchema),
    wednesday: z.array(slotSchema),
    thursday: z.array(slotSchema),
    friday: z.array(slotSchema),
    saturday: z.array(slotSchema),
    sunday: z.array(slotSchema),
  })
  .refine(data => Object.values(data).some(daySlots => daySlots.length > 0), {
    message: 'At least one availability slot is required',
  });
