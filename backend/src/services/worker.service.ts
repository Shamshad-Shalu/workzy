import { HTTPSTATUS, ROLE, SERVER, USER, WORKER, WORKER_STATUS } from "@/constants";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { WorkerProfileResponseDTO } from "@/dtos/responses/worker/worker.profile.dto";
import {
  WorkerAdditionalInfo,
  WorkerSummaryResponseDTO,
} from "@/dtos/responses/worker/worker.summery.dto";
import { DocumentType, IWorker, WorkerStatus } from "@/types/worker";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { inject, injectable } from "inversify";
import { deleteFromS3, uploadFileToS3 } from "./s3.service";
import CustomError from "@/utils/customError";
import mongoose, { FilterQuery } from "mongoose";
import { WorkerResponseDTO } from "@/dtos/responses/admin/worker.dto";
import { VerifyWorkerRequestDTO } from "@/dtos/requests/admin/worker.verify.dto";

@injectable()
export class WorkerService implements IWorkerService {
  constructor(
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository
  ) {}
  getWorkerByUserId = async (userId: string): Promise<IWorker | null> => {
    return this._workerRepository.findOne({ userId });
  };
  async getWorkerSummary(workerId: string): Promise<WorkerSummaryResponseDTO> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);

    const user = await getEntityOrThrow(
      this._userRepository,
      worker.userId.toString(),
      USER.NOT_FOUND
    );
    // dummy data for stats
    const WorkerAdditionalInfo: WorkerAdditionalInfo = {
      jobsCompleted: 123,
      averageRating: 4.9,
      completionRate: 90,
      rating: 4.2,
      reviewsCount: 450,
      responseTime: "2 hours",
    };
    return WorkerSummaryResponseDTO.format(worker, user, WorkerAdditionalInfo);
  }

  async getWorkerProfile(workerId: string): Promise<WorkerProfileResponseDTO> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);

    return await WorkerProfileResponseDTO.fromEntity(worker);
  }

  async updateWorkerProfile(
    workerId: string,
    data: WorkerProfileRequestDTO,
    file?: Express.Multer.File
  ): Promise<WorkerProfileResponseDTO> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);

    const updates: Partial<IWorker> = { ...data };

    if (file) {
      if (worker?.coverImage) {
        await deleteFromS3(worker.coverImage);
      }
      updates.coverImage = await uploadFileToS3(file, "public/worker/coverImages");
    }

    const updatedWorker = await this._workerRepository.update(workerId, updates);
    if (!updatedWorker) {
      throw new CustomError(WORKER.UPDATE_FAILED, HTTPSTATUS.BAD_REQUEST);
    }

    return WorkerProfileResponseDTO.fromEntity(updatedWorker);
  }

  async createWorkerProfile(
    userId: string,
    data: any,
    file: Express.Multer.File
  ): Promise<WorkerProfileResponseDTO> {
    const isAlredyWorker = await this._workerRepository.findOne({ userId });
    if (isAlredyWorker) {
      throw new CustomError("Already Provided", HTTPSTATUS.BAD_REQUEST);
    }
    await getEntityOrThrow(this._userRepository, userId);
    const updates: Partial<IWorker> = data;

    const url = await uploadFileToS3(file, "private/worker/documents");
    updates.documents = [{ url, type: "id_proof" }];
    updates.userId = new mongoose.Types.ObjectId(userId) as any;
    const worker = await this._workerRepository.create({
      ...updates,
    });
    return WorkerProfileResponseDTO.fromEntity(worker);
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
    const workerDtos = await WorkerResponseDTO.fromEntities(workers);

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
    return await WorkerResponseDTO.fromEntity(updatedWorker);
  }

  async reSubmitWorkerDocument(
    workerId: string,
    data: { id: string; WorkerStatus?: WorkerStatus; type?: DocumentType },
    file: Express.Multer.File
  ): Promise<WorkerProfileResponseDTO> {
    const worker = await getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND);
    const { id, WorkerStatus, type } = data;

    if (!id) {
      throw new CustomError(WORKER.DOCUMENT_REQUIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const updates: Partial<IWorker> = {};

    const newUrl = await uploadFileToS3(file, "private/worker/documents");

    const document = worker.documents.find((doc) => doc._id?.toString() === id);
    if (!document) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }

    await deleteFromS3(document.url);

    updates.documents = worker.documents.map((doc) =>
      doc._id?.toString() === id
        ? {
            _id: doc._id,
            name: doc.name,
            type: type || doc.type,
            url: newUrl,
            status: "pending",
            rejectReason: undefined,
          }
        : doc
    );
    if (WorkerStatus) {
      updates.status = WorkerStatus;
    }
    const updatedWorker = await this._workerRepository.findByIdAndUpdate(worker.id, updates);
    if (!updatedWorker) {
      throw new CustomError(WORKER.DOCUMENT_UPDATE_ERROR);
    }
    return await WorkerProfileResponseDTO.fromEntity(updatedWorker);
  }
}
