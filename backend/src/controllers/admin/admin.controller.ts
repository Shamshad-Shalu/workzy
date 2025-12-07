import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { injectable, inject } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { HTTPSTATUS, REDIS_EXPIRY, ROLE, USER } from "@/constants";
import CustomError from "@/utils/customError";
import redisClient from "@/config/redisClient";

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

    const user = await this._userService.getUserById(userId);
    if (!user) {
      throw new CustomError(USER.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    const newStatus = !user.isBlocked;

    await this._userService.updateUser(userId, { isBlocked: newStatus });

    if (newStatus) {
      await redisClient.set(`blocked_user:${user}`, 1, { EX: REDIS_EXPIRY });
      res.status(HTTPSTATUS.OK).json({ message: "User blocked successfully" });
    } else {
      await redisClient.del(`blocked_user:${userId}`);
      res.status(HTTPSTATUS.OK).json({ message: "User unblocked successfully" });
    }
  });
}
