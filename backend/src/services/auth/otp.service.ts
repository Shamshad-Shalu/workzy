import crypto from "crypto";

import { inject, injectable } from "inversify";

import logger from "@/config/logger";
import redisClient from "@/config/redisClient";
import { AUTH, HTTPSTATUS } from "@/constants";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { TYPES } from "@/di/types";
import { RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import CustomError from "@/utils/customError";

@injectable()
export class OTPService implements IOTPService {
  constructor(@inject(TYPES.EmailService) private _emailService: IEmailService) {}

  // Generate a random 6-digit OTP
  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Resend OTP to the user's email
  async resendOtp(email: string): Promise<void> {
    const existingData = JSON.parse((await redisClient.get(`otp:${email}`)) as string);
    if (!existingData) {
      throw new CustomError(AUTH.OTP_EXPIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const newOtp = this.generateOTP();

    logger.info(`newOtp:${newOtp}`);

    await this._emailService.sendOtpEmail(existingData.userData, newOtp);
  }

  async verifyAndRetrieveUser(key: string, otp: string): Promise<RegisterRequestDTO> {
    const storedData = await redisClient.get(`otp:${key}`);
    if (!storedData) {
      throw new CustomError(AUTH.OTP_EXPIRED, HTTPSTATUS.BAD_REQUEST);
    }

    const { userData, otp: storedOTP } = JSON.parse(storedData);

    if (otp !== storedOTP) {
      throw new CustomError(AUTH.INVALID_OTP, HTTPSTATUS.BAD_REQUEST);
    }

    return userData;
  }
}
