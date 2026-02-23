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

export const HomeSectionsFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Hero', value: HOME_SECTION_TYPE.HERO },
  { label: 'Category Showcase', value: HOME_SECTION_TYPE.CATEGORY_SHOWCASE },
  { label: 'Banner', value: HOME_SECTION_TYPE.BANNER },
  { label: 'Top Services', value: HOME_SECTION_TYPE.TOP_SERVICES },
  { label: 'Nearby Workers', value: HOME_SECTION_TYPE.NEARBY_WORKERS },
  { label: 'How It Works', value: HOME_SECTION_TYPE.HOW_IT_WORKS },
  { label: 'Why Choose', value: HOME_SECTION_TYPE.WHY_CHOOSE },
  { label: 'Testimonials', value: HOME_SECTION_TYPE.TESTIMONIALS },
];

export const HOME_SECTION_TYPE_LABELS = Object.fromEntries(
  HomeSectionsFilterOptions.map(opt => [opt.value, opt.label])
) as Record<HomeSectionType | 'all', string>;
