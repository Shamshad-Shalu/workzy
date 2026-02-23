import z from 'zod/v3';

import type { HomeSectionType } from '@/constants';

export const saveLayoutSchema = z.object({
  items: z
    .array(
      z.object({
        sectionId: z.string().min(1),
        order: z.number().int().min(1),
        sectionName: z.string(),
        sectionType: z.string() as z.ZodType<HomeSectionType>,
      })
    )
    .min(1, 'At least one section is required in the layout'),
});
