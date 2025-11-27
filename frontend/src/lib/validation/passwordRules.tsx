import { z } from 'zod';
import { passwordRule } from './rules';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordRule,
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
