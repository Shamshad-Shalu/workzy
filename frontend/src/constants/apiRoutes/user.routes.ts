import { buildRoute } from './routeBuilder';

const user = buildRoute('/users');

export const USER_API = {
  UPLOAD_IMAGE: user(`/profile-image`),
  PROFILE: user(`/profile`),
  CHANGE_EMAIL: user(`/change-email`),
  CHANGE_PHONE: user(`/change-phone`),
  VERIFY_OTP: user('/verify-otp'),
  RESEND_OTP: user('/resend-otp'),
  CHANGE_PASSWORD: user(`/change-password`),
} as const;
