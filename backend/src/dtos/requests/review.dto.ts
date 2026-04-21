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

class MediaItemDTO {
  @IsUrl()
  url!: string;

  @IsIn(["image", "video"])
  type!: "image" | "video";
}

export class CreateReviewDTO {
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
  @Type(() => MediaItemDTO)
  @IsOptional()
  media?: MediaItemDTO[];
}

export class UpdateReviewDTO {
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
  @Type(() => MediaItemDTO)
  @IsOptional()
  media?: MediaItemDTO[];
}

export class ReviewReplyDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  // @Matches(DESCRIPTION_REGEX, { message: "Invalid review message format." })
  message!: string;
}
