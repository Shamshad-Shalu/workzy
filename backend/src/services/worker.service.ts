import { HTTPSTATUS, USER, WORKER } from "@/constants";
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
import { IWorker } from "@/types/worker";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { inject, injectable } from "inversify";
import { deleteFromS3, uploadFileToS3 } from "./s3.service";
import CustomError from "@/utils/customError";

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

    return WorkerProfileResponseDTO.fromEntity(worker);
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
}
