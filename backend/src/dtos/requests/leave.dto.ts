import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateLeaveDTO {
  @Type(() => Date)
  @IsDate({ message: "date must be a valid date" })
  startDate!: Date;

  @Type(() => Date)
  @IsDate({ message: "date must be a valid date" })
  endDate!: Date;

  @IsOptional()
  @IsString()
  reason?: string;
}
