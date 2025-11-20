import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(25, 'Name cannot exceed 25 characters')
    .regex(/^[A-Za-z]+$/, 'Name must contain only letters'),

  email: z.string().email('Invalid email format'),

  password: z
    .string()
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol')
    .min(8, 'Password must be at least 8 characters'),
});

export type SignupSchemaType = z.infer<typeof signupSchema>;
