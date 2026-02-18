import { compare, hash } from "bcryptjs";
import { inject, injectable } from "inversify";
import validator from "validator";

import logger from "@/config/logger";
import redisClient from "@/config/redisClient";
import { AUTH, EMAIL, EMAIL_OTP_EXPIRY, HTTPSTATUS, USER } from "@/constants";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { ChangePasswordDTO, ProfileRequestDTO } from "@/dtos/requests/profile.dto";
import { UserProfileResponseDTO } from "@/dtos/responses/profile.dto";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { extractKeyFromUrl } from "@/utils/upload";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.OTPService) private _otpService: IOTPService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}
  async updateProfileImage(userId: string, url: string): Promise<string> {
    const user = await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);

    if (user.profileImage?.includes("private/user/profiles")) {
      await this._s3Service.deleteFile(user.profileImage);
    }
    const profileImage = extractKeyFromUrl(url);
    const updatedUser = await this._userRepository.update(user.id, { profileImage });
    if (!updatedUser?.profileImage) {
      throw new CustomError(USER.UPDATE_ERROR);
    }
    return await this._s3Service.generateSignedUrl(updatedUser.profileImage);
  }

  async updatePassword(userId: string, passwordDto: ChangePasswordDTO): Promise<boolean> {
    const { currentPassword, newPassword } = passwordDto;
    const user = await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new CustomError(AUTH.INVALID_PASSWORD, HTTPSTATUS.BAD_REQUEST);
    }
    const hashedPassword = await hash(newPassword, 10);
    await this._userRepository.updateOne({ _id: user.id }, { $set: { password: hashedPassword } });
    return true;
  }

  async requestChangePhone(userId: string, phone: string): Promise<boolean> {
    const user = await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);
    if (!validator.isMobilePhone(phone)) {
      throw new CustomError(AUTH.INVALID_INPUT, HTTPSTATUS.BAD_REQUEST);
    }
    const existing = await this._userRepository.findOne({ phone, _id: { $ne: userId } });
    if (existing) {
      throw new CustomError(AUTH.PHONE_BELONG_ANOTHER, HTTPSTATUS.BAD_REQUEST);
    }
    const otp = this._otpService.generateOTP();
    logger.info(`otp:${otp}`);
    await redisClient.set(`otp:${phone}`, JSON.stringify({ otp, phone }), { EX: EMAIL_OTP_EXPIRY });
    await this._emailService.sendEmail(user.email, otp);
    return true;
  }

  async requestChangeEmail(userId: string, email: string): Promise<boolean> {
    await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);

    const existing = await this._userRepository.findByEmail(email);
    if (existing && existing._id.toString() !== userId) {
      throw new CustomError(EMAIL.BELONG_ANOTHER, HTTPSTATUS.BAD_REQUEST);
    }

    const otp = this._otpService.generateOTP();
    logger.info(`otp:${otp}`);
    await redisClient.set(`otp:${email}`, JSON.stringify({ email, otp }), { EX: EMAIL_OTP_EXPIRY });
    await this._emailService.sendEmail(email, otp);
    return true;
  }

  async resendOtp(userId: string, type: "email" | "phone", value: string): Promise<boolean> {
    const user = await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);
    const existingData = JSON.parse((await redisClient.get(`otp:${value}`)) as string);
    if (!existingData) {
      throw new CustomError(AUTH.OTP_EXPIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const newOtp = this._otpService.generateOTP();
    logger.info(`newOtp:${newOtp}`);
    await redisClient.set(`otp:${value}`, JSON.stringify({ otp: newOtp, type: value }), {
      EX: EMAIL_OTP_EXPIRY,
    });

    if (type === "email") {
      if (!validator.isEmail(value)) {
        throw new CustomError(EMAIL.INVALID, HTTPSTATUS.BAD_REQUEST);
      }
      await this._emailService.sendEmail(value, newOtp);
    } else if (type === "phone") {
      if (!validator.isMobilePhone(value)) {
        throw new CustomError(AUTH.INVALID_INPUT, HTTPSTATUS.BAD_REQUEST);
      }
      await this._emailService.sendEmail(user.email, newOtp);
    }
    return true;
  }

  async updateEmailOrPhone(
    userId: string,
    type: "email" | "phone",
    value: string
  ): Promise<boolean> {
    const user = await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);
    if (type === "email") {
      await this._userRepository.updateOne({ _id: user._id }, { $set: { email: value } });
    } else {
      await this._userRepository.updateOne({ _id: user.id }, { $set: { phone: value } });
    }
    await redisClient.del(`otp:${value}`);
    return true;
  }

  async getProfile(userId: string): Promise<UserProfileResponseDTO> {
    const user = await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);
    return await UserProfileResponseDTO.fromEntity(user, this._s3Service);
  }
  async updateProfileBasic(
    userId: string,
    payload: ProfileRequestDTO
  ): Promise<UserProfileResponseDTO> {
    const updatedUser = await this._userRepository.update(userId, payload);
    if (!updatedUser) {
      throw new CustomError(USER.UPDATE_ERROR, HTTPSTATUS.BAD_REQUEST);
    }
    return UserProfileResponseDTO.fromEntity(updatedUser, this._s3Service);
  }
}
