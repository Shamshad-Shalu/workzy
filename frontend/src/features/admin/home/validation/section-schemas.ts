import { z } from 'zod';

import { HOME_SECTION_TYPE, WHY_CHOOSE_ICON } from '@/constants/home';
import { serviceNameRule } from '@/lib/validation/rules';

const description = z
  .string()
  .min(5)
  .max(500)
  .regex(/^[A-Za-z0-9 &',.!\-\n]+$/, 'Invalid format');

const url = z.string().url('Must be a valid URL');
const mongoId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
const eyebrow = z.string().min(3).max(20);

export const heroSlideSchema = z.object({
  categoryId: mongoId,
  eyebrow: eyebrow,
  title: serviceNameRule,
  subTitle: serviceNameRule,
  description: description,
});

export const heroSchema = z.object({
  autoPlay: z.boolean(),
  interval: z.number().int().min(1000).max(30_000),
  slides: z.array(heroSlideSchema).min(1).max(5),
});

export const categoryShowcaseSchema = z.object({
  categoryId: mongoId,
  title: serviceNameRule,
  subTitle: serviceNameRule.optional().or(z.literal('')),
  limit: z.number().int().min(1).max(10),
});

export const bannerSchema = z.object({
  categoryId: mongoId,
  title: serviceNameRule,
  description: description,
  imageUrl: url,
  ctaText: z.string().optional().or(z.literal('')),
});

export const topServicesSchema = z.object({
  title: serviceNameRule.optional().or(z.literal('')),
  subTitle: serviceNameRule.optional().or(z.literal('')),
  limit: z.number().int().min(1).max(15).optional(),
});

export const nearbyWorkersSchema = z.object({
  title: serviceNameRule.optional().or(z.literal('')),
  subTitle: serviceNameRule.optional().or(z.literal('')),
  radiusKm: z.number().min(1).max(50).optional(),
  limit: z.number().int().min(1).max(30).optional(),
});

export const howItWorksStepSchema = z.object({
  step: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  title: serviceNameRule,
  description: description,
  imageUrl: url,
});

export const howItWorksSchema = z.object({
  title: serviceNameRule.optional().or(z.literal('')),
  subTitle: serviceNameRule.optional().or(z.literal('')),
  steps: z.array(howItWorksStepSchema).length(3),
});

export const whyChooseItemSchema = z.object({
  icon: z.enum(Object.values(WHY_CHOOSE_ICON) as [string, ...string[]]),
  title: serviceNameRule,
  description: description,
  stat: z.string().min(1),
  imageUrl: url,
});

export const whyChooseSchema = z.object({
  title: serviceNameRule,
  subTitle: serviceNameRule,
  items: z.array(whyChooseItemSchema).length(4),
});

export const testimonialItemSchema = z.object({
  name: z.string().min(2).max(50),
  service: serviceNameRule,
  comment: description,
  imageUrl: url,
  date: z.string().min(1),
});

export const testimonialsSchema = z.object({
  title: serviceNameRule,
  items: z.array(testimonialItemSchema).length(3),
});

export const homeSectionFormSchema = z.discriminatedUnion('type', [
  z.object({ name: serviceNameRule, type: z.literal(HOME_SECTION_TYPE.HERO), data: heroSchema }),
  z.object({
    name: serviceNameRule,
    type: z.literal(HOME_SECTION_TYPE.CATEGORY_SHOWCASE),
    data: categoryShowcaseSchema,
  }),
  z.object({
    name: serviceNameRule,
    type: z.literal(HOME_SECTION_TYPE.BANNER),
    data: bannerSchema,
  }),
  z.object({
    name: serviceNameRule,
    type: z.literal(HOME_SECTION_TYPE.TOP_SERVICES),
    data: topServicesSchema,
  }),
  z.object({
    name: serviceNameRule,
    type: z.literal(HOME_SECTION_TYPE.NEARBY_WORKERS),
    data: nearbyWorkersSchema,
  }),
  z.object({
    name: serviceNameRule,
    type: z.literal(HOME_SECTION_TYPE.HOW_IT_WORKS),
    data: howItWorksSchema,
  }),
  z.object({
    name: serviceNameRule,
    type: z.literal(HOME_SECTION_TYPE.WHY_CHOOSE),
    data: whyChooseSchema,
  }),
  z.object({
    name: serviceNameRule,
    type: z.literal(HOME_SECTION_TYPE.TESTIMONIALS),
    data: testimonialsSchema,
  }),
]);

export type HomeSectionFormValues = z.infer<typeof homeSectionFormSchema>;
