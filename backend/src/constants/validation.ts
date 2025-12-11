export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const NAME_REGEX = /^(?=.{3,30}$)[A-Za-z]+( [A-Za-z]+)*$/;

export const PHONE_REGEX = /^[0-9]{10}$/;

export const SERVICE_NAME_REGEX =
  /^(?!.*(.)\1{2})(?=.{3,40}$)(?=(?:.*[A-Za-z]){2,})[A-Za-z0-9][A-Za-z0-9/&.'\- ]*[A-Za-z0-9]$/;

export const DESCRIPTION_REGEX = /^(?!.*(.)\1{3})(?=.{10,500}$)[A-Za-z0-9.,!?&()'"/_\-:\s]+$/;
