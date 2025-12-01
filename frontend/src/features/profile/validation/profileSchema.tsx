import { nameRule } from '@/lib/validation/rules';
import { z } from 'zod';

export const ProfileSchema = z.object({
  name: nameRule,
  profile: z.object({
    address: z.object({
      house: z.string().trim().optional(),
      place: z
        .string()
        .trim()
        .optional()
        .refine(val => !val || val.length >= 3, {
          message: 'Place must be at least 3 characters',
        })
        .refine(val => !val || /^[A-Za-z\s]+$/.test(val), {
          message: 'Place should contain letters only',
        }),

      city: z
        .string()
        .trim()
        .optional()
        .refine(val => !val || val.length >= 3, {
          message: 'City must be at least 3 characters',
        })
        .refine(val => !val || /^[A-Za-z\s]+$/.test(val), {
          message: 'City should contain letters only',
        }),

      state: z.string().optional(),

      pincode: z
        .string()
        .trim()
        .optional()
        .refine(val => !val || /^[0-9]{6}$/.test(val), {
          message: 'Pincode must be exactly 6 digits',
        }),
    }),
  }),
});

export type ProfileFormType = z.infer<typeof ProfileSchema>;
