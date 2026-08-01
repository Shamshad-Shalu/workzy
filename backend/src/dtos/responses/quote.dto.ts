import { QuoteStatus } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IBookingSlot } from "@/types/booking/booking.entity";
import { QuoteListItem } from "@/types/quote/quote.projection";
import { resolveS3Url } from "@/utils/s3.utils";

export class QuoteListItemDto {
  id!: string;
  bookingId!: string;
  serviceId!: string;
  dates!: IBookingSlot[];
  totalPrice!: number;
  message?: string;
  status!: QuoteStatus;
  createdAt!: Date;
  worker!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  user!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  category!: {
    id: string;
    name: string;
    iconUrl: string;
  };

  static async fromEntity(entity: QuoteListItem, s3Service: IS3Service): Promise<QuoteListItemDto> {
    const dto = new QuoteListItemDto();

    dto.id = entity._id.toString();
    dto.bookingId = entity.bookingId.toString();
    dto.serviceId = entity.serviceId.toString();
    dto.dates = entity.dates;
    dto.totalPrice = entity.totalPrice;
    dto.message = entity.message;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;

    dto.user = {
      id: entity.userId._id.toString(),
      name: entity.userId.name,
      profileImage: await resolveS3Url(entity.userId.profileImage, s3Service),
    };
    dto.worker = {
      id: entity.workerId._id.toString(),
      name: entity.workerId.displayName,
      profileImage: entity.workerId.profileImage,
    };
    dto.category = {
      id: entity.categoryId._id.toString(),
      name: entity.categoryId.name,
      iconUrl: entity.categoryId.iconUrl,
    };

    return dto;
  }

  static async fromEntities(
    entities: QuoteListItem[],
    s3Service: IS3Service
  ): Promise<QuoteListItemDto[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}

export interface WorkerQuoteStatsDto {
  acceptRate: number;
  totalEarned: number;
  counts: {
    all: number;
    pending: number;
    accepted: number;
    rejected: number;
    expired: number;
  };
}
