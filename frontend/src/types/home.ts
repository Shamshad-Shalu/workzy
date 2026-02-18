import type { HOME_SECTION_TYPE, HomeSectionType } from '@/constants';

export interface SectionBase<T extends HomeSectionType> {
  type: T;
  order: number;
}

// hero section types
export interface HeroSlide {
  categoryId: string;
  eyebrow: string;
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
}

export interface HeroSection extends SectionBase<typeof HOME_SECTION_TYPE.HERO> {
  autoPlay: boolean;
  interval: number;
  slides: HeroSlide[];
}

export interface TopServicesSection extends SectionBase<typeof HOME_SECTION_TYPE.TOP_SERVICES> {
  title: string;
  subTitle: string;
  limit: number;
}

export interface NearbyWorkersSection extends SectionBase<typeof HOME_SECTION_TYPE.NEARBY_WORKERS> {
  title: string;
  subTitle: string;
  radiusKm: number;
  limit: number;
}

// how it works section
export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface HowItWorksSection extends SectionBase<typeof HOME_SECTION_TYPE.HOW_IT_WORKS> {
  title: string;
  subTitle: string;
  steps: HowItWorksStep[];
}

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
  stat: string;
  imageUrl: string;
}

export interface WhyChooseSection extends SectionBase<typeof HOME_SECTION_TYPE.WHY_CHOOSE> {
  title: string;
  subTitle: string;
  items: WhyChooseItem[];
}

export interface TestimonialItem {
  id?: string;
  name: string;
  service: string;
  comment: string;
  imageUrl: string;
  date: string;
}

export interface TestimonialsSection extends SectionBase<typeof HOME_SECTION_TYPE.TESTIMONIALS> {
  title: string;
  testimonials: TestimonialItem[];
}

export interface CategoryShowcaseSection
  extends SectionBase<typeof HOME_SECTION_TYPE.CATEGORY_SHOWCASE> {
  title: string;
  subTitle: string;
  categoryId: string;
  limit: number;
}

export interface BannerSection extends SectionBase<typeof HOME_SECTION_TYPE.BANNER> {
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
}

export type HomeSection =
  | HeroSection
  | CategoryShowcaseSection
  | BannerSection
  | TestimonialsSection
  | TopServicesSection
  | NearbyWorkersSection
  | HowItWorksSection
  | WhyChooseSection;

export interface HomeApiResponse {
  sections: HomeSection[];
}

// Worker types
export interface Worker {
  id: string;
  workerId: string;
  displayName: string;
  tagline: string;
  profileImage: string;
  experience: number;
  distance: string;

  completedJobs: number;
  verified: boolean;
}

export interface WorkersApiResponse {
  workers: Worker[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  // bookings?: string;
  subServices: { name: string; id: string }[];
}

export interface ServiceSuggestionApiResponse {
  services: ServiceItem[];
}
export interface TopServiceItem {
  categoryId: string;
  name: string;
  imageUrl: string;
  bookings?: number;
}

export interface TopServicesApiResponse {
  services: TopServiceItem[];
}
