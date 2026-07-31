import { Type } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsMongoId,
  IsNumber,
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

import { DESCRIPTION_REGEX } from "@/constants";

class MediaItemDto {
  @IsUrl()
  url!: string;

  @IsIn(["image", "video"])
  type!: "image" | "video";
}

export class CreateReviewDto {
  @IsMongoId()
  bookingId!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number; // 1–5

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.reviewText !== undefined && o.reviewText !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid review text format." })
  reviewText?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  @IsOptional()
  media?: MediaItemDto[];
}

export class UpdateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  @Matches(DESCRIPTION_REGEX, { message: "Invalid review text format." })
  reviewText?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  @IsOptional()
  media?: MediaItemDto[];
}

export class ReviewReplyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  message!: string;
}
