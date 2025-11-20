import { transporter } from "@/config/nodemailer";
import redisClient from "@/config/redisClient";
import { AUTH, CLIENT_URL, HTTPSTATUS, NODEMAILER_EMAIL } from "@/constants";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import { ITokenService } from "@/core/interfaces/services/ITokenService";
import { TYPES } from "@/di/types";
import { RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { otpEmailTemplate } from "@/templates/emails/otpEmailTemplate";
import { resetPasswordTemplate } from "@/templates/emails/resetPasswordTemplate";
import CustomError from "@/utils/customError";
import { inject, injectable } from "inversify";

@injectable()
export class EmailService implements IEmailService {
  constructor(@inject(TYPES.TokenService) private tokenService: ITokenService) {}

  async sendOtpEmail(userData: RegisterRequestDTO, otp: string): Promise<void> {
    const data = JSON.stringify({ userData, otp });
    const expiryTime = 15 * 60;
    await redisClient.set(`otp:${userData.email}`, data, { EX: expiryTime });
    try {
      await transporter.sendMail({
        from: NODEMAILER_EMAIL,
        to: userData.email,
        subject: "Your OTP for Verification - Workzy",
        html: otpEmailTemplate(otp),
      });
    } catch (error) {
      console.error(AUTH.FORGOT_PASS_EMAIL_FAILED, error);
      throw new CustomError(AUTH.FORGOT_PASS_EMAIL_FAILED, HTTPSTATUS.BAD_REQUEST);
    }
  }

  async sendResetEmailWithToken(email: string): Promise<void> {
    const token = this.tokenService.generateToken();
    const expiryTime = 15 * 60;

    await redisClient.set(`forgotPassword:${email}`, token, { EX: expiryTime });

    const resetLink = `${CLIENT_URL}/reset-password?token=${token}&email=${email}`;

    await this.sendResetEmail(email, resetLink);
  }

  async sendResetEmail(email: string, resetLink: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: NODEMAILER_EMAIL,
        to: email,
        subject: "Password Reset Request - Workzy",
        html: resetPasswordTemplate(resetLink),
      });
    } catch (error) {
      console.error(AUTH.FORGOT_PASS_EMAIL_FAILED, error);
      throw new CustomError(AUTH.FORGOT_PASS_EMAIL_FAILED, HTTPSTATUS.BAD_REQUEST);
    }
  }
}
