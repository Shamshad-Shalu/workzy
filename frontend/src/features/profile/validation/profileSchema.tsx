import { nameRule } from '@/lib/validation/rules';
import { z } from 'zod';

export const LocationSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]),
});

const HOUSE_ADDRESS_REGEX = /^[A-Za-z0-9\s#\-/. ,]+$/;
const PLACE_CITY_REGEX = /^[A-Za-z\s\-_+.,]+$/;
const PINCODE_REGEX = /^[0-9]{6}$/;

export const ProfileSchema = z.object({
  name: nameRule,
  profile: z
    .object({
      address: z
        .object({
          house: z
            .string()
            .optional()
            .refine(val => !val || val.length >= 3, {
              message: 'House address must be at least 3 characters',
            })
            .refine(val => !val || HOUSE_ADDRESS_REGEX.test(val), {
              message:
                'House address can only contain letters, numbers, spaces, and common symbols (# - / . ,)',
            }),

          place: z
            .string()
            .optional()
            .refine(val => !val || val.length >= 3, {
              message: 'Place must be at least 3 characters',
            })
            .refine(val => !val || PLACE_CITY_REGEX.test(val), {
              message: 'Place should contain letters and spaces only',
            }),

          city: z
            .string()
            .optional()
            .refine(val => !val || val.length >= 3, {
              message: 'City must be at least 3 characters',
            })
            .refine(val => !val || PLACE_CITY_REGEX.test(val), {
              message: 'City should contain letters and spaces only',
            }),

          state: z.string().optional(),

          pincode: z
            .string()
            .optional()
            .refine(val => !val || PINCODE_REGEX.test(val), {
              message: 'Pincode must be exactly 6 digits',
            }),
        })
        .optional()
        .refine(addr => {
          if (!addr) {
            return true;
          }

          const fields = ['house', 'place', 'city', 'state', 'pincode'] as const;
          const filledFields = fields.filter(field => {
            const value = addr[field];
            return value && value.trim() !== '';
          });

          return filledFields.length === 0 || filledFields.length === fields.length;
        }, 'Address incomplete. Please fill all address fields.'),

      location: LocationSchema.optional(),
    })
    .superRefine((profile, ctx) => {
      if (!profile.location) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Location is required for profile completion',
          path: ['location'],
        });
      }
    }),
});

export type ProfileFormType = z.infer<typeof ProfileSchema>;
