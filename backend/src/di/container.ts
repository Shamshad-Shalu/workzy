import { Container } from "inversify";
import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { TYPES } from "./types";
import { AuthController } from "@/controllers/auth.controller";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IAuthService } from "@/core/interfaces/services/IAuthService";
import { AuthService } from "@/services/auth/auth.service";
import { UserRepository } from "@/repositories/user.repository";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { OTPService } from "@/services/auth/otp.service";
import { EmailService } from "@/services/auth/email.service";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import { ITokenService } from "@/core/interfaces/services/ITokenService";
import { TokenService } from "@/services/auth/token.service";

const container = new Container();

container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
// container.bind<IUserService>(TYPES.UserService).to(UserService);

container.bind<IOTPService>(TYPES.OTPService).to(OTPService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<ITokenService>(TYPES.TokenService).to(TokenService);

export { container };
