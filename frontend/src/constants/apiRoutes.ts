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
  PROFILE: `${PROFILE_ROUTE}/me`,
  CHANGE_EMAIL: `${PROFILE_ROUTE}/change-email`,
  CHANGE_PHONE: `${PROFILE_ROUTE}/change-phone`,
  VERIFY_OTP: `${PROFILE_ROUTE}/verify-otp`,
  RESEND_OTP: `${PROFILE_ROUTE}/resend-otp`,
  CHANGE_PASSWORD: `${PROFILE_ROUTE}/change-password`,
} as const;

const ADMIN_ROUTE = '/admin';
export const ADMIN_ROUTES = {
  GETUSER: `${ADMIN_ROUTE}/users`,
  TOGGLESTATUS: `${ADMIN_ROUTE}/users/toggle`,

  GETSERVICE: `${ADMIN_ROUTE}/services`,
  TOGGLESERVICESTATUS: `${ADMIN_ROUTE}/services/toggle-status`,

  GETWORKER: `${ADMIN_ROUTE}/workers/all`,
  VERIFYWORKER: `${ADMIN_ROUTE}/workers/verify`,
};
