import { BULK_DISCOUNT } from '@/constants';
import { DESCRIPTION_REGEX } from '@/lib/validation/rules';
import { z } from 'zod';

const bulkDiscountSchema = z.object({
  count: z.preprocess(
    v => (v === '' || v === undefined ? undefined : Number(v)),
    z
      .number('Count is required')
      .int()
      .min(BULK_DISCOUNT.MIN_COUNT, `Minimum count is ${BULK_DISCOUNT.MIN_COUNT}`)
      .max(BULK_DISCOUNT.MAX_COUNT, `Maximum count is ${BULK_DISCOUNT.MAX_COUNT}`)
  ),

  percent: z.preprocess(
    v => (v === '' || v === undefined ? undefined : Number(v)),
    z
      .number('percent is required')
      .int()
      .min(BULK_DISCOUNT.MIN_PERCENT, `Minimum percent is ${BULK_DISCOUNT.MIN_PERCENT}`)
      .max(BULK_DISCOUNT.MAX_PERCENT, `Maximum percent is ${BULK_DISCOUNT.MAX_PERCENT}`)
  ),
});

const progressiveBulkDiscountSchema = z.array(bulkDiscountSchema).superRefine((discounts, ctx) => {
  if (!discounts || discounts.length === 0) {
    return;
  }

  const sorted = [...discounts].sort((a, b) => a.count - b.count);
  const seen = new Set<number>();
  for (let i = 0; i < sorted.length; i++) {
    if (seen.has(sorted[i].count)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate service count not allowed',
        path: [i, 'count'],
      });
    }
    seen.add(sorted[i].count);
  }

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].percent <= sorted[i - 1].percent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Discount must increase with quantity',
        path: [i, 'percent'],
      });
    }

    if (sorted[i].count <= sorted[i - 1].count) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Quantity must increase progressively',
        path: [i, 'count'],
      });
    }
  }
});

export const serviceSchema = z
  .object({
    categoryId: z.string().min(1, 'Category is required'),
    rate: z.preprocess(v => Number(v), z.number().min(0, 'Rate must be non-negative')),
    description: z.string().regex(DESCRIPTION_REGEX, 'Invalid format').optional().or(z.literal('')),
    estimatedDuration: z.preprocess(
      v => Number(v),
      z.number().int().positive('Estimated duration is required.')
    ),
    bufferTime: z.preprocess(v => Number(v), z.number().int().min(0, 'Buffer time is required.')),
    maxTravelRadius: z.preprocess(
      v => Number(v),
      z.number().min(3, 'Travel radius must be more than 3km')
    ),
    bulkDiscounts: progressiveBulkDiscountSchema.optional(),
    allowSuddenBooking: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    experience: z.preprocess(v => Number(v), z.number().min(0)).optional(),
    maxTravelCost: z.preprocess(
      v => (v === '' || v === null || v === undefined ? null : Number(v)),
      z.number('Max Travel cost is required').min(0, 'Travel cost must be positive').nullable()
    ),
    /* helpers */
    _baseRate: z.number().optional(),
    _deviation: z.number().optional(),
    _baseBuffer: z.number().optional(),
    _baseDuration: z.number().optional(),
    _setTravelCost: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data._baseRate !== undefined && data._deviation !== undefined) {
      const minPrice = data._baseRate - data._deviation;
      const maxPrice = data._baseRate + data._deviation;

      if (data.rate < minPrice || data.rate > maxPrice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Rate must be between ₹${minPrice} and ₹${maxPrice}`,
          path: ['rate'],
        });
      }
    }

    if (data._setTravelCost && (data.maxTravelCost === null || data.maxTravelCost === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify the max travel cost cap',
        path: ['maxTravelCost'],
      });
    }

    if (data.bufferTime > data.estimatedDuration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Buffer time cannot exceed service duration',
        path: ['bufferTime'],
      });
    }

    if (data._baseDuration) {
      const durationDur = Math.floor(data?._baseDuration * 0.5);
      if (
        data.estimatedDuration > data._baseDuration + durationDur ||
        data.estimatedDuration < data._baseDuration - durationDur
      ) {
        const message =
          data.bufferTime > data._baseDuration + durationDur
            ? `estimatedDuration cannot exceed than service duration (${data._baseDuration + durationDur} min)`
            : `estimatedDuration cannot be less than service duration (${data._baseDuration - durationDur} min)`;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: message,
          path: ['estimatedDuration'],
        });
      }
    }
  });

export type ServiceFormType = z.infer<typeof serviceSchema>;
