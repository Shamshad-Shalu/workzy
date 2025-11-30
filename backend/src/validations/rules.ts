import { Matches } from "class-validator";
import { PASSWORD_REGEX, NAME_REGEX, PHONE_REGEX } from "@/constants/validation";

export const PasswordRule = () =>
  Matches(PASSWORD_REGEX, {
    message: "Password must contain uppercase, lowercase, number, special char & min 8 characters",
  });

export const NameRule = () =>
  Matches(NAME_REGEX, {
    message: "Name must be 3–25 characters and contain only letters",
  });

export const PhoneRule = () =>
  Matches(PHONE_REGEX, {
    message: "Phone number must be exactly 10 digits",
  });
