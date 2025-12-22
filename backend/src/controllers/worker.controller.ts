import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import { HTTPSTATUS, WORKER } from "@/constants";
import CustomError from "@/utils/customError";

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

  getMe = asyncHandler(async (req: any, res: Response): Promise<void> => {
    const userId = req.user._id;
    const worker = await this._workerService.getWorkerByUserId(userId);
    if (!worker) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const workerData = await this._workerService.getWorkerProfile(worker?._id?.toString());
    res.status(200).json(workerData);
  });

  updateWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;
    const updateData = req.body as WorkerProfileRequestDTO;
    const workerData = await this._workerService.updateWorkerProfile(
      workerId,
      updateData,
      req.file
    );
    res.status(200).json({ message: WORKER.UPDATE_SUCCESS, workerData });
  });

  createWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const file = req?.file;
    if (!file) return;
    const worker = await this._workerService.createWorkerProfile(userId, req.body, file);
    res.status(200).json({ message: WORKER.CREATE_SUCCES, worker });
  });

  reSubmitWorkerDocument = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const file = req.file;
    if (!file) {
      throw new CustomError(WORKER.DOCUMENT_REQUIRED);
    }
    const workerData = await this._workerService.reSubmitWorkerDocument(workerId, req.body, file);
    res.status(200).json({ message: WORKER.DOCUMENT_UPDATED, workerData });
  });
}
