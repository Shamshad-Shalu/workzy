import { z } from 'zod';

import { createDescriptionRule } from '@/lib/validation/rules';

export const ReviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z
    .number({ message: 'Rating is required' })
    .min(1, 'Minimum rating is 1')
    .max(5, 'Maximum rating is 5'),
  reviewText: createDescriptionRule('Review'),
  media: z
    .array(
      z.object({
        url: z.string().url('Invalid media URL'),
        type: z.enum(['image', 'video']),
      })
    )
    .max(5, 'Maximum 5 media files allowed')
    .optional(),
});

export type ReviewFormType = z.infer<typeof ReviewSchema>;
