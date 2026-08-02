import { z } from 'zod';

export const createQuoteSchema = z.object({
  bookingId: z.string().min(1, 'BookingId is required'),
  dates: z.array(z.string()).min(1, { message: 'Select at least one date' }),
  totalPrice: z
    .number({ message: 'Enter a valid price' })
    .min(100, { message: 'Price must be greater than 100' }),
  message: z.string().optional(),
});
export type CreateQuoteFormType = z.infer<typeof createQuoteSchema>;

export const editQuoteSchema = z.object({
  dates: z.array(z.string()).optional(),
  totalPrice: z.number().min(60, 'Minimum price is ₹60').optional(),
  message: z.string().optional(),
});

export type EditQuoteFormType = z.infer<typeof editQuoteSchema>;
