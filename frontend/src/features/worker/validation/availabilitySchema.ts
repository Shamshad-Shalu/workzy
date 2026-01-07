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

const noOverlap = (slots: { startTime: string; endTime: string }[]) => {
  const sorted = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].startTime < sorted[i - 1].endTime) {
      return false;
    }
  }
  return true;
};

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
  .superRefine((data, ctx) => {
    Object.entries(data).forEach(([day, slots]) => {
      if (slots.length && !noOverlap(slots)) {
        ctx.addIssue({
          path: [day],
          message: `Time slots on ${day} must not overlap`,
          code: z.ZodIssueCode.custom,
        });
      }
    });
  });
