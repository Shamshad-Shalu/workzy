import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { injectable, inject } from "inversify";

import { HTTPSTATUS, Role } from "@/constants";
import { IAdminUserController } from "@/core/interfaces/controllers/admin/IAdminUserController";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { TYPES } from "@/di/types";
import { UserStatusFilter } from "@/types/user/user.query";
import { ApiResponse } from "@/utils/apiResponse";

@injectable()
export class AdminUserController implements IAdminUserController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {}

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
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ users: data, total }));
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const message = await this._userService.toggleUserStatus(userId);
    res.status(HTTPSTATUS.OK).json(new ApiResponse(null, message));
  });

  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const user = await this._userService.getUserById(userId);
    res.status(HTTPSTATUS.OK).json(new ApiResponse(user));
  });

  getUserStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const stats = await this._userService.getUserStats(userId);
    res.status(HTTPSTATUS.OK).json(new ApiResponse(stats));
  });
}
