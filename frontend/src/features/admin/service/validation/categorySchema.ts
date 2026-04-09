import { z } from 'zod';

import { PRICING_MODE, SERVICE_TYPE } from '@/constants';
import { descriptionRuleRequired, serviceNameRule } from '@/lib/validation/rules';

const baseSchema = z.object({
  name: serviceNameRule,
  description: descriptionRuleRequired,
  iconUrl: z.string().min(1, 'Service icon is required'),
  imageUrl: z.string().min(1, 'Service Image is required'),
  parentId: z.string().nullable().optional(),
  level: z.union([z.literal(1), z.literal(2)], { message: 'Invalid category level' }),
  platformFee: z
    .number()
    .min(0.1, 'Platform fee is required')
    .max(50, 'Platform fee cannot exceed 50%'),
  isAvailable: z.boolean(),

  baseRate: z
    .number({ message: 'Base rate is required ' })
    .min(50, 'Please enter a valid base rate.(minimun 50)'),
});

const level1Schema = baseSchema.extend({
  level: z.literal(1),
  parentId: z.null().optional(),
});

const level2Schema = baseSchema
  .extend({
    level: z.literal(2),
    parentId: z
      .string({ message: 'Parent category is required' })
      .min(1, 'Parent category is required'),
    priceVarianceLimit: z
      .number()
      .min(0, 'value must be non-negative.')
      .max(100, 'value cannot exceed 100%.'),

    estimatedDuration: z.number().int().positive('Estimated duration is required.'),
    bufferTime: z.number().int().min(0, 'Buffer time is required.'),
    travelRatePerKM: z.number().min(0, 'Travel rate per KM is required.'),
    serviceType: z.nativeEnum(SERVICE_TYPE, { message: 'Invalid service type.' }),
    pricingMode: z.nativeEnum(PRICING_MODE, { message: 'Invalid pricing mode.' }),

    allowBulkOffers: z.boolean(),
    allowSuddenBooking: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.serviceType === SERVICE_TYPE.MAJOR_PROJECT ||
      data.serviceType === SERVICE_TYPE.CONSULTATION ||
      data.serviceType === SERVICE_TYPE.INSPECTION ||
      data.pricingMode === PRICING_MODE.FIXED
    ) {
      if (data.allowBulkOffers) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bulk offers not allowed for this pricing configuration.',
          path: ['allowBulkOffers'],
        });
      }
    }

    if (data.serviceType === SERVICE_TYPE.MAJOR_PROJECT && data.allowSuddenBooking === true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sudden booking not allowed for this service type.',
        path: ['allowSuddenBooking'],
      });
    }

    if (
      (data.serviceType === SERVICE_TYPE.CONSULTATION ||
        data.serviceType === SERVICE_TYPE.INSPECTION) &&
      data.pricingMode !== PRICING_MODE.FIXED
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${data.serviceType} must have Fixed pricing`,
        path: ['pricingMode'],
      });
    }
  });

export const categorySchema = z.discriminatedUnion('level', [level1Schema, level2Schema]);

export type CategoryFormData = z.infer<typeof categorySchema>;
