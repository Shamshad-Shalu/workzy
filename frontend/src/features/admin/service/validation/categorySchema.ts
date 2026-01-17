import { PRICING_MODE, SERVICE_TYPE } from '@/constants';
import { descriptionRuleRequired, serviceNameRule } from '@/lib/validation/rules';
import { z } from 'zod';

const baseSchema = z.object({
  name: serviceNameRule,
  description: descriptionRuleRequired,
  iconUrl: z.string().min(1, 'Service icon is required'),
  imageUrl: z.string().min(1, 'Service Image is required'),
  parentId: z.string().nullable().optional(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)], { message: 'Invalid category level' }),
  platformFee: z
    .number()
    .min(0.1, 'Platform fee is required')
    .max(50, 'Platform fee cannot exceed 50%'),
  isAvailable: z.boolean(),

  baseRate: z
    .number({ message: 'Base rate is required ' })
    .min(50, 'Please enter a valid base rate.(minimun 50)'),
});

const level1or2Schema = baseSchema.extend({
  level: z.union([z.literal(1), z.literal(2)]),
});

const level3Schema = baseSchema
  .extend({
    level: z.literal(3),
    rateDeviationPercent: z
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
      data.serviceType === SERVICE_TYPE.REMOTE &&
      data.travelRatePerKM !== null &&
      data.travelRatePerKM !== 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Travel rate per KM must be 0 for Remote services.',
        path: ['travelRatePerKM'],
      });
    }

    if (
      data.serviceType === SERVICE_TYPE.MAJOR_PROJECT ||
      data.serviceType === SERVICE_TYPE.CONSULTATION
    ) {
      if (data.allowBulkOffers) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bulk offers not allowed for this service type.',
        });
      }
    }

    if (data.serviceType !== SERVICE_TYPE.SMALL_TASK && data.allowSuddenBooking === true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sudden booking not allowed for this service type.',
        path: ['allowSuddenBooking'],
      });
    }

    if (data.serviceType === SERVICE_TYPE.CONSULTATION && data.pricingMode !== PRICING_MODE.FIXED) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Consultation must have Fixed pricing',
        path: ['pricingMode'],
      });
    }
  });

export const categorySchema = z.discriminatedUnion('level', [level1or2Schema, level3Schema]);

export type CategoryFormData = z.infer<typeof categorySchema>;
