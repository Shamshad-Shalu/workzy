import {
  BookingPaymentStatus,
  BookingStatus,
  DEFAULT_IMAGE_URL,
  DEFAULT_WORKER_COVER_IMAGE,
} from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import {
  IBookingStatusHistory,
  IEvidence,
  IExtraCharge,
  PaginatedBookingsEntity,
  UserBookingEntity,
} from "@/types/booking";

class WorkerInfoDTO {
  id!: string;
  displayName!: string;
  tagline!: string;
  coverImage!: string;
  profileImage!: string;
  averageRating!: number;

  static async fromEntity(
    entity: UserBookingEntity,
    s3Service: IS3Service
  ): Promise<WorkerInfoDTO> {
    const dto = new WorkerInfoDTO();

    const worker = entity.workerId;
    const image = entity.userId.profileImage;
    const profileImage =
      image && image.includes("private/user/profiles")
        ? await s3Service.generateSignedUrl(image)
        : DEFAULT_IMAGE_URL;

    dto.id = worker._id.toString();
    dto.displayName = worker.displayName;
    dto.tagline = worker.tagline;
    dto.coverImage = worker.coverImage || DEFAULT_WORKER_COVER_IMAGE;
    dto.profileImage = profileImage;
    dto.averageRating = worker.averageRating;

    return dto;
  }
}

export class UserBookingResponseDTO {
  id!: string;
  bookingId!: string;
  date!: Date;
  startTime!: string;
  endTime!: string;
  duration!: number;
  addressLabel!: string;

  total!: number;
  status!: BookingStatus;
  paymentStatus!: BookingPaymentStatus;
  extraCharge?: IExtraCharge;

  worker!: WorkerInfoDTO;

  category!: {
    id: string;
    name: string;
    iconUrl: string;
  };

  evidence?: IEvidence;
  isReviewed!: boolean;
  statusHistory!: IBookingStatusHistory[];
  userNote?: string;

  static async fromEntity(
    entity: UserBookingEntity,
    s3Service: IS3Service
  ): Promise<UserBookingResponseDTO> {
    const dto = new UserBookingResponseDTO();

    dto.id = entity._id;
    dto.bookingId = entity.bookingId;
    dto.date = entity.date;
    dto.startTime = entity.startTime;
    dto.endTime = entity.endTime;
    dto.duration = entity.duration;
    dto.addressLabel = entity.address?.label ?? "";

    dto.total = entity.total;
    dto.status = entity.status;
    dto.paymentStatus = entity.paymentStatus;
    dto.extraCharge = entity.extraCharge;

    dto.worker = await WorkerInfoDTO.fromEntity(entity, s3Service);

    dto.evidence = entity.evidence;
    dto.isReviewed = entity.isReviewed ?? false;
    dto.statusHistory = entity.statusHistory;
    dto.userNote = entity.userNote;

    const category = entity.categoryId;
    dto.category = {
      id: category._id.toString(),
      name: category.name,
      iconUrl: category.iconUrl,
    };
    dto.category.id = category?._id.toString();
    dto.category.name = category.name;
    dto.category.iconUrl = category.iconUrl;

    return dto;
  }
  static async fromEntities(
    entities: UserBookingEntity[],
    s3Service: IS3Service
  ): Promise<UserBookingResponseDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}

export class PaginatedBookingsDTO {
  data!: UserBookingResponseDTO[];
  cursor!: string | null;
  hasMore!: boolean;
  total?: number;

  static async fromResult(
    result: PaginatedBookingsEntity,
    s3Service: IS3Service
  ): Promise<PaginatedBookingsDTO> {
    const dto = new PaginatedBookingsDTO();

    dto.data = await UserBookingResponseDTO.fromEntities(result.data, s3Service);
    dto.cursor = result.cursor;
    dto.hasMore = result.hasMore;
    dto.total = result.total;

    return dto;
  }
}
