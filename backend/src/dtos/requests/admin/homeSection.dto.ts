import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";

import { DESCRIPTION_REGEX, NAME_REGEX, SERVICE_NAME_REGEX } from "@/constants";
import {
  HOME_SECTION_TYPE,
  HomeSectionType,
  WHY_CHOOSE_ICON,
  WhyChooseIcon,
} from "@/constants/home";

//  ========================hero section ================================
class HeroSlideDTO {
  @IsMongoId()
  categoryId!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  eyebrow!: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title!: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid subTitle format." })
  subTitle!: string;

  @IsString()
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description!: string;
}

class HeroSectionDataDTO {
  @IsBoolean()
  autoPlay!: boolean;

  @IsInt()
  @Min(1000)
  @Max(30_000)
  interval!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroSlideDTO)
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  slides!: HeroSlideDTO[];
}

/* ================= CATEGORY_SHOWCASE ================= */

class CategoryShowcaseDataDTO {
  @IsMongoId()
  categoryId!: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title!: string;

  @IsOptional()
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid subTitle format." })
  subTitle?: string;

  @IsInt()
  @Min(1)
  @Max(20)
  limit!: number;
}
/* ====== BANNER ====== */
class BannerSectionDataDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title!: string;

  @IsString()
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description!: string;

  @IsString()
  @IsUrl()
  imageUrl!: string;

  @IsOptional()
  @IsString()
  ctaText?: string;
}
/* ======== HOW_IT_WORKS ======== */
class HowItWorksStepDTO {
  @IsInt()
  @Min(1)
  @Max(3)
  step!: 1 | 2 | 3;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title!: string;

  @IsString()
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description!: string;

  @IsString()
  @IsUrl()
  imageUrl!: string;
}

class HowItWorksDataDTO {
  @IsOptional()
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title?: string;

  @IsOptional()
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid subTitle format." })
  subTitle?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HowItWorksStepDTO)
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  steps!: HowItWorksStepDTO[];
}

/* ======= WHY_CHOOSE ======= */

class WhyChooseItemDTO {
  @IsEnum(WHY_CHOOSE_ICON)
  icon!: WhyChooseIcon;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title!: string;

  @IsString()
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description!: string;

  @IsString()
  @MinLength(1)
  stat!: string;

  @IsString()
  @IsUrl()
  imageUrl!: string;
}

class WhyChooseDataDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title!: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid subTitle format." })
  subTitle!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhyChooseItemDTO)
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  items!: WhyChooseItemDTO[];
}

/* ======== TESTIMONIALS ======== */

class TestimonialItemDTO {
  @IsString()
  @Matches(NAME_REGEX, { message: "Invalid Name format." })
  name!: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  service!: string;

  @IsString()
  @Matches(DESCRIPTION_REGEX, { message: "Invalid comment format." })
  comment!: string;

  @IsString()
  @IsUrl()
  imageUrl!: string;

  @IsString()
  @MinLength(1)
  date!: string;
}

class TestimonialsDataDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialItemDTO)
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  items!: TestimonialItemDTO[];
}

// NEARBY_WORKERS & TOP_SERVICES

class NearbyWorkersDataDTO {
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.title !== undefined && o.title !== "")
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.subTitle !== undefined && o.subTitle !== "")
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid subTitle format." })
  subTitle?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  radiusKm?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number;
}

class TopServicesDataDTO {
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.title !== undefined && o.title !== "")
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid title format." })
  title?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.subTitle !== undefined && o.subTitle !== "")
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid subTitle format." })
  subTitle?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  limit?: number;
}

export class HomeSectionRequestDTO {
  @IsString()
  @Matches(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
    message: "Invalid name format",
  })
  name!: string;

  @IsEnum(HOME_SECTION_TYPE, { message: "Invalid section type" })
  type!: HomeSectionType;

  @IsObject({ message: "data must be an object" })
  @ValidateNested()
  @Type((opts) => {
    const obj = opts?.object as HomeSectionRequestDTO;

    switch (obj.type) {
      case HOME_SECTION_TYPE.HERO:
        return HeroSectionDataDTO;
      case HOME_SECTION_TYPE.CATEGORY_SHOWCASE:
        return CategoryShowcaseDataDTO;
      case HOME_SECTION_TYPE.BANNER:
        return BannerSectionDataDTO;
      case HOME_SECTION_TYPE.TOP_SERVICES:
        return TopServicesDataDTO;
      case HOME_SECTION_TYPE.NEARBY_WORKERS:
        return NearbyWorkersDataDTO;
      case HOME_SECTION_TYPE.HOW_IT_WORKS:
        return HowItWorksDataDTO;
      case HOME_SECTION_TYPE.WHY_CHOOSE:
        return WhyChooseDataDTO;
      case HOME_SECTION_TYPE.TESTIMONIALS:
        return TestimonialsDataDTO;
    }
  })
  data!:
    | HeroSectionDataDTO
    | CategoryShowcaseDataDTO
    | BannerSectionDataDTO
    | TopServicesDataDTO
    | NearbyWorkersDataDTO
    | HowItWorksDataDTO
    | WhyChooseDataDTO
    | TestimonialsDataDTO;
}

export class HomeSectionUpdateRequestDTO extends HomeSectionRequestDTO {}
