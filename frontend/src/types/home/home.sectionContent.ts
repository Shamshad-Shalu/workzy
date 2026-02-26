// hero section types
export interface HeroSlide {
  categoryId: string;
  eyebrow: string;
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
}
export interface HeroContent {
  autoPlay: boolean;
  interval: number;
  slides: HeroSlide[];
}

// category showcase section types
export interface CategoryShowcaseContent {
  title: string;
  subTitle: string;
  categoryId: string;
  limit: number;
}

// top service section types
export interface TopServicesContent {
  title: string;
  subTitle: string;
  limit: number;
}

export interface NearbyWorkersContent {
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

export interface HowItWorksContent {
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

export interface WhyChooseContent {
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
  rating: number;
}

export interface TestimonialsContent {
  title: string;
  items: TestimonialItem[];
}

export interface BannerContent {
  categoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
}
