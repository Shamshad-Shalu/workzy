import { IPlan, IPlanPrice } from "@/types/plan";

export class PlanResponseDTO {
  id!: string;
  name!: string;
  description?: string;
  price!: IPlanPrice;
  isSpecialOffer!: boolean;
  isActive!: boolean;
  validFrom?: Date;
  validTill?: Date;
  createdAt!: Date;

  static fromEntity(entity: IPlan): PlanResponseDTO {
    const dto = new PlanResponseDTO();

    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.description = entity.description;
    dto.price = entity.price;
    dto.isActive = entity.isActive;
    dto.isSpecialOffer = entity.isSpecialOffer;
    dto.validFrom = entity.validFrom;
    dto.validTill = entity.validTill;
    dto.createdAt = entity.createdAt;

    return dto;
  }

  static fromEntities(entities: IPlan[]) {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
