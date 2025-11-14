export const HOST = import.meta.env.VITE_SERVER_URL;

const AUTH_ROUTE = "/auth";

export const AUTH_ROUTES = {
  LOGIN: `${AUTH_ROUTE}/login`,
  REGISTER: `${AUTH_ROUTE}/register`,
  VERIFY_OTP: `${AUTH_ROUTE}/verify-otp`,
  RESEND_OTP: `${AUTH_ROUTE}/resend-otp`,
  FORGOT_PASSWORD: `${AUTH_ROUTE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_ROUTE}/reset-password`,
  LOGOUT: `${AUTH_ROUTE}/logout`,
  GOOGLE: `/api/auth/google`,
  GITHUB: `/api/auth/github`,
} as const;