import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { injectable, inject } from "inversify";

import { HTTPSTATUS } from "@/constants";
import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { IAdminService } from "@/core/interfaces/services/IAdminService";
import { TYPES } from "@/di/types";

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject(TYPES.AdminService) private _adminService: IAdminService) {}
  getAdminDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this._adminService.getAdminDashboardAnalytics();
    res.status(HTTPSTATUS.OK).json(stats);
  });
}
