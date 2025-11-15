import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { IAuthService } from "@/core/interfaces/services/IAuthService";
import { TYPES } from "@/di/types";
import CustomError from "@/utils/customError";
import { AUTH, EMAIL, HTTPSTATUS, Role, USER } from "@/constants";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import logger from "@/config/logger";
import { setRefreshTokenCookie } from "@/utils/cookieUtils";
import { generateAccessToken } from "@/utils/jwt.util";
import validator from "validator";
import { ITokenService } from "@/core/interfaces/services/ITokenService";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.OTPService) private otpService: IOTPService,
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.TokenService) private tokenService: ITokenService
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

    logger.info(`user: ${userData.email} , otp:${otp}`);

    res.status(HTTPSTATUS.OK).json({ message: AUTH.OTP_SENT });
  });

  // Verify OTP and complete registration
  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const userData = await this.otpService.verifyAndRetrieveUser(email, otp);

    const user = await this.authService.register(userData);

    setRefreshTokenCookie(res, { _id: user._id, role: user.role as Role });

    const accessToken = generateAccessToken({ ...user });

    res.status(HTTPSTATUS.CREATED).json({ user, accessToken });
  });

  resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      throw new CustomError(EMAIL.INVALID, HTTPSTATUS.BAD_REQUEST);
    }

    await this.otpService.resendOtp(email);

    res.status(HTTPSTATUS.OK).json({ message: AUTH.OTP_RESENT });
  });
}
