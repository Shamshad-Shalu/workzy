import { Type } from "class-transformer";
import { IsArray, IsInt, IsMongoId, Min, ValidateNested } from "class-validator";

class LayoutItemDTO {
  @IsMongoId()
  sectionId!: string;

  @IsInt()
  @Min(1)
  order!: number;
}

export class SaveLayoutDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LayoutItemDTO)
  items!: LayoutItemDTO[];
}
