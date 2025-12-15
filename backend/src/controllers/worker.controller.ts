import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";

@injectable()
export class WorkerController implements IWorkerController {
  constructor(@inject(TYPES.WorkerService) private _workerService: IWorkerService) {}

  getWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;
    // const workerProfileDetails =
  });

  getWorkerSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;

    const workerSummary = await this._workerService.getWorkerSummary(workerId);
    res.status(200).json(workerSummary);
  });
}
