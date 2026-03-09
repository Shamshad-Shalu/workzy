import { inject, injectable } from "inversify";
import mongoose, { FilterQuery } from "mongoose";

import {
  DEFAULT_WORKER_COVER_IMAGE,
  HTTPSTATUS,
  ROLE,
  SERVER,
  SERVICE,
  WORKER,
  WORKER_STATUS,
} from "@/constants";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { VerifyWorkerRequestDTO } from "@/dtos/requests/admin/worker.verify.dto";
import { JoinUsDTO, ResubmitDocument } from "@/dtos/requests/joinUs.dto";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { WorkerResponseDTO } from "@/dtos/responses/admin/worker.dto";
import { WorkerListingResponseDto } from "@/dtos/responses/worker/worker-listing.response.dto";
import { NearbyWorkerResponseDTO } from "@/dtos/responses/worker/worker.nearby.response.dto";
import { WorkerProfileResponseDTO } from "@/dtos/responses/worker/worker.profile.dto";
import { WorkerSummaryResponseDTO } from "@/dtos/responses/worker/worker.summery.dto";
import { IWorker, WorkerListingEntity, WorkerListingFilters } from "@/types/worker";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { extractKeyFromUrl } from "@/utils/upload";

@injectable()
export class WorkerService implements IWorkerService {
  constructor(
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}
  getWorkerByUserId = async (userId: string): Promise<IWorker | null> => {
    return this._workerRepository.findOne({ userId });
  };
  async getWorkerSummary(workerId: string): Promise<WorkerSummaryResponseDTO> {
    const worker = await this._workerRepository.getWorkerSummary(workerId);
    if (!worker) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    return WorkerSummaryResponseDTO.fromEntity(worker, this._s3Service);
  }

  async getWorkerProfile(workerId: string): Promise<WorkerProfileResponseDTO> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);

    return await WorkerProfileResponseDTO.fromEntity(worker, this._s3Service);
  }

  async updateWorkerProfile(
    workerId: string,
    data: WorkerProfileRequestDTO
  ): Promise<WorkerProfileResponseDTO> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);

    const { coverImage } = data;

    if (coverImage === DEFAULT_WORKER_COVER_IMAGE || coverImage === null) {
      data.coverImage = null;
    }

    if (worker?.coverImage && coverImage !== worker.coverImage) {
      await this._s3Service.deleteFile(worker.coverImage);
    }

    const updatedWorker = await this._workerRepository.update(workerId, data);
    if (!updatedWorker) {
      throw new CustomError(WORKER.UPDATE_FAILED, HTTPSTATUS.BAD_REQUEST);
    }
    return await WorkerProfileResponseDTO.fromEntity(updatedWorker, this._s3Service);
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
    updates.userId = new mongoose.Types.ObjectId(userId);
    const worker = await this._workerRepository.create({
      ...updates,
    });
    return WorkerProfileResponseDTO.fromEntity(worker, this._s3Service);
  }

  async getAllWorkers(
    page: number,
    limit: number,
    search: string,
    status: string,
    workerStatus: string
  ): Promise<{ workers: WorkerResponseDTO[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<IWorker> = {};
    if (search && search.trim() !== "") {
      query.displayName = { $regex: search, $options: "i" };
    }
    if (status && status !== "all") {
      const isBlocked = status === "blocked";
      const matchingUsers = await this._userRepository.find({ isBlocked });
      const userIds = matchingUsers.map((user) => user._id);
      query.userId = { $in: userIds };
    }
    if (workerStatus && workerStatus !== "all") {
      query.status = workerStatus;
    }

    const [workers, total] = await Promise.all([
      this._workerRepository.getAllWorkers(query, skip, limit),
      this._workerRepository.countDocuments(query),
    ]);
    if (!workers) {
      throw new CustomError(SERVER.ERROR, HTTPSTATUS.BAD_REQUEST);
    }
    const workerDtos = await WorkerResponseDTO.fromEntities(workers, this._s3Service);

    return { workers: workerDtos, total };
  }

  async verifyWorker(workerId: string, data: VerifyWorkerRequestDTO): Promise<WorkerResponseDTO> {
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
    }
    return await WorkerResponseDTO.fromEntity(updatedWorker, this._s3Service);
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
    return await WorkerProfileResponseDTO.fromEntity(updatedWorker, this._s3Service);
  }

  async getNearbyWorkers(
    lat: number,
    lng: number,
    radiusKm: number,
    limit: number
  ): Promise<NearbyWorkerResponseDTO[]> {
    const workers = await this._workerRepository.findNearbyWorkers(lat, lng, radiusKm, limit);
    return await NearbyWorkerResponseDTO.fromEntities(workers, this._s3Service);
  }

  async listWorkers(
    serviceId: string,
    data: WorkerListingFilters
  ): Promise<{ total: number; workers: WorkerListingResponseDto[] }> {
    if (!serviceId) {
      throw new CustomError(SERVICE.REQUIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const { lat, lng, radiusKm, ...rest } = data;
    let workersRaw: WorkerListingEntity[];
    let total: number;

    if (lat && lng && radiusKm) {
      ({ workersRaw, total } = await this._workerRepository.listWorkers(serviceId, {
        lat,
        lng,
        radiusKm,
        ...rest,
      }));
    } else {
      ({ workersRaw, total } = await this._serviceRepository.listWorkers(serviceId, data));
    }
    const workers = await WorkerListingResponseDto.fromEntities(workersRaw, this._s3Service);
    return { total, workers };
  }
}
