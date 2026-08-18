import { buildRoute } from './routeBuilder';

const auth = buildRoute('/auth');

export const AUTH_API = {
  LOGIN: auth(`/login`),
  REGISTER: auth(`/register`),
  VERIFY_OTP: auth(`/verify-otp`),
  RESEND_OTP: auth(`/resend-otp`),
  FORGOT_PASSWORD: auth(`/forgot-password`),
  RESET_PASSWORD: auth(`/reset-password`),
  LOGOUT: auth(`/logout`),
  GOOGLE: auth(`/google`),
  REFRESH_TOKEN: auth(`/refresh-token`),
  SWITCH_ROLE: auth(`/switch-role`),
};
