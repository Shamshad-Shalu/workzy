import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { injectable, inject } from "inversify";

import { HTTPSTATUS, StripeAccountStatus, WORKER } from "@/constants";
import { IAdminWorkerController } from "@/core/interfaces/controllers/admin/IAdminWorkerController";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { WorkerReviewRequestDTO } from "@/dtos/requests/admin/worker-review.dto";
import { WorkerStatusFilter } from "@/types/worker/worker.query";

@injectable()
export class AdminWorkerController implements IAdminWorkerController {
  constructor(@inject(TYPES.WorkerService) private _workerService: IWorkerService) {}

  listWorkers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as WorkerStatusFilter) || "all";
    const stripStatus = (req.query.stripStatus as "all" | StripeAccountStatus) || "all";

    const { data, total } = await this._workerService.listWorkers({
      page,
      limit,
      search,
      status,
      stripStatus,
    });

    res.status(HTTPSTATUS.OK).json({
      workers: data,
      total,
    });
  });

  reviewWorker = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const data = req.body as WorkerReviewRequestDTO;
    const updatedWorker = await this._workerService.reviewWorker(workerId, data);
    res.status(HTTPSTATUS.OK).json({ message: WORKER.VERIFIED, worker: updatedWorker });
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const reason = req.body.reason;
    const message = await this._workerService.toggleWorkerStatus(workerId, reason);
    res.status(HTTPSTATUS.OK).json({ message });
  });
  getWorkerStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const stats = await this._workerService.getWorkerStats(workerId);
    res.status(HTTPSTATUS.OK).json(stats);
  });
}
