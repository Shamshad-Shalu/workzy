import { Expose, Type } from "class-transformer";

import { HomeSectionType, HOME_SECTION_TYPE } from "@/constants/home";
import { IHeroSectionDataEnriched, IHomeSectionWithOrder } from "@/types/home";
import {
  ICategoryShowcaseData,
  IBannerSectionData,
  ITopServicesData,
  INearbyWorkersData,
  IHowItWorksData,
  IWhyChooseData,
  ITestimonialsData,
} from "@/types/home";

// HERO SECTION
export class HeroSlideDTO {
  @Expose()
  categoryId!: string;

  @Expose()
  eyebrow!: string;

  @Expose()
  title!: string;

  @Expose()
  subTitle!: string;

  @Expose()
  description!: string;

  @Expose()
  imageUrl!: string;
}

export class HeroSectionDTO {
  @Expose()
  type!: HomeSectionType;

  @Expose()
  order!: number;

  @Expose()
  autoPlay!: boolean;

  @Expose()
  interval!: number;

  @Expose()
  @Type(() => HeroSlideDTO)
  slides!: HeroSlideDTO[];

  static fromEntity(section: IHomeSectionWithOrder): HeroSectionDTO {
    const data = section.data as IHeroSectionDataEnriched;

    const dto = new HeroSectionDTO();
    dto.type = section.type;
    dto.order = section.order;
    dto.autoPlay = data.autoPlay;
    dto.interval = data.interval;
    dto.slides = data.slides.map((slide) => {
      const slideDto = new HeroSlideDTO();
      slideDto.categoryId = slide.categoryId.toString();
      slideDto.eyebrow = slide.eyebrow;
      slideDto.title = slide.title;
      slideDto.subTitle = slide.subTitle;
      slideDto.description = slide.description;
      slideDto.imageUrl = slide.categoryImage;
      return slideDto;
    });

    return dto;
  }
}

// === CATEGORY_SHOWCASE SECTION ======
export class CategoryShowcaseSectionDTO {
  @Expose()
  type!: HomeSectionType;

  @Expose()
  order!: number;

  @Expose()
  categoryId!: string;

  @Expose()
  title?: string;

  @Expose()
  subTitle?: string;

  @Expose()
  limit!: number;

  static fromEntity(section: IHomeSectionWithOrder): CategoryShowcaseSectionDTO {
    const data = section.data as ICategoryShowcaseData;

    const dto = new CategoryShowcaseSectionDTO();
    dto.type = section.type;
    dto.order = section.order;
    dto.categoryId = data.categoryId.toString();
    dto.title = data.title;
    dto.subTitle = data.subTitle;
    dto.limit = data.limit;

    return dto;
  }
}

// ============= BANNER SECTION =============
export class BannerSectionDTO {
  @Expose()
  type!: HomeSectionType;

  @Expose()
  order!: number;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  imageUrl!: string;

  @Expose()
  ctaText?: string;

  static fromEntity(section: IHomeSectionWithOrder): BannerSectionDTO {
    const data = section.data as IBannerSectionData;

    const dto = new BannerSectionDTO();
    dto.type = section.type;
    dto.order = section.order;
    dto.title = data.title;
    dto.description = data.description;
    dto.imageUrl = data.imageUrl;
    dto.ctaText = data.ctaText;

    return dto;
  }
}

// ============= TOP_SERVICES SECTION =============
export class TopServicesSectionDTO {
  @Expose()
  type!: HomeSectionType;

  @Expose()
  order!: number;

  @Expose()
  title?: string;

  @Expose()
  subTitle?: string;

  @Expose()
  limit!: number;

  static fromEntity(section: IHomeSectionWithOrder): TopServicesSectionDTO {
    const data = section.data as ITopServicesData;

    const dto = new TopServicesSectionDTO();
    dto.type = section.type;
    dto.order = section.order;
    dto.title = data.title;
    dto.subTitle = data.subTitle;
    dto.limit = data.limit || 10;

    return dto;
  }
}

// ============= NEARBY_WORKERS SECTION =============
export class NearbyWorkersSectionDTO {
  @Expose()
  type!: HomeSectionType;

  @Expose()
  order!: number;

  @Expose()
  title?: string;

  @Expose()
  subTitle?: string;

  @Expose()
  radiusKm?: number;

  @Expose()
  limit?: number;

  static fromEntity(section: IHomeSectionWithOrder): NearbyWorkersSectionDTO {
    const data = section.data as INearbyWorkersData;

    const dto = new NearbyWorkersSectionDTO();
    dto.type = section.type;
    dto.order = section.order;
    dto.title = data.title;
    dto.subTitle = data.subTitle;
    dto.radiusKm = data.radiusKm;
    dto.limit = data.limit;

    return dto;
  }
}

// ============= HOW_IT_WORKS SECTION =============
export class HowItWorksStepDTO {
  @Expose()
  step!: number;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  imageUrl!: string;
}

export class HowItWorksSectionDTO {
  @Expose()
  type!: HomeSectionType;

  @Expose()
  order!: number;

  @Expose()
  title?: string;

  @Expose()
  subTitle?: string;

  @Expose()
  @Type(() => HowItWorksStepDTO)
  steps!: HowItWorksStepDTO[];

  static fromEntity(section: IHomeSectionWithOrder): HowItWorksSectionDTO {
    const data = section.data as IHowItWorksData;

    const dto = new HowItWorksSectionDTO();
    dto.type = section.type;
    dto.order = section.order;
    dto.title = data.title;
    dto.subTitle = data.subTitle;
    dto.steps = data.steps.map((step) => {
      const stepDto = new HowItWorksStepDTO();
      stepDto.step = step.step;
      stepDto.title = step.title;
      stepDto.description = step.description;
      stepDto.imageUrl = step.imageUrl;
      return stepDto;
    });

    return dto;
  }
}

// ============= WHY_CHOOSE SECTION =============
export class WhyChooseItemDTO {
  @Expose()
  icon!: string;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Expose()
  stat!: string;

  @Expose()
  imageUrl!: string;
}

export class WhyChooseSectionDTO {
  @Expose()
  type!: HomeSectionType;

  @Expose()
  order!: number;

  @Expose()
  title!: string;

  @Expose()
  subTitle!: string;

  @Expose()
  @Type(() => WhyChooseItemDTO)
  items!: WhyChooseItemDTO[];

  static fromEntity(section: IHomeSectionWithOrder): WhyChooseSectionDTO {
    const data = section.data as IWhyChooseData;

    const dto = new WhyChooseSectionDTO();
    dto.type = section.type;
    dto.order = section.order;
    dto.title = data.title;
    dto.subTitle = data.subTitle;
    dto.items = data.items.map((item) => {
      const itemDto = new WhyChooseItemDTO();
      itemDto.icon = item.icon;
      itemDto.title = item.title;
      itemDto.description = item.description;
      itemDto.stat = item.stat;
      itemDto.imageUrl = item.imageUrl;
      return itemDto;
    });

    return dto;
  }
}

// ============= TESTIMONIALS SECTION =============
export class TestimonialItemDTO {
  @Expose()
  name!: string;

  @Expose()
  service!: string;

  @Expose()
  comment!: string;

  @Expose()
  imageUrl!: string;

  @Expose()
  date!: string;
}

export class TestimonialsSectionDTO {
  @Expose()
  type!: HomeSectionType;

  @Expose()
  order!: number;

  @Expose()
  title!: string;

  @Expose()
  @Type(() => TestimonialItemDTO)
  items!: TestimonialItemDTO[];

  static fromEntity(section: IHomeSectionWithOrder): TestimonialsSectionDTO {
    const data = section.data as ITestimonialsData;

    const dto = new TestimonialsSectionDTO();
    dto.type = section.type;
    dto.order = section.order;
    dto.title = data.title;
    dto.items = data.items.map((item) => {
      const itemDto = new TestimonialItemDTO();
      itemDto.name = item.name;
      itemDto.service = item.service;
      itemDto.comment = item.comment;
      itemDto.imageUrl = item.imageUrl;
      itemDto.date = item.date;
      return itemDto;
    });

    return dto;
  }
}

// ============= UNION TYPE =============
export type HomePublicSectionDTO =
  | HeroSectionDTO
  | CategoryShowcaseSectionDTO
  | BannerSectionDTO
  | TopServicesSectionDTO
  | NearbyWorkersSectionDTO
  | HowItWorksSectionDTO
  | WhyChooseSectionDTO
  | TestimonialsSectionDTO;

// ============= MAIN RESPONSE =============
export class PublicHomeResponseDTO {
  @Expose()
  sections!: HomePublicSectionDTO[];

  static fromEntities(sections: IHomeSectionWithOrder[]): PublicHomeResponseDTO {
    const dtos = sections.map((section) => {
      switch (section.type) {
        case HOME_SECTION_TYPE.HERO:
          return HeroSectionDTO.fromEntity(section);

        case HOME_SECTION_TYPE.CATEGORY_SHOWCASE:
          return CategoryShowcaseSectionDTO.fromEntity(section);

        case HOME_SECTION_TYPE.BANNER:
          return BannerSectionDTO.fromEntity(section);

        case HOME_SECTION_TYPE.TOP_SERVICES:
          return TopServicesSectionDTO.fromEntity(section);

        case HOME_SECTION_TYPE.NEARBY_WORKERS:
          return NearbyWorkersSectionDTO.fromEntity(section);

        case HOME_SECTION_TYPE.HOW_IT_WORKS:
          return HowItWorksSectionDTO.fromEntity(section);

        case HOME_SECTION_TYPE.WHY_CHOOSE:
          return WhyChooseSectionDTO.fromEntity(section);

        case HOME_SECTION_TYPE.TESTIMONIALS:
          return TestimonialsSectionDTO.fromEntity(section);

        default:
          throw new Error(`Unknown section type: ${section.type}`);
      }
    });

    const response = new PublicHomeResponseDTO();
    response.sections = dtos;
    return response;
  }
}
