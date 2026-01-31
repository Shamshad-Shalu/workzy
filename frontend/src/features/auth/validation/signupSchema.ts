import { z } from 'zod';

import { emailRule, nameRule, passwordRule } from '@/lib/validation/rules';

export const signupSchema = z.object({
  name: nameRule,
  email: emailRule,
  password: passwordRule,
});

export type SignupSchemaType = z.infer<typeof signupSchema>;
