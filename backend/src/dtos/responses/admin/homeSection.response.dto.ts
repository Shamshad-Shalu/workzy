import { Expose } from "class-transformer";

import { HomeSectionType } from "@/constants/home";
import { IHomeSection } from "@/models/homeSection.model";

export class HomeSectionResponseDTO {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  type!: HomeSectionType;

  @Expose()
  data!: unknown;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  static fromEntity(entity: IHomeSection): HomeSectionResponseDTO {
    const dto = new HomeSectionResponseDTO();
    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.type = entity.type;
    dto.isActive = entity.isActive;
    dto.data = entity.data;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static fromEntities(entities: IHomeSection[]): HomeSectionResponseDTO[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
