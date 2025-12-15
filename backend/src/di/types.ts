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

  adminServiceController: Symbol.for("adminServiceController"),
  ServiceManagementService: Symbol.for("ServiceManagementService"),
  ServiceRepository: Symbol.for("ServiceRepository"),

  // Miscellaneous / Utilities
  OTPService: Symbol.for("IOTPService"),
  EmailService: Symbol.for("IEmailService"),
  TokenService: Symbol.for("ITokenService"),
};

export { TYPES };
