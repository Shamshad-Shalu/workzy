import { Container } from "inversify";

import { AdminBookingController } from "@/controllers/admin/admin-booking.controller";
import { AdminCategoryController } from "@/controllers/admin/admin-category.controller";
import { AdminController } from "@/controllers/admin/admin.controller";
import { AuthController } from "@/controllers/auth.controller";
import { BookingController } from "@/controllers/booking.controller";
import { CategoryController } from "@/controllers/category.controller";
import { HomeController } from "@/controllers/home.controller";
import { LeaveController } from "@/controllers/leave.controller";
import { PaymentController } from "@/controllers/payment.controller";
import { ReviewController } from "@/controllers/review.controller";
import { ServiceController } from "@/controllers/service.controller";
import { SlotController } from "@/controllers/slot.controller";
import { UploadController } from "@/controllers/upload.controller";
import { UserController } from "@/controllers/user.controller";
import { WorkerController } from "@/controllers/worker.controller";
import { IAdminBookingController } from "@/core/interfaces/controllers/admin/IAdminBookingController";
import { IAdminCategoryController } from "@/core/interfaces/controllers/admin/IAdminCategoryController";
import { IAdminController } from "@/core/interfaces/controllers/admin/IAdminController";
import { IAuthController } from "@/core/interfaces/controllers/IAuthController";
import { IBookingController } from "@/core/interfaces/controllers/IBookingController";
import { ICategoryController } from "@/core/interfaces/controllers/ICategoryController";
import { IHomeController } from "@/core/interfaces/controllers/IHomeController";
import { ILeaveController } from "@/core/interfaces/controllers/ILeaveController";
import { IPaymentController } from "@/core/interfaces/controllers/IPaymentController";
import { IReviewController } from "@/core/interfaces/controllers/IReviewController";
import { IServiceController } from "@/core/interfaces/controllers/IServiceController";
import { ISlotController } from "@/core/interfaces/controllers/ISlotController";
import { IUploadController } from "@/core/interfaces/controllers/IUploadController";
import { IUserController } from "@/core/interfaces/controllers/IUserController";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { IHomeLayoutRepository } from "@/core/interfaces/repositories/IHomeLayoutRepository";
import { IHomeSectionRepository } from "@/core/interfaces/repositories/IHomeSectionRepository";
import { ILeaveRepository } from "@/core/interfaces/repositories/ILeaveRepository";
import { IPaymentRepository } from "@/core/interfaces/repositories/IPaymentRepository";
import { IReviewRepository } from "@/core/interfaces/repositories/IReviewRepository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IAdminBookingService } from "@/core/interfaces/services/admin/IAdminBookingService";
import { ICategoryManagementService } from "@/core/interfaces/services/admin/ICategoryManagementService";
import { IAuthService } from "@/core/interfaces/services/IAuthService";
import { IBookingService } from "@/core/interfaces/services/IBookingService";
import { ICategoryService } from "@/core/interfaces/services/ICategoryService";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import { IHomeLayoutService } from "@/core/interfaces/services/IHomeLayoutService";
import { IHomeSectionService } from "@/core/interfaces/services/IHomeSectionService";
import { IHomeService } from "@/core/interfaces/services/IHomeService";
import { ILeaveService } from "@/core/interfaces/services/ILeaveService";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { IRedisService } from "@/core/interfaces/services/IRedisService";
import { IReviewService } from "@/core/interfaces/services/IReviewService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IServiceManagement } from "@/core/interfaces/services/IServiceManagement";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { ITokenService } from "@/core/interfaces/services/ITokenService";
import { IUserService } from "@/core/interfaces/services/IUserService";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { BookingRepository } from "@/repositories/booking.repository";
import { CategoryRepository } from "@/repositories/category.repository";
import { HomeLayoutRepository } from "@/repositories/homeLayout..repository";
import { HomeSectionRepository } from "@/repositories/homeSection.repository";
import { LeaveRepository } from "@/repositories/leave.repository";
import { PaymentRepository } from "@/repositories/payment.repository";
import { ReviewRepository } from "@/repositories/review.repository";
import { ServiceRepository } from "@/repositories/service.repository";
import { SlotRepository } from "@/repositories/slot.repository";
import { UserRepository } from "@/repositories/user.repository";
import { WorkerRepository } from "@/repositories/worker.repository";
import { AdminBookingService } from "@/services/admin/booking.service";
import { CategoryManagementService } from "@/services/admin/category-management.service";
import { HomeLayoutService } from "@/services/admin/home-layout.service";
import { HomeSectionService } from "@/services/admin/home-section.service";
import { AuthService } from "@/services/auth/auth.service";
import { EmailService } from "@/services/auth/email.service";
import { OTPService } from "@/services/auth/otp.service";
import { TokenService } from "@/services/auth/token.service";
import { BookingService } from "@/services/booking.service";
import { CategoryService } from "@/services/category.service";
import { HomeService } from "@/services/home.service";
import { LeaveService } from "@/services/leave.service";
import { PaymentService } from "@/services/payment.service";
import { RedisService } from "@/services/redis.service";
import { ReviewService } from "@/services/review.service";
import { S3Service } from "@/services/s3.service";
import { ServiceManagement } from "@/services/service-management.service";
import { SlotService } from "@/services/slot.service";
import { UserService } from "@/services/user.service";
import { WorkerService } from "@/services/worker.service";

import { TYPES } from "./types";

const container = new Container();

container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserController>(TYPES.UserController).to(UserController);

container.bind<IOTPService>(TYPES.OTPService).to(OTPService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<ITokenService>(TYPES.TokenService).to(TokenService);

container.bind<IWorkerRepository>(TYPES.WorkerRepository).to(WorkerRepository);
container.bind<IWorkerService>(TYPES.WorkerService).to(WorkerService);
container.bind<IWorkerController>(TYPES.WorkerController).to(WorkerController);

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

container.bind<IRedisService>(TYPES.RedisService).to(RedisService);

container.bind<IServiceController>(TYPES.ServiceController).to(ServiceController);
container.bind<IServiceManagement>(TYPES.ServiceManagement).to(ServiceManagement);
container.bind<IServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository);

container.bind<IHomeController>(TYPES.HomeController).to(HomeController);
container.bind<IHomeService>(TYPES.HomeService).to(HomeService);
container.bind<IHomeSectionService>(TYPES.HomeSectionService).to(HomeSectionService);
container.bind<IHomeLayoutService>(TYPES.HomeLayoutService).to(HomeLayoutService);
container.bind<IHomeLayoutRepository>(TYPES.HomeLayoutRepository).to(HomeLayoutRepository);
container.bind<IHomeSectionRepository>(TYPES.HomeSectionRepository).to(HomeSectionRepository);

container.bind<IPaymentController>(TYPES.PaymentController).to(PaymentController);
container.bind<IPaymentRepository>(TYPES.PaymentRepository).to(PaymentRepository);
container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);

container.bind<ISlotController>(TYPES.SlotController).to(SlotController);
container.bind<ISlotService>(TYPES.SlotService).to(SlotService);
container.bind<ISlotRepository>(TYPES.SlotRepository).to(SlotRepository);

container.bind<ILeaveController>(TYPES.LeaveController).to(LeaveController);
container.bind<ILeaveService>(TYPES.LeaveService).to(LeaveService);
container.bind<ILeaveRepository>(TYPES.LeaveRepository).to(LeaveRepository);

container.bind<IBookingController>(TYPES.BookingController).to(BookingController);
container.bind<IBookingService>(TYPES.BookingService).to(BookingService);
container.bind<IBookingRepository>(TYPES.BookingRepository).to(BookingRepository);

container.bind<IReviewController>(TYPES.ReviewController).to(ReviewController);
container.bind<IReviewService>(TYPES.ReviewService).to(ReviewService);
container.bind<IReviewRepository>(TYPES.ReviewRepository).to(ReviewRepository);

container.bind<IAdminBookingController>(TYPES.AdminBookingController).to(AdminBookingController);
container.bind<IAdminBookingService>(TYPES.AdminBookingService).to(AdminBookingService);

export { container };
