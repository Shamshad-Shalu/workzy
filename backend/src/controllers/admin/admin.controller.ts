import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { injectable, inject } from "inversify";

import { HTTPSTATUS, Role, StripeAccountStatus, WORKER } from "@/constants";
import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { IAdminService } from "@/core/interfaces/services/IAdminService";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { VerifyWorkerRequestDTO } from "@/dtos/requests/admin/worker.verify.dto";
import { UserStatusFilter } from "@/types/user/user.query";
import { WorkerStatusFilter } from "@/types/worker/worker.query";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.UserService) private _userService: IUserService,
    @inject(TYPES.WorkerService) private _workerService: IWorkerService,
    @inject(TYPES.AdminService) private _adminService: IAdminService
  ) {}

  listUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as UserStatusFilter) || "all";
    const role = (req.query.role as Role | "all") || "all";

    const { data, total } = await this._userService.listUsers({
      page,
      limit,
      search,
      status,
      role,
    });
    res.status(HTTPSTATUS.OK).json({ users: data, total });
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const message = await this._userService.toggleUserStatus(userId);
    res.status(HTTPSTATUS.OK).json({ message });
  });

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

  verifyWorker = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const updatedWorker = await this._workerService.verifyWorker(
      workerId,
      req.body as VerifyWorkerRequestDTO
    );
    res.status(HTTPSTATUS.OK).json({ message: WORKER.VERIFIED, worker: updatedWorker });
  });

  getAdminDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this._adminService.getAdminDashboardAnalytics();  
    res.status(HTTPSTATUS.OK).json(stats);
  });
}
