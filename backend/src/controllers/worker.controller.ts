import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { AUTH, HTTPSTATUS, WORKER } from "@/constants";
import CustomError from "@/utils/customError";
import { JoinUsDTO, ResubmitDocument } from "@/dtos/requests/joinUs.dto";

@injectable()
export class WorkerController implements IWorkerController {
  constructor(@inject(TYPES.WorkerService) private _workerService: IWorkerService) {}

  getWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;
    const workerProfileDetails = await this._workerService.getWorkerProfile(workerId);
    res.status(200).json(workerProfileDetails);
  });

  getWorkerSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;

    const workerSummary = await this._workerService.getWorkerSummary(workerId);
    res.status(200).json(workerSummary);
  });

  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError(AUTH.INVALID_TOKEN);
    }
    const worker = await this._workerService.getWorkerByUserId(userId);
    if (!worker) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const workerData = await this._workerService.getWorkerProfile(worker?._id?.toString());
    res.status(200).json(workerData);
  });

  updateWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;
    const data = req.body as WorkerProfileRequestDTO;
    const workerData = await this._workerService.updateWorkerProfile(workerId, data);
    res.status(200).json({ message: WORKER.UPDATE_SUCCESS, workerData });
  });

  createWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const data = req.body as JoinUsDTO;

    const worker = await this._workerService.createWorkerProfile(userId, data);
    res.status(200).json({ message: WORKER.CREATE_SUCCES, worker });
  });

  reSubmitWorkerDocument = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const data = req.body as ResubmitDocument;
    const workerData = await this._workerService.reSubmitWorkerDocument(workerId, data);
    res.status(200).json({ message: WORKER.DOCUMENT_UPDATED, worker: workerData });
  });
}
