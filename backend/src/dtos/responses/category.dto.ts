import { CategorySuggestionEntity, CategoryTrendingEntity } from "@/types/category";
import { Expose } from "class-transformer";

type BaseCategoryEntity = {
  _id: { toString(): string };
  name: string;
  iconUrl: string;
  level: number;
};

type BaseCategoryDTOConstructor<T> = {
  new (): T;
  mapEntity: (entity: BaseCategoryEntity) => T;
  mapEntities: (entities: BaseCategoryEntity[]) => T[];
};

abstract class BaseCategoryDTO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() iconUrl!: string;
  @Expose() level!: number;

  static mapEntity<T extends BaseCategoryDTO>(
    this: BaseCategoryDTOConstructor<T>,
    entity: BaseCategoryEntity
  ): T {
    const dto = new this();

    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.iconUrl = entity.iconUrl;
    dto.level = entity.level;
    return dto;
  }
  static mapEntities<T extends BaseCategoryDTO>(
    this: BaseCategoryDTOConstructor<T>,
    entities: BaseCategoryEntity[]
  ): T[] {
    return entities.map((e) => this.mapEntity(e));
  }
}

export class CategorySuggestionResponseDTO extends BaseCategoryDTO {
  static fromEntity(entity: CategorySuggestionEntity) {
    return this.mapEntity(entity);
  }

  static fromEntities(entities: CategorySuggestionEntity[]) {
    return this.mapEntities(entities);
  }
}
export class CategoryTrendingResponseDTO extends BaseCategoryDTO {
  static fromEntity(entity: CategoryTrendingEntity) {
    return this.mapEntity(entity);
  }

  static fromEntities(entities: CategoryTrendingEntity[]) {
    return this.mapEntities(entities);
  }
}
