const AUTH_ROUTE = '/auth';

export const AUTH_ROUTES = {
  LOGIN: `${AUTH_ROUTE}/login`,
  REGISTER: `${AUTH_ROUTE}/register`,
  VERIFY_OTP: `${AUTH_ROUTE}/verify-otp`,
  RESEND_OTP: `${AUTH_ROUTE}/resend-otp`,
  FORGOT_PASSWORD: `${AUTH_ROUTE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_ROUTE}/reset-password`,
  LOGOUT: `${AUTH_ROUTE}/logout`,
  GOOGLE: `${AUTH_ROUTE}/google`,
  REFRESH_TOKEN: `${AUTH_ROUTE}/refresh-token`,
} as const;

const PROFILE_ROUTE = '/profile';

export const PROFILE_ROUTES = {
  UPLOAD_IMAGE: `${PROFILE_ROUTE}/upload-profile`,
  UPDATE_BASIC: `${PROFILE_ROUTE}`,
  CHANGE_EMAIL: `${PROFILE_ROUTE}/change-email`,
  CHANGE_PHONE: `${PROFILE_ROUTE}/change-phone`,
  VERIFY_OTP: `${PROFILE_ROUTE}/verify-otp`,
  RESEND_OTP: `${PROFILE_ROUTE}/resend-otp`,
  CHANGE_PASSWORD: `${PROFILE_ROUTE}/change-password`,
} as const;
