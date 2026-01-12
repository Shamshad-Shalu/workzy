import { IProfileController } from "@/core/interfaces/controllers/IProfileController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import CustomError from "@/utils/customError";
import { AUTH, EMAIL, HTTPSTATUS, SERVER, USER } from "@/constants";
import { TYPES } from "@/di/types";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { ChangePasswordDTO, ProfileRequestDTO } from "@/dtos/requests/profile.dto";
import validator from "validator";
import { IOTPService } from "@/core/interfaces/services/IOTPService";

@injectable()
export class ProfileController implements IProfileController {
  constructor(
    @inject(TYPES.ProfileService) private _profileService: IProfileService,
    @inject(TYPES.OTPService) private _otpService: IOTPService
  ) {}

  uploadImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    const { url } = req.body;
    if (!userId || !url) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const imageUrl = await this._profileService.updateProfileImage(userId, url);
    res.status(HTTPSTATUS.OK).json({ url: imageUrl });
  });

  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }

    await this._profileService.updatePassword(userId, req.body as ChangePasswordDTO);
    res.status(HTTPSTATUS.OK).json({ message: AUTH.PASSWORD_UPDATED });
  });

  changeEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) {
      res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: AUTH.UNAUTHORIZED });
      return;
    }
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      throw new CustomError(EMAIL.INVALID, HTTPSTATUS.BAD_REQUEST);
    }
    await this._profileService.sentMail(userId, email);
    res.status(HTTPSTATUS.OK).json({ message: AUTH.OTP_SENT });
  });

  resentOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const { type, value } = req.body;
    await this._profileService.resendOtp(userId, type, value);

    res.status(HTTPSTATUS.OK).json({ message: AUTH.OTP_RESENT });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const { type, value, otp } = req.body;

    await this._otpService.verifyAndRetrieveUser(value, otp);

    await this._profileService.updateEmailOrPhone(userId, type, value);
    res.status(HTTPSTATUS.OK).json({ message: `${type} Updated successfully`, type, value });
  });

  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const user = await this._profileService.getProfile(userId);
    res.status(HTTPSTATUS.OK).json({ user });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const data = req.body as ProfileRequestDTO;
    const updateUser = await this._profileService.updateProfileBasic(userId, data);
    res.status(HTTPSTATUS.OK).json({ message: USER.PROFILE_SUCCESS, user: updateUser });
  });
}
