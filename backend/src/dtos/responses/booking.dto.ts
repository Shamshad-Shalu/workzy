import {
  BookingPaymentStatus,
  BookingStatus,
  DEFAULT_IMAGE_URL,
  DEFAULT_WORKER_COVER_IMAGE,
} from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import {
  BookingCardEntity,
  BookingDetailsEntity,
  IBookingLocation,
  IBookingStatusHistory,
  IEvidence,
  IExtraCharge,
  PaginatedBookingsEntity,
} from "@/types/booking";

class WorkerInfoDTO {
  id!: string;
  displayName!: string;
  tagline!: string;
  coverImage!: string;
  profileImage!: string;
  averageRating!: number;
  isPremium!: boolean;

  static async fromEntity(
    entity: BookingCardEntity,
    s3Service: IS3Service
  ): Promise<WorkerInfoDTO> {
    const dto = new WorkerInfoDTO();

    const worker = entity.worker;
    const image = worker.profileImage;
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
    dto.isPremium = worker.isPremium;

    return dto;
  }
}

export class BookingCardResponseDTO {
  id!: string;
  bookingId!: string;
  date!: Date;
  startTime!: string;
  endTime!: string;
  duration!: number;
  addressLabel!: string | null;

  total!: number;
  status!: BookingStatus;
  paymentStatus!: BookingPaymentStatus;

  extraCharge?: IExtraCharge;
  evidence?: IEvidence;
  isReviewed!: boolean;
  statusHistory!: IBookingStatusHistory[];
  userNote?: string;
  workerNote?: string;
  adminNote?: string;

  worker!: WorkerInfoDTO;
  category!: {
    id: string;
    name: string;
    iconUrl: string;
  };
  user!: {
    id: string;
    name: string;
    profileImage: string;
  };

  static async fromEntity(
    entity: BookingCardEntity,
    s3Service: IS3Service
  ): Promise<BookingCardResponseDTO> {
    const dto = new BookingCardResponseDTO();

    dto.id = entity._id;
    dto.bookingId = entity.bookingId;
    dto.date = entity.date;
    dto.startTime = entity.startTime;
    dto.endTime = entity.endTime;
    dto.duration = entity.duration;
    dto.addressLabel = entity.address?.label ?? null;

    dto.total = entity.total;
    dto.status = entity.status;
    dto.paymentStatus = entity.paymentStatus;
    dto.extraCharge = entity.extraCharge;

    dto.evidence = entity.evidence;
    dto.isReviewed = entity.isReviewed ?? false;
    dto.statusHistory = entity.statusHistory;
    dto.userNote = entity.userNote;
    dto.workerNote = entity.workerNote;
    dto.adminNote = entity.adminNote;

    dto.worker = await WorkerInfoDTO.fromEntity(entity, s3Service);
    dto.user = {
      ...entity.user,
      id: entity.user._id.toString(),
      profileImage: entity.user.profileImage?.includes("private/user/profiles")
        ? await s3Service.generateSignedUrl(entity.user.profileImage)
        : (entity.user.profileImage ?? DEFAULT_IMAGE_URL),
    };
    dto.category = {
      ...entity.category,
      id: entity.category._id.toString(),
    };

    return dto;
  }
  static async fromEntities(
    entities: BookingCardEntity[],
    s3Service: IS3Service
  ): Promise<BookingCardResponseDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}

export class PaginatedBookingsDTO {
  data!: BookingCardResponseDTO[];
  cursor!: string | null;
  hasMore!: boolean;
  total?: number;

  static async fromResult(
    result: PaginatedBookingsEntity,
    s3Service: IS3Service
  ): Promise<PaginatedBookingsDTO> {
    const dto = new PaginatedBookingsDTO();

    dto.data = await BookingCardResponseDTO.fromEntities(result.data, s3Service);
    dto.cursor = result.cursor;
    dto.hasMore = result.hasMore;
    dto.total = result.total;

    return dto;
  }
}

export class BookingResponseDTO {
  id!: string;
  bookingId!: string;
  date!: Date;
  startTime!: string;
  endTime!: string;
  duration!: number;
  address!: IBookingLocation | null;

  rate!: number;
  itemCount!: number;
  subtotal!: number;
  discountPercent!: number;
  discountAmount!: number;
  chargeableAmount!: number;
  travelCost!: number;
  platformFeePercent!: number;
  platformFee!: number;
  total!: number;

  extraCharge?: IExtraCharge;
  evidence?: IEvidence;
  status!: BookingStatus;
  paymentStatus!: BookingPaymentStatus;
  statusHistory!: IBookingStatusHistory[];
  isReviewed!: boolean;
  userNote?: string;
  completedAt?: Date;

  category!: {
    id: string;
    name: string;
    iconUrl: string;
    imageUrl: string;
  };

  worker!: {
    id: string;
    displayName: string;
    tagline: string;
    profileImage: string;
    coverImage: string;
    isPremium: boolean;
    averageRating: number;
    reviewCount: number;
    worksCompleted: number;
  };

  user!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  static async fromEntity(
    entity: BookingDetailsEntity,
    s3Service: IS3Service
  ): Promise<BookingResponseDTO> {
    const dto = new BookingResponseDTO();

    dto.id = entity._id.toString();
    dto.bookingId = entity.bookingId;
    dto.date = entity.date;
    dto.startTime = entity.startTime;
    dto.endTime = entity.endTime;
    dto.duration = entity.duration;
    dto.address = entity.address;

    dto.rate = entity.rate;
    dto.itemCount = entity.itemCount;
    dto.subtotal = entity.subtotal;
    dto.discountPercent = entity.discountPercent;
    dto.discountAmount = entity.discountAmount;
    dto.chargeableAmount = entity.chargeableAmount;
    dto.travelCost = entity.travelCost;
    dto.platformFeePercent = entity.platformFeePercent;
    dto.platformFee = entity.platformFee;
    dto.total = entity.total;

    dto.extraCharge = entity.extraCharge;
    dto.evidence = entity.evidence;
    dto.paymentStatus = entity.paymentStatus;
    dto.status = entity.status;
    dto.statusHistory = entity.statusHistory;
    dto.isReviewed = entity.isReviewed;
    dto.userNote = entity.userNote;
    dto.completedAt = entity.completedAt;

    dto.user = {
      ...entity.user,
      id: entity.user._id.toString(),
      profileImage: entity.user.profileImage?.includes("private/user/profiles")
        ? await s3Service.generateSignedUrl(entity.user.profileImage)
        : (entity.user.profileImage ?? DEFAULT_IMAGE_URL),
    };
    dto.worker = {
      ...entity.worker,
      id: entity.worker._id.toString(),
      profileImage: entity.worker.profileImage?.includes("private/user/profiles")
        ? await s3Service.generateSignedUrl(entity.worker.profileImage)
        : (entity.worker.profileImage ?? DEFAULT_IMAGE_URL),
      coverImage: entity.worker.coverImage ?? DEFAULT_WORKER_COVER_IMAGE,
    };

    dto.category = {
      ...entity.category,
      id: entity.category._id.toString(),
    };
    return dto;
  }
}
