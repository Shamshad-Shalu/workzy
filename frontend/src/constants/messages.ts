export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGIN_FAILED: 'Invalid email or password.',
  REGISTER_SUCCESS: 'Account created successfully!',
  OTP_SENT: 'OTP sent to your email.',
} as const;

export const SESSION_MESSAGES = {
  EXPIRED: 'Session expired. Please log in again.',
} as const;

export const ERROR_MESSAGES = {
  SOMETHING_WRONG: 'Something went wrong. Please try again.',
  REQUIRED_FIELDS: 'Please fill all required fields.',
} as const;
