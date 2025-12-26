import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { injectable, inject } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { ROLE, WORKER } from "@/constants";
import { VerifyWorkerRequestDTO } from "@/dtos/requests/admin/worker.verify.dto";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.UserService) private _userService: IUserService,
    @inject(TYPES.WorkerService) private _workerService: IWorkerService
  ) {}

  getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";

    const { users, total } = await this._userService.getUsers(
      page,
      limit,
      search,
      status,
      ROLE.USER
    );

    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      total,
      totalPages,
    });
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const message = await this._userService.toggleUserStatus(userId);
    res.status(200).json({ message });
  });

  getAllWorkers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";
    const workerStatus = (req.query.workerStatus as string) || "all";

    const { workers, total } = await this._workerService.getAllWorkers(
      page,
      limit,
      search,
      status,
      workerStatus
    );

    res.json({
      workers,
      total,
    });
  });

  verifyWorker = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const updatedWorker = await this._workerService.verifyWorker(
      workerId,
      req.body as VerifyWorkerRequestDTO
    );
    res.status(200).json({ message: WORKER.VERIFIED, worker: updatedWorker });
  });
}
