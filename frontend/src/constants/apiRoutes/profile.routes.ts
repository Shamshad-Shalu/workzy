import { buildRoute } from './routeBuilder';

const profile = buildRoute('/profile');

export const PROFILE_API = {
  UPLOAD_IMAGE: profile(`/upload-profile`),
  PROFILE: profile(`/me`),
  CHANGE_EMAIL: profile(`/change-email`),
  CHANGE_PHONE: profile(`/change-phone`),
  VERIFY_OTP: profile(`/verify-otp`),
  RESEND_OTP: profile(`/resend-otp`),
  CHANGE_PASSWORD: profile(`/change-password`),
} as const;
