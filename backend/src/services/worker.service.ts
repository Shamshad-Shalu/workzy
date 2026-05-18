import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import {
  DEFAULT_WORKER_COVER_IMAGE,
  HTTPSTATUS,
  NOTIFICATION_TEMPLATES,
  ROLE,
  StripeAccountStatus,
  WORKER,
  WORKER_STATUS,
} from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { INotificationService } from "@/core/interfaces/services/INotificationService";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { VerifyWorkerRequestDTO } from "@/dtos/requests/admin/worker.verify.dto";
import { JoinUsDTO, ResubmitDocument } from "@/dtos/requests/joinUs.dto";
import { WorkerProfileRequestDto } from "@/dtos/requests/worker.profile.dto";
import { WorkerListResponseDto } from "@/dtos/responses/admin/worker.dto";
import { PublicWorkerListResponseDto } from "@/dtos/responses/worker/worker-public.response.dto";
import { NearbyWorkerResponseDTO } from "@/dtos/responses/worker/worker.nearby.response.dto";
import {
  WorkerDetailsResponseDto,
  WorkerProfileResponseDTO,
} from "@/dtos/responses/worker/worker.profile.dto";
import { CursorPaginatedResult, PaginatedResult } from "@/types/common/pagination";
import { IWorker } from "@/types/worker/worker.entity";
import {
  NearbyWorkerListQuery,
  PublicWorkerListQuery,
  WorkerListQuery,
} from "@/types/worker/worker.query";
import { WorkerDashboardAnalytics } from "@/types/worker/workerDashboard.types";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { extractKeyFromUrl } from "@/utils/upload";

@injectable()
export class WorkerService implements IWorkerService {
  constructor(
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service,
    @inject(TYPES.PaymentService) private _paymentservice: IPaymentService,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService
  ) {}

  getWorkerByUserId = async (userId: string): Promise<IWorker | null> => {
    return this._workerRepository.findOne({ userId });
  };

  // worker listing - admin side
  async listWorkers(query: WorkerListQuery): Promise<PaginatedResult<WorkerListResponseDto>> {
    const { data, total } = await this._workerRepository.listWorkers(query);
    return {
      data: await WorkerListResponseDto.fromEntities(data, this._s3Service),
      total,
    };
  }

  async listNearbyWorkers(query: NearbyWorkerListQuery): Promise<NearbyWorkerResponseDTO[]> {
    const workers = await this._workerRepository.listNearbyWorkers(query);
    return await NearbyWorkerResponseDTO.fromEntities(workers, this._s3Service);
  }

  async listPublicWorkers(
    serviceId: string,
    query: PublicWorkerListQuery
  ): Promise<CursorPaginatedResult<PublicWorkerListResponseDto>> {
    const { data, nextCursor } = await this._workerRepository.listPublicWorkers(serviceId, query);
    return {
      data: PublicWorkerListResponseDto.fromEntities(data),
      nextCursor,
    };
  }

  async getWorkerProfile(workerId: string): Promise<WorkerProfileResponseDTO> {
    const worker = await this._workerRepository.getWorkerProfile(workerId);
    if (!worker) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    return WorkerProfileResponseDTO.fromEntity(worker);
  }

  async getWorkerProfileDetails(workerId: string): Promise<WorkerDetailsResponseDto> {
    const worker = await this._workerRepository.findById(workerId);
    if (!worker) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    return await WorkerDetailsResponseDto.fromEntity(worker, this._s3Service);
  }

  async updateWorkerProfile(
    workerId: string,
    data: WorkerProfileRequestDto
  ): Promise<WorkerDetailsResponseDto> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);
    const { coverImage } = data;
    if (coverImage === DEFAULT_WORKER_COVER_IMAGE || coverImage === null) {
      data.coverImage = null;
    }
    const updatedWorker = await this._workerRepository.update(workerId, data);
    if (!updatedWorker) {
      throw new CustomError(WORKER.UPDATE_FAILED, HTTPSTATUS.BAD_REQUEST);
    }

    if (worker?.coverImage && coverImage !== worker.coverImage) {
      await this._s3Service.deleteFile(worker.coverImage);
    }
    return await WorkerDetailsResponseDto.fromEntity(updatedWorker, this._s3Service);
  }

  async updateWorkerPhone(workerId: string, phone: string): Promise<boolean> {
    const worker = await this._workerRepository.findByIdAndUpdate(workerId, { phone: phone });
    if (!worker) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    return true;
  }

  async updateProfileImage(workerId: string, url: string): Promise<string> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);

    const updateWorker = await this._workerRepository.update(workerId, { profileImage: url });
    if (!updateWorker?.profileImage) {
      throw new CustomError(WORKER.UPDATE_FAILED, HTTPSTATUS.BAD_REQUEST);
    }
    if (worker.profileImage?.includes("public/worker/profiles")) {
      await this._s3Service.deleteFile(worker.profileImage);
    }
    return updateWorker.profileImage;
  }

  async createWorkerProfile(userId: string, data: JoinUsDTO): Promise<WorkerProfileResponseDTO> {
    const isAlredyWorker = await this._workerRepository.findOne({ userId });
    if (isAlredyWorker) {
      throw new CustomError("Already Provided", HTTPSTATUS.BAD_REQUEST);
    }
    await getEntityOrThrow(this._userRepository, userId);
    const { document, ...rest } = data;
    const updates: Partial<IWorker> = { ...rest };
    const url = extractKeyFromUrl(document);

    updates.documents = [{ url, type: "id_proof" }];
    updates.userId = new Types.ObjectId(userId);
    const worker = await this._workerRepository.create({
      ...updates,
    });
    return WorkerProfileResponseDTO.fromEntity(worker);
  }

  async verifyWorker(
    workerId: string,
    data: VerifyWorkerRequestDTO
  ): Promise<WorkerProfileResponseDTO> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);
    const { status, docName, reason, docId } = data;
    const updates: Partial<IWorker> = {};
    const document = worker.documents.find((doc) => doc._id?.toString() === docId);
    if (!document) {
      throw new CustomError(WORKER.VERIFY_ERROR, HTTPSTATUS.BAD_REQUEST);
    }
    if (status === WORKER_STATUS.VERIFIED) {
      document.name = docName;
      document.status = "verified";
      updates.status = "verified";
    }
    if (status === WORKER_STATUS.NEEDS_REVISION) {
      document.rejectReason = reason;
      document.status = "rejected";
      updates.status = "needs_revision";
    }
    if (status === WORKER_STATUS.REJECTED) {
      document.rejectReason = reason;
      document.status = "rejected";
      updates.rejectReason = reason;
      updates.status = "rejected";
    }
    updates.documents = worker.documents.map((doc) =>
      doc._id?.toString() === docId ? document : doc
    );
    const updatedWorker = await this._workerRepository.findByIdAndUpdate(workerId, updates);
    if (!updatedWorker) {
      throw new CustomError(WORKER.VERIFY_ERROR);
    }
    if (status === WORKER_STATUS.VERIFIED) {
      await this._userRepository.findByIdAndUpdate(worker.userId.toString(), { role: ROLE.WORKER });
      void this._notificationService.createNotification(
        worker.userId.toString(),
        NOTIFICATION_TEMPLATES.WORKER_VERIFIED()
      );
    } else if (status === WORKER_STATUS.NEEDS_REVISION) {
      void this._notificationService.createNotification(
        worker.userId.toString(),
        NOTIFICATION_TEMPLATES.WORKER_REVISION(reason ?? "No reason provided")
      );
    } else if (status === WORKER_STATUS.REJECTED) {
      void this._notificationService.createNotification(
        worker.userId.toString(),
        NOTIFICATION_TEMPLATES.WORKER_REJECTED(reason ?? "No reason provided")
      );
    }
    return WorkerProfileResponseDTO.fromEntity(updatedWorker);
  }

  async reSubmitWorkerDocument(
    workerId: string,
    data: ResubmitDocument
  ): Promise<WorkerProfileResponseDTO> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);
    const { id, WorkerStatus, type, url } = data;

    if (!id) {
      throw new CustomError(WORKER.DOCUMENT_REQUIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const updates: Partial<IWorker> = {};

    const document = worker.documents.find((doc) => doc._id?.toString() === id);
    if (!document) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }

    await this._s3Service.deleteFile(document.url);

    updates.documents = worker.documents.map((doc) =>
      doc._id?.toString() === id
        ? {
            _id: doc._id,
            name: doc.name,
            type: type || doc.type,
            url: extractKeyFromUrl(url),
            status: "pending",
            rejectReason: undefined,
          }
        : doc
    );
    if (WorkerStatus) {
      updates.status = WorkerStatus;
    }
    const updatedWorker = await this._workerRepository.update(worker.id, updates);
    if (!updatedWorker) {
      throw new CustomError(WORKER.DOCUMENT_UPDATE_ERROR);
    }
    return WorkerProfileResponseDTO.fromEntity(updatedWorker);
  }

  async getStripeStatus(
    workerId: string
  ): Promise<{ status: StripeAccountStatus; stripeAccountId: string | null }> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);
    return {
      status: worker.stripeAccountStatus,
      stripeAccountId: worker.stripeAccountId ?? null,
    };
  }

  async connectStripe(workerId: string): Promise<string> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);

    if (worker.status !== WORKER_STATUS.VERIFIED) {
      throw new CustomError(WORKER.NOT_AVAILABLE, HTTPSTATUS.FORBIDDEN);
    }

    return this._paymentservice.createStripeConnectLink(worker);
  }

  async getWorkerDashboardAnalytics(workerId: string): Promise<WorkerDashboardAnalytics> {
    return await this._bookingRepository.getWorkerDashboardAnalytics(workerId);
  }
}
