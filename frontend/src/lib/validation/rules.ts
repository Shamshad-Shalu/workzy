import { z } from 'zod';
export const emailRule = z.string().email('Invalid email format');

export const passwordRule = z
  .string()
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/\d/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol')
  .min(8, 'Password must be at least 8 characters');

export const phoneRule = z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits');
