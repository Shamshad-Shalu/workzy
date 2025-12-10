import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { injectable, inject } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { ROLE } from "@/constants";

@injectable()
export class AdminController implements IAdminController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {}

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
      page,
      totalPages,
    });
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    const message = await this._userService.toggleUserStatus(userId);

    res.status(200).json({ message });
  });
}
