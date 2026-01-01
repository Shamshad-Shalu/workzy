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
import { IUserService } from "@/core/interfaces/services/IUserService";
import { UserService } from "@/services/user.service";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { WorkerRepository } from "@/repositories/worker.repository";
import { WorkerService } from "@/services/worker.service";
import { IProfileController } from "@/core/interfaces/controllers/IProfileController";
import { ProfileController } from "@/controllers/profile.controller";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { ProfileService } from "@/services/profile.service";
import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { AdminController } from "@/controllers/admin/admin.controller";
import { IAdminServiceController } from "@/core/interfaces/controllers/admin/IAdminServiceController";
import { AdminServiceController } from "@/controllers/service.controller";
import { IServiceManagementService } from "@/core/interfaces/services/admin/IServiceManagementService";
import { ServiceManagementService } from "@/services/admin/serviceManagement.service";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { ServiceRepository } from "@/repositories/service.repository";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { WorkerController } from "@/controllers/worker.controller";
import { IUploadController } from "@/core/interfaces/controllers/IUploadController";
import { UploadController } from "@/controllers/upload.controller";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { S3Service } from "@/services/s3.service";

const container = new Container();

container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);

container.bind<IOTPService>(TYPES.OTPService).to(OTPService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<ITokenService>(TYPES.TokenService).to(TokenService);

container.bind<IWorkerRepository>(TYPES.WorkerRepository).to(WorkerRepository);
container.bind<IWorkerService>(TYPES.WorkerService).to(WorkerService);
container.bind<IWorkerController>(TYPES.WorkerController).to(WorkerController);

container.bind<IProfileController>(TYPES.ProfileController).to(ProfileController);
container.bind<IProfileService>(TYPES.ProfileService).to(ProfileService);

container.bind<IAdminController>(TYPES.AdminController).to(AdminController);

container.bind<IAdminServiceController>(TYPES.adminServiceController).to(AdminServiceController);
container
  .bind<IServiceManagementService>(TYPES.ServiceManagementService)
  .to(ServiceManagementService);
container.bind<IServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository);

container.bind<IS3Service>(TYPES.S3Service).to(S3Service);
container.bind<IUploadController>(TYPES.UploadController).to(UploadController);

export { container };
