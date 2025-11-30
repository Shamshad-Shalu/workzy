import { IProfileController } from "@/core/interfaces/controllers/IProfileController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import CustomError from "@/utils/customError";
import { AUTH, EMAIL, HTTPSTATUS } from "@/constants";
import { TYPES } from "@/di/types";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { ChangePasswordDTO } from "@/dtos/requests/profile.dto";
import validator from "validator";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IEmailService } from "@/core/interfaces/services/IEmailService";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.ProfileService) private _profileService: IProfileService,
    @inject(TYPES.OTPService) private _otpService: IOTPService,
    @inject(TYPES.EmailService) private _emailService: IEmailService
  ) {}

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

  changeEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) return;
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      throw new CustomError(EMAIL.INVALID, HTTPSTATUS.BAD_REQUEST);
    }
    await this._profileService.sentMail(userId, email);
    res.status(HTTPSTATUS.OK).json({ message: AUTH.OTP_SENT });
  });

  resentOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) return;
    const { type, value } = req.body;
    await this._profileService.resendOtp(userId, type, value);

    res.status(HTTPSTATUS.OK).json({ message: AUTH.OTP_RESENT });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) return;
    const { type, value, otp } = req.body;

    await this._otpService.verifyAndRetrieveUser(value, otp);

    await this._profileService.updateEmailOrPhone(userId, type, value);
    res.status(HTTPSTATUS.OK).json({ message: `${type} Updated successfully`, type, value });
  });
}
