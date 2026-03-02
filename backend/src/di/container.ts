import { Container } from "inversify";

import { AdminCategoryController } from "@/controllers/admin/admin-category.controller";
import { AdminController } from "@/controllers/admin/admin.controller";
import { AuthController } from "@/controllers/auth.controller";
import { CategoryController } from "@/controllers/category.controller";
import { HomeController } from "@/controllers/home.controller";
import { PlanController } from "@/controllers/plan.controller";
import { ProfileController } from "@/controllers/profile.controller";
import { ServiceController } from "@/controllers/service.controller";
import { SubscriptionController } from "@/controllers/subscription.controller";
import { UploadController } from "@/controllers/upload.controller";
import { WorkerController } from "@/controllers/worker.controller";
import { IAdminCategoryController } from "@/core/interfaces/controllers/admin/IAdminCategoryController";
import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { ICategoryController } from "@/core/interfaces/controllers/ICategoryController";
import { IHomeController } from "@/core/interfaces/controllers/IHomeController";
import { IPlanController } from "@/core/interfaces/controllers/IPlanController";
import { IProfileController } from "@/core/interfaces/controllers/IProfileController";
import { IServiceController } from "@/core/interfaces/controllers/IServiceController";
import { ISubscriptionController } from "@/core/interfaces/controllers/ISubscriptionController";
import { IUploadController } from "@/core/interfaces/controllers/IUploadController";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { IHomeLayoutRepository } from "@/core/interfaces/repositories/IHomeLayoutRepository";
import { IHomeSectionRepository } from "@/core/interfaces/repositories/IHomeSectionRepository";
import { IPlanRepository } from "@/core/interfaces/repositories/IPlanRepository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { ISubscriptionRepository } from "@/core/interfaces/repositories/ISubscriptionRepository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { ICategoryManagementService } from "@/core/interfaces/services/admin/ICategoryManagementService";
import { IAuthService } from "@/core/interfaces/services/IAuthService";
import { ICategoryService } from "@/core/interfaces/services/ICategoryService";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import { IHomeLayoutService } from "@/core/interfaces/services/IHomeLayoutService";
import { IHomeSectionService } from "@/core/interfaces/services/IHomeSectionService";
import { IHomeService } from "@/core/interfaces/services/IHomeService";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IPlanService } from "@/core/interfaces/services/IPlanService";
import { IProfileService } from "@/core/interfaces/services/IProfileService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IServiceManagement } from "@/core/interfaces/services/IServiceManagement";
import { ITokenService } from "@/core/interfaces/services/ITokenService";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { ISubscriptionService } from "@/core/interfaces/services/SubscriptionService";
import { CategoryRepository } from "@/repositories/category.repository";
import { HomeLayoutRepository } from "@/repositories/homeLayout..repository";
import { HomeSectionRepository } from "@/repositories/homeSection.repository";
import { PlanRepository } from "@/repositories/plan.repository";
import { ServiceRepository } from "@/repositories/service.repository";
import { SubscriptionRepository } from "@/repositories/subscription.repository";
import { UserRepository } from "@/repositories/user.repository";
import { WorkerRepository } from "@/repositories/worker.repository";
import { CategoryManagementService } from "@/services/admin/category-management.service";
import { HomeLayoutService } from "@/services/admin/home-layout.service";
import { HomeSectionService } from "@/services/admin/home-section.service";
import { AuthService } from "@/services/auth/auth.service";
import { EmailService } from "@/services/auth/email.service";
import { OTPService } from "@/services/auth/otp.service";
import { TokenService } from "@/services/auth/token.service";
import { CategoryService } from "@/services/category.service";
import { HomeService } from "@/services/home.service";
import { PlanService } from "@/services/plan.service";
import { ProfileService } from "@/services/profile.service";
import { S3Service } from "@/services/s3.service";
import { ServiceManagement } from "@/services/service-management.service";
import { SubscriptionService } from "@/services/subscription.service";
import { UserService } from "@/services/user.service";
import { WorkerService } from "@/services/worker.service";

import { TYPES } from "./types";

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

// categories
container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryRepository);
container.bind<ICategoryController>(TYPES.CategoryController).to(CategoryController);
container.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService);
container.bind<IAdminCategoryController>(TYPES.AdminCategoryController).to(AdminCategoryController);
container
  .bind<ICategoryManagementService>(TYPES.CategoryManagementService)
  .to(CategoryManagementService);

container.bind<IS3Service>(TYPES.S3Service).to(S3Service);
container.bind<IUploadController>(TYPES.UploadController).to(UploadController);

container.bind<IServiceController>(TYPES.ServiceController).to(ServiceController);
container.bind<IServiceManagement>(TYPES.ServiceManagement).to(ServiceManagement);
container.bind<IServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository);

container.bind<IHomeController>(TYPES.HomeController).to(HomeController);
container.bind<IHomeService>(TYPES.HomeService).to(HomeService);
container.bind<IHomeSectionService>(TYPES.HomeSectionService).to(HomeSectionService);
container.bind<IHomeLayoutService>(TYPES.HomeLayoutService).to(HomeLayoutService);
container.bind<IHomeLayoutRepository>(TYPES.HomeLayoutRepository).to(HomeLayoutRepository);
container.bind<IHomeSectionRepository>(TYPES.HomeSectionRepository).to(HomeSectionRepository);

container.bind<IPlanController>(TYPES.PlanController).to(PlanController);
container.bind<IPlanService>(TYPES.PlanService).to(PlanService);
container.bind<IPlanRepository>(TYPES.PlanRepository).to(PlanRepository);

container.bind<ISubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);
container.bind<ISubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService);
container.bind<ISubscriptionRepository>(TYPES.SubscriptionRepository).to(SubscriptionRepository);

export { container };
