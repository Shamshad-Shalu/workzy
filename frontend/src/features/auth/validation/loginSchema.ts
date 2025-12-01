import { emailRule } from '@/lib/validation/rules';
import { z } from 'zod';

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(8, 'Password must be at least 8 chars'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
