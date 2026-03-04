const TYPES = {
  // Auth
  AuthController: Symbol.for("AuthController"),
  AuthService: Symbol.for("AuthService"),

  // User
  UserRepository: Symbol.for("UserRepository"),
  UserService: Symbol.for("UserService"),
  // UserController: Symbol.for("UserController"),

  // worker
  WorkerRepository: Symbol.for("WorkerRepository"),
  WorkerService: Symbol.for("WorkerService"),
  WorkerController: Symbol.for("WorkerController"),

  ProfileController: Symbol.for("ProfileController"),
  ProfileService: Symbol.for("ProfileService"),

  AdminController: Symbol.for("AdminController"),

  //category
  CategoryController: Symbol.for("CategoryController"),
  CategoryService: Symbol.for("CategoryService"),
  CategoryRepository: Symbol.for("CategoryRepository"),

  // admin
  AdminCategoryController: Symbol.for("AdminCategoryController"),
  CategoryManagementService: Symbol.for("CategoryManagementService"),

  // Miscellaneous / Utilities
  OTPService: Symbol.for("IOTPService"),
  EmailService: Symbol.for("IEmailService"),
  TokenService: Symbol.for("ITokenService"),

  // Upload
  UploadController: Symbol.for("UploadController"),
  S3Service: Symbol.for("S3Service"),

  // services
  ServiceController: Symbol.for("ServiceController"),
  ServiceManagement: Symbol.for("ServiceManagement"),
  ServiceRepository: Symbol.for("ServiceRepository"),

  // home
  HomeController: Symbol.for("HomeController"),
  HomeService: Symbol.for("HomeService"),
  HomeLayoutService: Symbol.for("HomeLayoutService"),
  HomeSectionService: Symbol.for("HomeSectionService"),
  HomeSectionRepository: Symbol.for("HomeSectionRepository"),
  HomeLayoutRepository: Symbol.for("HomeLayoutRepository"),

  // plan /subcription
  PlanController: Symbol.for("PlanController"),
  PlanService: Symbol.for("PlanService"),
  PlanRepository: Symbol.for("PlanRepository"),

  SubscriptionController: Symbol.for("SubscriptionController"),
  SubscriptionService: Symbol.for("SubscriptionService"),
  SubscriptionRepository: Symbol.for("SubscriptionRepository"),

  PaymentController: Symbol.for("PaymentController"),
  PaymentRepository: Symbol.for("PaymentRepository"),
  PaymentService: Symbol.for("PaymentService"),
};

export { TYPES };
