import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { LoginRequestDTO, RegisterRequestDTO } from "@/dtos/requests/auth.dto";
import { IAuthService } from "@/core/interfaces/services/IAuthService";
import { TYPES } from "@/di/types";
import CustomError from "@/utils/customError";
import { AUTH, CLIENT_URL, EMAIL, HTTPSTATUS, ROLE, Role, USER, WORKER } from "@/constants";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import logger from "@/config/logger";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "@/utils/cookieUtils";
import { generateAccessToken, verifyRefreshToken } from "@/utils/jwt.util";
import validator from "validator";
import { ITokenService } from "@/core/interfaces/services/ITokenService";
import redisClient from "@/config/redisClient";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { Profile } from "passport";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
    @inject(TYPES.OTPService) private otpService: IOTPService,
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.TokenService) private tokenService: ITokenService,
    @inject(TYPES.WorkerService) private workerService: IWorkerService
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

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.authService.login(req.body as LoginRequestDTO);

    const isBlocked = await this.authService.isUserBlocked(user._id);
    if (isBlocked) {
      res.status(HTTPSTATUS.FORBIDDEN).json({ message: USER.BLOCKED });
      return;
    }

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: user.role as Role });

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as Role,
      workerId: user.workerId,
    });

    res.status(HTTPSTATUS.OK).json({ message: AUTH.LOGIN_SUCCESS, accessToken, user });
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    clearRefreshTokenCookie(res);
    res.status(HTTPSTATUS.OK).json({ message: AUTH.LOGOUT_SUCCESS });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new CustomError(AUTH.NO_REFRESH_TOKEN, HTTPSTATUS.UNAUTHORIZED);
    }

    const decodedToken = verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      clearRefreshTokenCookie(res);
      throw new CustomError(AUTH.INVALID_TOKEN, HTTPSTATUS.FORBIDDEN);
    }

    const isBlocked = await redisClient.get(`blocked_user:${decodedToken.user._id}`);
    if (isBlocked) {
      res.status(HTTPSTATUS.FORBIDDEN).json({ message: USER.BLOCKED });
      return;
    }

    const { _id, role, name, email } = decodedToken.user;

    const user = await this.authService.getUserByRoleAndId(role, _id);
    if (!user) {
      clearRefreshTokenCookie(res);
      throw new CustomError(USER.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }

    const payload: any = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
    };

    let fullUser = user.toObject ? user.toObject() : user;

    if (role === ROLE.WORKER) {
      const worker = await this.workerService.getWorkerByUserId(user._id.toString());
      if (!worker) {
        clearRefreshTokenCookie(res);
        throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
      }
      const workerId = worker as { _id: string };
      payload["workerId"] = worker._id;
      fullUser = { ...fullUser, workerId: workerId._id.toString() };
    }

    const accessToken = generateAccessToken(payload);

    res.status(HTTPSTATUS.OK).json({ accessToken, user: fullUser });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      throw new CustomError(EMAIL.INVALID, HTTPSTATUS.BAD_REQUEST);
    }

    let user =  await this.authService.findUserByEmail(email);
    if (!user) {
      throw new CustomError(USER.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }

    await this.emailService.sendResetEmailWithToken(email);

    res.status(HTTPSTATUS.OK).json({ message: AUTH.FORGOT_PASS_EMAIL_SENT });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, token, password } = req.body;

    console.log(`email: ${email}, token: ${token}, password: ${password}`);
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!password || !strongPasswordRegex.test(password)) {
      throw new CustomError(AUTH.WEAK_PASSWORD, HTTPSTATUS.BAD_REQUEST);
    }

    const isValid = await this.tokenService.validateToken(email, token);
    if (!isValid) {
      throw new CustomError(AUTH.TOKEN_EXPIRED, HTTPSTATUS.BAD_REQUEST);
    }

    await this.authService.updatePassword(email, password);

    res.status(HTTPSTATUS.OK).json({ message: USER.PASSWORD_UPDATE_SUCCESS });
  });

  handleGoogleUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      return res.redirect(`${CLIENT_URL}/login`);
    }
    const googleProfile = req.user as unknown as Profile;

    const email = googleProfile.emails?.[0]?.value;
    if (!email) {
      throw new CustomError(AUTH.GOOGLE_NOT_PROVIDED, HTTPSTATUS.BAD_REQUEST);
    }

    const user = await this.authService.handleGoogleUser({
      googleId: googleProfile.id,
      email,
      name: googleProfile.displayName,
      profile: (googleProfile as any)._json?.picture || "",
    });

    const isBlocked = await this.authService.isUserBlocked(user._id.toString());
    if (isBlocked) {
      res.status(HTTPSTATUS.FORBIDDEN).json({ message: USER.BLOCKED });
      return;
    }

    setRefreshTokenCookie(res, { _id: user._id.toString(), role: "user" });
    // const accessToken = generateAccessToken({
    //   _id: user._id.toString(),
    //   email: user.email,
    //   name: user.name,
    //   role: user.role as Role,
    // });

    res.redirect(`${CLIENT_URL}/`);
  });
}
