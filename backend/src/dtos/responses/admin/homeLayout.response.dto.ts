import { Expose, Type } from "class-transformer";

import { HomeSectionType } from "@/constants/home";
import { IHomeLayoutEntity } from "@/types/home";

class SectionResponseDTO {
  @Expose()
  sectionId!: string;

  @Expose()
  order!: number;

  @Expose()
  sectionName!: string;

  @Expose()
  sectionType!: HomeSectionType;

  static fromEntity(entity: IHomeLayoutEntity): SectionResponseDTO {
    const dto = new SectionResponseDTO();
    dto.sectionId = entity.sectionId.toString();
    dto.order = entity.order;
    dto.sectionName = entity.name;
    dto.sectionType = entity.type;
    return dto;
  }
}

export class HomeLayoutResponseDTO {
  @Expose()
  @Type(() => SectionResponseDTO)
  sections!: SectionResponseDTO[];
  static fromEntity(entities: IHomeLayoutEntity[]): HomeLayoutResponseDTO {
    const dto = new HomeLayoutResponseDTO();
    dto.sections = entities.map((entity) => SectionResponseDTO.fromEntity(entity));
    return dto;
  }
}
