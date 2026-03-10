import { Type } from "class-transformer";
import { IsDate, IsInt, IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateSlotDTO {
  @IsMongoId()
  workerId!: string;

  @IsMongoId()
  serviceId!: string;

  @Type(() => Date)
  @IsDate({ message: "date must be a valid date" })
  date!: Date;

  @IsString()
  startTime!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  itemCount?: number;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
}
