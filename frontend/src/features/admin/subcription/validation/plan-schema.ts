import { z } from 'zod';

import { BILLING_CYCLE_MONTHS } from '@/constants';
import { createDescriptionRule, serviceNameRule } from '@/lib/validation/rules';

const money = z.number('Please enter amount').min(50, 'Must be at least 50');

const planPriceSchema = z.object({
  monthly: money.max(1000, 'Monthly price cannot exceed 1000'),
  quarterly: money.optional(),
  halfYearly: money.optional(),
  yearly: money.optional(),
});

const isoDateString = z
  .string()
  .refine(v => !Number.isNaN(Date.parse(v)), { message: 'Invalid date' });

export const planSchema = z
  .object({
    name: serviceNameRule,
    description: createDescriptionRule('Description', true),
    isSpecialOffer: z.boolean(),
    isActive: z.boolean(),
    price: planPriceSchema,
    validFrom: isoDateString.optional(),
    validTill: isoDateString.optional(),
  })
  .superRefine((data, ctx) => {
    const { monthly, quarterly, halfYearly, yearly } = data.price;

    const cycleChecks: Array<{
      key: 'quarterly' | 'halfYearly' | 'yearly';
      label: string;
      value: number | undefined;
    }> = [
      { key: 'quarterly', label: 'Quarterly', value: quarterly },
      { key: 'halfYearly', label: 'Half-yearly', value: halfYearly },
      { key: 'yearly', label: 'Yearly', value: yearly },
    ];

    for (const { key, label, value } of cycleChecks) {
      if (!value) {
        continue;
      }
      const maxAllowed = monthly * BILLING_CYCLE_MONTHS[key];
      if (value >= maxAllowed) {
        ctx.addIssue({
          code: 'custom',
          path: ['price', key],
          message: `${label} must be less than ${maxAllowed}`,
        });
      }
    }

    if (!data.isSpecialOffer) {
      if (quarterly === null) {
        ctx.addIssue({
          code: 'custom',
          path: ['price', 'quarterly'],
          message: 'Quarterly is required',
        });
      }
      if (halfYearly === null) {
        ctx.addIssue({
          code: 'custom',
          path: ['price', 'halfYearly'],
          message: 'Half-yearly is required',
        });
      }
      if (yearly === null) {
        ctx.addIssue({ code: 'custom', path: ['price', 'yearly'], message: 'Yearly is required' });
      }
    }

    if (data.isSpecialOffer) {
      if (!data.validTill) {
        ctx.addIssue({ code: 'custom', path: ['validTill'], message: 'validTill is required' });
        return;
      }

      const now = new Date();
      const from = data.validFrom ? new Date(data.validFrom) : undefined;
      const till = new Date(data.validTill);

      if (from && from <= now) {
        ctx.addIssue({
          code: 'custom',
          path: ['validFrom'],
          message: 'validFrom must be in the future',
        });
      }

      if (till <= now) {
        ctx.addIssue({
          code: 'custom',
          path: ['validTill'],
          message: 'validTill must be in the future',
        });
      }

      if (from && till <= from) {
        ctx.addIssue({
          code: 'custom',
          path: ['validTill'],
          message: 'validTill must be after validFrom',
        });
      }
    }
  });

export type PlanFormData = z.infer<typeof planSchema>;
