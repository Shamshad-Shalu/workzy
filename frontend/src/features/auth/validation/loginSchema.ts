import { z } from 'zod';

import { emailRule } from '@/lib/validation/rules';

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(8, 'Password must be at least 8 chars'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
