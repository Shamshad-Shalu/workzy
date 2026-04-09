import { Expose } from "class-transformer";

import {
  CategoryAncestorEntity,
  CategoryLevelsEntity,
  CategoryListEntity,
  CategorySuggestionEntity,
  CategoryTrendingEntity,
  ServiceItemEntity,
} from "@/types/category";

type ObjectIdLike = { toString(): string };

type BaseCategoryEntity = {
  _id: { toString(): string };
  name: string;
  iconUrl: string;
  level: number;
  parentId?: ObjectIdLike | null;
};

type BaseCategoryDTOConstructor<T> = {
  new (): T;
  mapEntity: (entity: BaseCategoryEntity) => T;
  mapEntities: (entities: BaseCategoryEntity[]) => T[];
};

abstract class BaseCategoryDTO {
  id!: string;
  name!: string;
  iconUrl!: string;
  level!: number;
  parentId!: string | null;

  static mapEntity<T extends BaseCategoryDTO>(
    this: BaseCategoryDTOConstructor<T>,
    entity: BaseCategoryEntity
  ): T {
    const dto = new this();

    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.iconUrl = entity.iconUrl;
    dto.level = entity.level;
    dto.parentId = entity.parentId ? entity.parentId.toString() : null;
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

export class CategoryLiteDTO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() level!: number;
  @Expose() iconUrl!: string;

  static fromEntity(entity: CategoryLevelsEntity): CategoryLiteDTO {
    const dto = new CategoryLiteDTO();

    dto.id = entity._id.toString();
    dto.level = entity.level;
    dto.name = entity.name;
    dto.iconUrl = entity.iconUrl;

    return dto;
  }

  static fromEntities(entities: CategoryLevelsEntity[]): CategoryLiteDTO[] {
    return entities.map((entity) => CategoryLiteDTO.fromEntity(entity));
  }
}

export class CategoryAncestorResponseDTO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() level!: number;
  @Expose() parentId!: string | null;

  static fromEntity(entity: CategoryAncestorEntity): CategoryAncestorResponseDTO {
    const dto = new CategoryAncestorResponseDTO();

    dto.id = entity._id.toString();
    dto.level = entity.level;
    dto.name = entity.name;
    dto.parentId = entity?.parentId?.toString() || null;

    return dto;
  }

  static fromEntities(entities: CategoryAncestorEntity[]): CategoryAncestorResponseDTO[] {
    return entities.map((entity) => CategoryAncestorResponseDTO.fromEntity(entity));
  }
}

export class CategoryServicesResponseDTO {
  @Expose() id!: string;
  @Expose() name!: string;
  @Expose() description!: string;
  @Expose() imageUrl!: string;
  @Expose() iconUrl!: string;
  @Expose() baseRate!: number;

  static fromEntity(entity: ServiceItemEntity): CategoryServicesResponseDTO {
    const dto = new CategoryServicesResponseDTO();

    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.iconUrl = entity.iconUrl;
    dto.baseRate = entity.baseRate;

    return dto;
  }

  static fromEntities(entities: ServiceItemEntity[]): CategoryServicesResponseDTO[] {
    return entities.map((entity) => CategoryServicesResponseDTO.fromEntity(entity));
  }
}

export class PublicCategoryResponseDTO {
  id!: string;
  name!: string;
  description!: string;
  imageUrl!: string;
  iconUrl!: string;
  baseRate!: number;
  parentId!: string | null;

  static fromEntity(entity: CategoryListEntity): PublicCategoryResponseDTO {
    const dto = new PublicCategoryResponseDTO();
    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.iconUrl = entity.iconUrl;
    dto.baseRate = entity.baseRate;
    dto.parentId = entity.parentId ? entity.parentId.toString() : null;
    return dto;
  }

  static fromEntities(entities: CategoryListEntity[]): PublicCategoryResponseDTO[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
