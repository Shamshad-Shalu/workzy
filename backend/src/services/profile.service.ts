import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { TYPES } from "@/di/types";
import { inject, injectable } from "inversify";
import { generateSignedUrl, uploadFileToS3 } from "./s3.dservice";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";
import { compare, hash } from "bcryptjs";
import CustomError from "@/utils/customError";
import { AUTH, EMAIL, HTTPSTATUS, USER } from "@/constants";
import { ChangePasswordDTO, ProfileRequestDTO } from "@/dtos/requests/profile.dto";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import redisClient from "@/config/redisClient";
import validator from "validator";
import logger from "@/config/logger";
import { UserProfileResponseDTO } from "@/dtos/responses/profile.dto";
import { IS3Service } from "@/core/interfaces/services/IS3Service";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.OTPService) private _otpService: IOTPService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}
  async updateProfileImage(userId: string, file: Express.Multer.File): Promise<string> {
    const user = await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);
    if (user.profileImage?.includes(".amazonaws.com/")) {
      await this._s3Service.deleteFile(user.profileImage);
    }
    const newImage = await uploadFileToS3(file, "private/user/profiles");
    user.profileImage = newImage;
    await user.save();

    return await generateSignedUrl(newImage);
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

  async sentMail(userId: string, email: string): Promise<boolean> {
    await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);

    const existing = await this._userRepository.findByEmail(email);
    if (existing && existing._id.toString() !== userId) {
      throw new CustomError(EMAIL.BELONG_ANOTHER, HTTPSTATUS.BAD_REQUEST);
    }

    const otp = this._otpService.generateOTP();
    logger.info(`otp:${otp}`);
    await this._emailService.sendEmail(email, otp);
    return true;
  }

  async resendOtp(userId: string, type: "email" | "phone", value: string): Promise<boolean> {
    await getEntityOrThrow(this._userRepository, userId, USER.NOT_FOUND);
    const existingData = JSON.parse((await redisClient.get(`otp:${value}`)) as string);
    if (!existingData) {
      throw new CustomError(AUTH.OTP_EXPIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const newOtp = this._otpService.generateOTP();
    logger.info(`newOtp:${newOtp}`);

    if (type === "email") {
      if (!validator.isEmail(value)) {
        throw new CustomError(EMAIL.INVALID, HTTPSTATUS.BAD_REQUEST);
      }
      await this._emailService.sendEmail(value, newOtp);
    } else {
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
