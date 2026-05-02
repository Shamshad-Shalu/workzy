import { z } from 'zod';

export const quoteFormSchema = z.object({
  bookingId: z.string().min(1, 'BookingId is required'),
  dates: z.array(z.string()).min(1, { message: 'Select at least one date' }),
  totalPrice: z
    .number({ message: 'Enter a valid price' })
    .min(100, { message: 'Price must be greater than 100' }),
  message: z.string().optional(),
});

export type QuoteFormType = z.infer<typeof quoteFormSchema>;
