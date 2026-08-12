import { Transform } from "class-transformer";
import { IsArray, IsDate, IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateQuoteDto {
  @IsMongoId()
  bookingId!: string;

  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((d: string | Date) => (d instanceof Date ? d : new Date(d)))
      : value
  )
  @IsDate({ each: true, message: "each date must be a valid date" })
  dates!: Date[];

  @IsNumber()
  @Min(60, { message: "Minimum extra charge amount is ₹60" })
  totalPrice!: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateQuoteDto {
  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((d: string | Date) => (d instanceof Date ? d : new Date(d)))
      : value
  )
  @IsDate({ each: true, message: "each date must be a valid date" })
  dates?: Date[];

  @IsNumber()
  @IsOptional()
  @Min(60, { message: "Minimum extra charge amount is ₹60" })
  totalPrice?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
