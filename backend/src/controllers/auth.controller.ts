import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { IAuthService } from "@/core/interfaces/services/IAuthService";
import { TYPES } from "@/di/types";
import CustomError from "@/utils/customError";
import { AUTH, HTTPSTATUS, USER } from "@/constants";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IEmailService } from "@/core/interfaces/services/IEmailService";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.OTPService) private otpService: IOTPService,
    @inject(TYPES.EmailService) private emailService: IEmailService
  ) {}

  // Register a new user and send OTP to email
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData = req.body as RegisterRequestDTO;

    const existingUser = await this.authService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new CustomError(USER.EXISTS, HTTPSTATUS.BAD_REQUEST);
    }

    const otp = this.otpService.generateOTP();

    await this.emailService.sendOtpEmail(userData, otp);

    console.log({ user: userData.email, otp });

    res.status(HTTPSTATUS.OK).json({ message: AUTH.OTP_SENT });
  });
}
