export const HOME_SECTION_TYPE = {
  HERO: 'HERO',
  CATEGORY_SHOWCASE: 'CATEGORY_SHOWCASE',
  BANNER: 'BANNER',
  TOP_SERVICES: 'TOP_SERVICES',
  NEARBY_WORKERS: 'NEARBY_WORKERS',
  HOW_IT_WORKS: 'HOW_IT_WORKS',
  WHY_CHOOSE: 'WHY_CHOOSE',
  TESTIMONIALS: 'TESTIMONIALS',
} as const;

export type HomeSectionType = (typeof HOME_SECTION_TYPE)[keyof typeof HOME_SECTION_TYPE];

export const WHY_CHOOSE_ICON = {
  Shield: 'Shield',
  Star: 'Star',
  Clock: 'Clock',
  Award: 'Award',
} as const;

export type WhyChooseIcon = (typeof WHY_CHOOSE_ICON)[keyof typeof WHY_CHOOSE_ICON];
