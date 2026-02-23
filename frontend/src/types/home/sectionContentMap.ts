import type { HOME_SECTION_TYPE } from '@/constants';

import type {
  BannerContent,
  CategoryShowcaseContent,
  HeroContent,
  HowItWorksContent,
  NearbyWorkersContent,
  TestimonialsContent,
  TopServicesContent,
  WhyChooseContent,
} from './home.sectionContent';

export type SectionContentMap = {
  [HOME_SECTION_TYPE.HERO]: HeroContent;
  [HOME_SECTION_TYPE.CATEGORY_SHOWCASE]: CategoryShowcaseContent;
  [HOME_SECTION_TYPE.BANNER]: BannerContent;
  [HOME_SECTION_TYPE.TOP_SERVICES]: TopServicesContent;
  [HOME_SECTION_TYPE.NEARBY_WORKERS]: NearbyWorkersContent;
  [HOME_SECTION_TYPE.HOW_IT_WORKS]: HowItWorksContent;
  [HOME_SECTION_TYPE.WHY_CHOOSE]: WhyChooseContent;
  [HOME_SECTION_TYPE.TESTIMONIALS]: TestimonialsContent;
};
