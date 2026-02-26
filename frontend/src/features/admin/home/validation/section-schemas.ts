import z from 'zod';

import { HOME_SECTION_TYPE, WHY_CHOOSE_ICON } from '@/constants';
import {
  createDescriptionRule,
  descriptionRuleRequired,
  serviceNameRule,
} from '@/lib/validation/rules';

const mongoId = z
  .string()
  .min(1, 'Please select the category')
  .regex(/^[a-f\d]{24}$/i, 'Invalid MongoId');

const baseSchema = z.object({
  name: serviceNameRule,
});

const heroSlideSchema = z.object({
  categoryId: mongoId,
  eyebrow: serviceNameRule,
  title: serviceNameRule,
  subTitle: serviceNameRule,
  description: descriptionRuleRequired,
});

const heroDataSchema = z.object({
  autoPlay: z.boolean(),
  interval: z
    .number('Interval is required')
    .int()
    .min(1, 'Minimum 1 second')
    .max(30, 'Maximum 30 seconds')
    .transform(val => val * 1000),
  slides: z.array(heroSlideSchema).min(1).max(5),
});

const categoryShowcaseDataSchema = z.object({
  categoryId: mongoId,
  title: serviceNameRule,
  subTitle: createDescriptionRule('subTitle'),
  limit: z.number().int().min(1).max(10, 'only the 10 services will be showcased at max'),
});

const bannerDataSchema = z.object({
  categoryId: mongoId,
  title: serviceNameRule,
  description: createDescriptionRule('description'),
  imageUrl: z.string().min(1, 'image is required'),
  ctaText: z.string().optional(),
});

const topServicesDataSchema = z.object({
  title: serviceNameRule,
  subTitle: createDescriptionRule('subTitle'),
  limit: z.number().max(15, 'limit cant exceed 15').optional(),
});

const nearByWorkersDataSchema = z.object({
  title: serviceNameRule,
  subTitle: createDescriptionRule('subTitle'),
  radiusKm: z.number().min(2).max(50, 'pls provide something below 50'),
  limit: z.number().max(10, 'limit cant exceed 30').optional(),
});

const howItWorksStepSchema = z.object({
  step: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  title: serviceNameRule,
  description: descriptionRuleRequired,
  imageUrl: z.string().min(1, 'image is required'),
});

const howItWorksDataSchema = z.object({
  title: serviceNameRule,
  subTitle: serviceNameRule,
  steps: z.array(howItWorksStepSchema).length(3, 'Exactly 3 steps required'),
});

const whyChooseItemSchema = z.object({
  icon: z.enum(WHY_CHOOSE_ICON),
  title: serviceNameRule,
  description: descriptionRuleRequired,
  stat: z.string().min(1, 'stat is required'),
  imageUrl: z.string().min(1, 'image is required'),
});

const whyChooseDataSchema = z.object({
  title: serviceNameRule,
  subTitle: serviceNameRule,
  items: z.array(whyChooseItemSchema).length(4, 'Exactly 4 items required'),
});

const testimonialItemSchema = z.object({
  name: serviceNameRule,
  service: serviceNameRule,
  comment: descriptionRuleRequired,
  rating: z.number('rating is required').int().min(1).max(5),
  imageUrl: z.string().min(1, 'image is required'),
  date: z.string().min(1),
});

const testimonialsDataSchema = z.object({
  title: serviceNameRule,
  items: z.array(testimonialItemSchema).length(3, 'Exactly 3 items required'),
});

export const homeSectionSchema = z.discriminatedUnion('type', [
  baseSchema.extend({
    type: z.literal(HOME_SECTION_TYPE.HERO),
    data: heroDataSchema,
  }),
  baseSchema.extend({
    type: z.literal(HOME_SECTION_TYPE.CATEGORY_SHOWCASE),
    data: categoryShowcaseDataSchema,
  }),
  baseSchema.extend({
    type: z.literal(HOME_SECTION_TYPE.BANNER),
    data: bannerDataSchema,
  }),
  baseSchema.extend({
    type: z.literal(HOME_SECTION_TYPE.TOP_SERVICES),
    data: topServicesDataSchema,
  }),
  baseSchema.extend({
    type: z.literal(HOME_SECTION_TYPE.NEARBY_WORKERS),
    data: nearByWorkersDataSchema,
  }),
  baseSchema.extend({
    type: z.literal(HOME_SECTION_TYPE.HOW_IT_WORKS),
    data: howItWorksDataSchema,
  }),
  baseSchema.extend({
    type: z.literal(HOME_SECTION_TYPE.WHY_CHOOSE),
    data: whyChooseDataSchema,
  }),
  baseSchema.extend({
    type: z.literal(HOME_SECTION_TYPE.TESTIMONIALS),
    data: testimonialsDataSchema,
  }),
]);

export type HomeSectionFormData = z.infer<typeof homeSectionSchema>;
