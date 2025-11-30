import { IProfileController } from "@/core/interfaces/controllers/IProfileController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import CustomError from "@/utils/customError";
import { AUTH, HTTPSTATUS } from "@/constants";
import { TYPES } from "@/di/types";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { ChangePasswordDTO } from "@/dtos/requests/profile.dto";

@injectable()
export class ProfileController implements IProfileController {
  constructor(@inject(TYPES.ProfileService) private _profileService: IProfileService) {}

  uploadImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) return;
    if (!req.file) {
      throw new CustomError("Image not found", HTTPSTATUS.BAD_REQUEST);
    }
    const url = await this._profileService.updateProfileImage(userId, req.file);
    res.json({ url });
  });

  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) return;

    await this._profileService.updatePassword(userId, req.body as ChangePasswordDTO);
    res.status(HTTPSTATUS.OK).json({ message: AUTH.PASSWORD_UPDATED });
  });
}
