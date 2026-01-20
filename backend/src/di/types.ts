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
};

export { TYPES };
