import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IReview, IReviewPopulated } from "@/types/review";
import { resolveS3Image } from "@/utils/s3.utils";

export class ReviewResponseDTO {
  id!: string;
  bookingId!: string;
  userId!: string;
  workerId!: string;
  serviceId!: string;
  categoryId!: string;
  rating!: number;
  reviewText?: string;
  media?: {
    url: string;
    type: "image" | "video";
  }[];
  reply?: {
    message: string;
    repliedAt: Date;
  };
  isEdited!: boolean;
  isHidden!: boolean;
  createdAt!: Date;

  static fromEntity(entity: IReview): ReviewResponseDTO {
    const dto = new ReviewResponseDTO();

    dto.id = entity._id.toString();
    dto.bookingId = entity.bookingId.toString();
    dto.userId = entity.userId.toString();
    dto.workerId = entity.workerId.toString();
    dto.serviceId = entity.serviceId.toString();
    dto.categoryId = entity.categoryId.toString();
    dto.rating = entity.rating;
    dto.reviewText = entity.reviewText;
    dto.media = entity.media;
    dto.reply = entity.reply;
    dto.isEdited = entity.isEdited;
    dto.isHidden = entity.isHidden;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static fromEntities(entities: IReview[]): ReviewResponseDTO[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

class ReviewBaseDTO {
  id!: string;
  bookingId!: string;
  serviceId!: string;
  category!: {
    id: string;
    name: string;
  };
  rating!: number;
  reviewText?: string;
  media?: {
    url: string;
    type: "image" | "video";
  }[];
  reply?: {
    message: string;
    repliedAt: Date;
  };
  isEdited!: boolean;
  createdAt!: Date;
  static baseMap(entity: IReviewPopulated): ReviewBaseDTO {
    const dto = new ReviewBaseDTO();

    dto.id = entity._id.toString();
    dto.bookingId = entity.bookingId._id.toString();
    dto.serviceId = entity.serviceId.toString();
    dto.category = {
      id: entity.categoryId.toString(),
      name: entity.bookingId.snapshot.category.name,
    };

    dto.rating = entity.rating;
    dto.reviewText = entity.reviewText;
    dto.media = entity.media;
    dto.reply = entity.reply;
    dto.isEdited = entity.isEdited;
    dto.createdAt = entity.createdAt;
    return dto;
  }
}

export class ReviewUserDTO extends ReviewBaseDTO {
  worker!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  static async fromEntity(entity: IReviewPopulated, s3Service: IS3Service): Promise<ReviewUserDTO> {
    const dto = new ReviewUserDTO();
    Object.assign(dto, ReviewUserDTO.baseMap(entity));
    const worker = entity.workerId;

    dto.worker = {
      id: worker._id.toString(),
      name: entity.bookingId.snapshot.worker.name,
      profileImage: worker.profileImage
        ? await resolveS3Image(worker.profileImage, s3Service)
        : undefined,
    };
    return dto;
  }
  static async fromEntities(
    entities: IReviewPopulated[],
    s3Service: IS3Service
  ): Promise<ReviewUserDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}

export class ReviewWorkerDTO extends ReviewBaseDTO {
  user!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  static async fromEntity(
    entity: IReviewPopulated,
    s3Service: IS3Service
  ): Promise<ReviewWorkerDTO> {
    const dto = new ReviewWorkerDTO();
    Object.assign(dto, ReviewWorkerDTO.baseMap(entity));
    const user = entity.userId;

    dto.user = {
      id: user._id.toString(),
      name: entity.bookingId.snapshot.user.name,
      profileImage: user.profileImage
        ? await resolveS3Image(user.profileImage, s3Service)
        : undefined,
    };
    return dto;
  }
  static async fromEntities(
    entities: IReviewPopulated[],
    s3Service: IS3Service
  ): Promise<ReviewWorkerDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}

export class ReviewAdminDTO extends ReviewBaseDTO {
  isHidden!: boolean;
  user!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  worker!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  static async fromEntity(
    entity: IReviewPopulated,
    s3Service: IS3Service
  ): Promise<ReviewAdminDTO> {
    const dto = new ReviewAdminDTO();
    Object.assign(dto, ReviewAdminDTO.baseMap(entity));
    const user = entity.userId;
    const worker = entity.workerId;
    const snapshot = entity.bookingId.snapshot;

    dto.isHidden = entity.isHidden;
    dto.worker = {
      id: worker._id.toString(),
      name: snapshot.worker.name,
      profileImage: worker.profileImage
        ? await resolveS3Image(worker.profileImage, s3Service)
        : undefined,
    };
    dto.user = {
      id: user._id.toString(),
      name: snapshot.user.name,
      profileImage: user.profileImage
        ? await resolveS3Image(user.profileImage, s3Service)
        : undefined,
    };
    return dto;
  }
  static async fromEntities(
    entities: IReviewPopulated[],
    s3Service: IS3Service
  ): Promise<ReviewAdminDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}

export class ReviewPublicDTO extends ReviewBaseDTO {
  user!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  static async fromEntity(
    entity: IReviewPopulated,
    s3Service: IS3Service
  ): Promise<ReviewPublicDTO> {
    const dto = new ReviewPublicDTO();
    Object.assign(dto, ReviewPublicDTO.baseMap(entity));
    const user = entity.userId;

    dto.user = {
      id: user._id.toString(),
      name: entity.bookingId.snapshot.user.name,
      profileImage: user.profileImage
        ? await resolveS3Image(user.profileImage, s3Service)
        : undefined,
    };
    return dto;
  }
  static async fromEntities(
    entities: IReviewPopulated[],
    s3Service: IS3Service
  ): Promise<ReviewPublicDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}
