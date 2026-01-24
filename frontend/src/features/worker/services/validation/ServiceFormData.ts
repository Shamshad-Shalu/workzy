import { BULK_DISCOUNT, SERVICE_TYPE } from '@/constants';
import { DESCRIPTION_REGEX } from '@/lib/validation/rules';
import z from 'zod';

export const bulkDiscountSchema = z.object({
  count: z.number().int().min(BULK_DISCOUNT.MIN_COUNT).max(BULK_DISCOUNT.MAX_COUNT),

  percent: z.number().int().min(BULK_DISCOUNT.MIN_PERCENT).max(BULK_DISCOUNT.MAX_PERCENT),
});

const progressiveBulkDiscountSchema = z.array(bulkDiscountSchema).superRefine((discounts, ctx) => {
  if (!discounts || discounts.length === 0) {return;}

  const sorted = [...discounts].sort((a, b) => a.count - b.count);

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].percent <= sorted[i - 1].percent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Bulk discount percent must increase with service count',
        path: [i, 'percent'],
      });
    }
  }
});

const baseServiceSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),

  rate: z.number().min(0, 'Rate must be non-negative'),

  description: z
    .string()
    .regex(DESCRIPTION_REGEX, 'Invalid description format')
    .optional()
    .or(z.literal('')),

  estimatedDuration: z.number().int().positive().optional(),

  bufferTime: z.number().int().min(0).optional(),

  maxTravelRadius: z.number().min(0),

  bulkDiscounts: progressiveBulkDiscountSchema.optional(),

  allowSuddenBooking: z.boolean().optional(),

  isActive: z.boolean().default(true),

  experience: z.number().min(0).optional(),

  maxTravelCost: z.number().min(0).nullable().optional(),
});

export const serviceSchema = baseServiceSchema
  .extend({
    categoryType: z.nativeEnum(SERVICE_TYPE),
  })
  .superRefine((data, ctx) => {
    // 🚫 Remote services cannot have travel
    if (data.categoryType === SERVICE_TYPE.REMOTE) {
      if (data.maxTravelRadius !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Remote services must have travel radius 0',
          path: ['maxTravelRadius'],
        });
      }

      if (data.maxTravelCost && data.maxTravelCost > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Remote services cannot have travel cost',
          path: ['maxTravelCost'],
        });
      }
    }

    // 🚫 Consultation cannot have bulk discounts
    if (data.categoryType === SERVICE_TYPE.CONSULTATION) {
      if (data.bulkDiscounts && data.bulkDiscounts.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bulk discounts are not allowed for consultation services',
          path: ['bulkDiscounts'],
        });
      }
    }

    if (data.categoryType === SERVICE_TYPE.REMOTE && data.allowSuddenBooking === true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sudden booking is only allowed for onsite services',
        path: ['allowSuddenBooking'],
      });
    }
  });

export type ServiceFormType = z.infer<typeof serviceSchema>;
