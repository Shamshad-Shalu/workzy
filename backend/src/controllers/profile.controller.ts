import { IProfileController } from "@/core/interfaces/controllers/IProfileController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import CustomError from "@/utils/customError";
import { HTTPSTATUS } from "@/constants";
import { TYPES } from "@/di/types";
import { IProfileService } from "@/core/interfaces/services/IProfileService";

@injectable()
export class ProfileController implements IProfileController {
  constructor(@inject(TYPES.ProfileService) private _profileService: IProfileService) {}

  uploadImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) return;
    if (!req.file) {
      throw new CustomError("", HTTPSTATUS.BAD_REQUEST);
    }
    const url = await this._profileService.updateProfileImage(userId, req.file);

    console.log("userurl", url);
    res.json({ url });
  });
}
