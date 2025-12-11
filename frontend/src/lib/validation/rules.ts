import { z } from 'zod';
export const emailRule = z.string().email('Invalid email format');

export const DESCRIPTION_REGEX = /^(?!.*(.)\1{3})(?=.{10,500}$)[A-Za-z0-9.,!?&()'"/\-:\s]+$/;
export const SERVICE_NAME_REGEX =
  /^(?!.*(.)\1{2})(?=.{3,40}$)(?=(?:.*[A-Za-z]){2,})[A-Za-z0-9][A-Za-z0-9/&.'\- ]*[A-Za-z0-9]$/;

export const nameRule = z
  .string()
  .min(3, 'Name must be at least 3 characters')
  .max(30, 'Name cannot exceed 30 characters')
  .regex(/^[A-Za-z ]+$/, 'Name must contain only letters and spaces');

export const passwordRule = z
  .string()
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/\d/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol')
  .min(8, 'Password must be at least 8 characters');

export const phoneRule = z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits');

export const serviceNameRule = z
  .string()
  .min(3, 'Service name must be at least 3 characters')
  .max(40, 'Service name cannot exceed 40 characters')
  .regex(SERVICE_NAME_REGEX, 'Invalid service name format');
export const descriptionRuleRequired = z
  .string()
  .min(10, 'Description must be at least 10 characters')
  .max(500, 'Description cannot exceed 500 characters')
  .regex(DESCRIPTION_REGEX, 'Description contains invalid characters');

export const descriptionRuleOptional = z
  .string()
  .optional()
  .refine(
    val => !val || (val.trim().length >= 10 && val.trim().length <= 500),
    'Description must be 10–500 characters'
  )
  .refine(
    val => !val || /^[A-Za-z0-9.,!?&_()'"/\-:\s]+$/.test(val),
    'Description contains invalid characters'
  )
  .refine(
    val => !val || !/(.)\1{3}/.test(val),
    "Description cannot contain repeated characters like 'aaaa' or 'ssss'"
  );
