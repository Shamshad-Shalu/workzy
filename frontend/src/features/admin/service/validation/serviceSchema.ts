import { descriptionRuleOptional, serviceNameRule } from '@/lib/validation/rules';
import { z } from 'zod';

const fileOrStringOrNull = z.union([z.string(), z.instanceof(File), z.null()]).optional();

export const serviceSchema = z.object({
  name: serviceNameRule,
  description: descriptionRuleOptional,
  iconUrl: fileOrStringOrNull.refine(val => val !== null, {
    message: 'Service icon is required',
  }),
  imageUrl: fileOrStringOrNull.refine(val => val !== null, {
    message: 'Service Image is required',
  }),
  parentId: z.string().nullable().optional(),
  level: z.number().int().min(1).max(3),
  platformFee: z
    .number()
    .min(0.1, 'Platform fee is required')
    .max(50, 'Platform fee cannot exceed 50%'),
  isAvailable: z.boolean(),
});

export type serviceSchema = z.infer<typeof serviceSchema>;
