import { descriptionRuleOptional, serviceNameRule } from '@/lib/validation/rules';
import { z } from 'zod';

export const categorySchema = z.object({
  name: serviceNameRule,
  description: descriptionRuleOptional,
  iconUrl: z.string().min(1, 'Service icon is required'),
  imageUrl: z.string().min(1, 'Service Image is required'),
  parentId: z.string().nullable().optional(),
  platformFee: z
    .number()
    .min(0.1, 'Platform fee is required')
    .max(50, 'Platform fee cannot exceed 50%'),
  isAvailable: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
