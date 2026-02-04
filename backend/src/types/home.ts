import { Types } from "mongoose";

import { HomeSectionType, WhyChooseIcon } from "@/constants/home";
import { IHomeSection } from "@/models/homeSection.model";

export interface IHeroSlide {
  categoryId: Types.ObjectId;
  eyebrow: string; // badge label
  title: string; // categor.name or custom name ,
  subTitle: string;
  description: string; // categor.discription or custom discription ,
}

export interface IHeroSectionData {
  autoPlay: boolean;
  interval: number;
  slides: IHeroSlide[]; // only upto 5 limit max;
}

// "CATEGORY_SHOWCASE"
export interface ICategoryShowcaseData {
  categoryId: Types.ObjectId;
  title?: string;
  subTitle?: string;
  limit: number;
}
/* ================= BANNER ================= */

export interface IBannerSectionData {
  //   categoryId:Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
}

// "HOW_IT_WORKS"
export interface IHowItWorksStep {
  step: 1 | 2 | 3;
  title: string;
  description: string;
  imageUrl: string;
}

export interface IHowItWorksData {
  title?: string;
  subTitle?: string;
  steps: [IHowItWorksStep, IHowItWorksStep, IHowItWorksStep];
}

/* ================= WHY_CHOOSE ================= */
export interface IWhyChooseItem {
  icon: WhyChooseIcon;
  title: string;
  description: string;
  stat: string;
  imageUrl: string;
}

export interface IWhyChooseData {
  title: string;
  subTitle: string;
  items: [IWhyChooseItem, IWhyChooseItem, IWhyChooseItem, IWhyChooseItem];
}

/* ================= TESTIMONIALS ================= */

export interface ITestimonialItem {
  name: string;
  service: string;
  comment: string;
  imageUrl: string;
  date: string;
}

export interface ITestimonialsData {
  title: string;
  items: [ITestimonialItem, ITestimonialItem, ITestimonialItem];
}

// "NEARBY_WORKERS"
export interface INearbyWorkersData {
  title?: string;
  subTitle?: string;
  radiusKm?: number;
  limit?: number;
}

export interface ITopServicesData {
  title?: string;
  subTitle?: string;
  limit?: number;
}

export type HomeSectionDocument =
  | { type: "HERO"; data: IHeroSectionData }
  | { type: "CATEGORY_SHOWCASE"; data: ICategoryShowcaseData }
  | { type: "BANNER"; data: IBannerSectionData }
  | { type: "TOP_SERVICES"; data: ITopServicesData }
  | { type: "NEARBY_WORKERS"; data: INearbyWorkersData }
  | { type: "HOW_IT_WORKS"; data: IHowItWorksData }
  | { type: "WHY_CHOOSE"; data: IWhyChooseData }
  | { type: "TESTIMONIALS"; data: ITestimonialsData };

export type HomeSectionData = HomeSectionDocument["data"];

export type HomeSectionDataType =
  | IHeroSectionData
  | ICategoryShowcaseData
  | IBannerSectionData
  | ITopServicesData
  | INearbyWorkersData
  | IHowItWorksData
  | IWhyChooseData
  | ITestimonialsData;

export interface IHomeLayoutEntity {
  sectionId: Types.ObjectId;
  order: number;
  name: string;
  type: HomeSectionType;
}

export interface IHomeSectionWithOrder extends IHomeSection {
  order: number;
}

export interface IHeroSlideEnriched extends IHeroSlide {
  categoryImage: string;
}

export interface IHeroSectionDataEnriched {
  autoPlay: boolean;
  interval: number;
  slides: IHeroSlideEnriched[];
}
