/**
 * Form Validation Utility
 *
 * Client-side validation rules and utilities for forms.
 * Returns standardized error codes that map to user-friendly messages.
 */

import { ErrorCode } from '@/types/error';

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errorCode?: string;
  details?: Record<string, unknown>;
}

/**
 * Field validation rules
 */
export interface ValidationRule {
  validate: (value: unknown) => ValidationResult;
  errorCode: string;
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      errorCode: ErrorCode.REQUIRED_FIELD,
      details: { field: 'email' },
    };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorCode: ErrorCode.INVALID_EMAIL,
    };
  }

  return { isValid: true };
}

/**
 * Password validation
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecialChar?: boolean;
  } = {}
): ValidationResult {
  const {
    minLength = 8,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecialChar = false,
  } = options;

  if (!password || password.trim() === '') {
    return {
      isValid: false,
      errorCode: ErrorCode.REQUIRED_FIELD,
      details: { field: 'password' },
    };
  }

  // Check minimum length
  if (password.length < minLength) {
    return {
      isValid: false,
      errorCode: ErrorCode.PASSWORD_TOO_SHORT,
      details: { limit: minLength },
    };
  }

  // Check complexity requirements
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      errorCode: ErrorCode.PASSWORD_TOO_WEAK,
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      errorCode: ErrorCode.PASSWORD_TOO_WEAK,
    };
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    return {
      isValid: false,
      errorCode: ErrorCode.PASSWORD_TOO_WEAK,
    };
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      errorCode: ErrorCode.PASSWORD_TOO_WEAK,
    };
  }

  return { isValid: true };
}

/**
 * Confirm password validation
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return {
      isValid: false,
      errorCode: ErrorCode.REQUIRED_FIELD,
      details: { field: 'confirmPassword' },
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      errorCode: ErrorCode.PASSWORDS_DO_NOT_MATCH,
    };
  }

  return { isValid: true };
}

/**
 * Phone number validation (Iranian format)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      errorCode: ErrorCode.REQUIRED_FIELD,
      details: { field: 'phone' },
    };
  }

  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Iranian mobile numbers: 09xxxxxxxxx or +989xxxxxxxxx
  const iranMobileRegex = /^(\+98|0)?9\d{9}$/;

  if (!iranMobileRegex.test(cleanPhone)) {
    return {
      isValid: false,
      errorCode: ErrorCode.INVALID_PHONE,
    };
  }

  return { isValid: true };
}

/**
 * Postal code validation (Iranian format)
 */
export function validatePostalCode(postalCode: string): ValidationResult {
  if (!postalCode || postalCode.trim() === '') {
    return {
      isValid: false,
      errorCode: ErrorCode.REQUIRED_FIELD,
      details: { field: 'postalCode' },
    };
  }

  // Remove spaces and dashes
  const cleanPostalCode = postalCode.replace(/[\s\-]/g, '');

  // Iranian postal code: 10 digits
  const postalCodeRegex = /^\d{10}$/;

  if (!postalCodeRegex.test(cleanPostalCode)) {
    return {
      isValid: false,
      errorCode: ErrorCode.INVALID_POSTAL_CODE,
    };
  }

  return { isValid: true };
}

/**
 * Age validation
 */
export function validateAge(
  age: number | string,
  options: { min?: number; max?: number } = {}
): ValidationResult {
  const { min = 3, max = 150 } = options;

  if (age === undefined || age === null || age === '') {
    return {
      isValid: false,
      errorCode: ErrorCode.REQUIRED_FIELD,
      details: { field: 'age' },
    };
  }

  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;

  if (isNaN(ageNum)) {
    return {
      isValid: false,
      errorCode: ErrorCode.INVALID_AGE,
    };
  }

  if (ageNum < min) {
    return {
      isValid: false,
      errorCode: ErrorCode.AGE_TOO_YOUNG,
      details: { limit: min },
    };
  }

  if (ageNum > max) {
    return {
      isValid: false,
      errorCode: ErrorCode.INVALID_AGE,
      details: { limit: max },
    };
  }

  return { isValid: true };
}

/**
 * Required field validation
 */
export function validateRequired(
  value: unknown,
  fieldName: string
): ValidationResult {
  if (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return {
      isValid: false,
      errorCode: ErrorCode.REQUIRED_FIELD,
      details: { field: fieldName },
    };
  }

  return { isValid: true };
}

/**
 * String length validation
 */
export function validateLength(
  value: string,
  options: { min?: number; max?: number; fieldName?: string }
): ValidationResult {
  const { min, max, fieldName } = options;

  if (!value || value.trim() === '') {
    if (min && min > 0) {
      return {
        isValid: false,
        errorCode: ErrorCode.REQUIRED_FIELD,
        details: { field: fieldName },
      };
    }
    return { isValid: true };
  }

  if (min && value.length < min) {
    return {
      isValid: false,
      errorCode: ErrorCode.VALUE_TOO_SHORT,
      details: { limit: min, field: fieldName },
    };
  }

  if (max && value.length > max) {
    return {
      isValid: false,
      errorCode: ErrorCode.VALUE_TOO_LONG,
      details: { limit: max, field: fieldName },
    };
  }

  return { isValid: true };
}

/**
 * Number range validation
 */
export function validateRange(
  value: number,
  options: { min?: number; max?: number; fieldName?: string }
): ValidationResult {
  const { min, max, fieldName } = options;

  if (value === undefined || value === null) {
    return {
      isValid: false,
      errorCode: ErrorCode.REQUIRED_FIELD,
      details: { field: fieldName },
    };
  }

  if (min !== undefined && value < min) {
    return {
      isValid: false,
      errorCode: ErrorCode.INVALID_FORMAT,
      details: { min, field: fieldName },
    };
  }

  if (max !== undefined && value > max) {
    return {
      isValid: false,
      errorCode: ErrorCode.INVALID_FORMAT,
      details: { max, field: fieldName },
    };
  }

  return { isValid: true };
}

/**
 * Validate entire form
 * Returns all field errors
 */
export function validateForm(
  values: Record<string, unknown>,
  rules: Record<string, ValidationRule[]>
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((fieldName) => {
    const fieldRules = rules[fieldName];
    const value = values[fieldName];

    for (const rule of fieldRules) {
      const result = rule.validate(value);
      if (!result.isValid) {
        errors[fieldName] = result.errorCode || ErrorCode.INVALID_FORMAT;
        break; // Stop at first error for this field
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Create validation rule
 */
export function createRule(
  validate: (value: unknown) => ValidationResult
): ValidationRule {
  return {
    validate,
    errorCode: ErrorCode.INVALID_FORMAT,
  };
}

/**
 * Compose multiple validation rules
 */
export function composeValidators(
  ...validators: Array<(value: unknown) => ValidationResult>
): (value: unknown) => ValidationResult {
  return (value: unknown) => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
}

/**
 * Common validation rule sets for forms
 */
export const validationRules = {
  email: (): ValidationRule => ({
    validate: (value) => validateEmail(String(value ?? '')),
    errorCode: ErrorCode.INVALID_EMAIL,
  }),

  password: (minLength = 8): ValidationRule => ({
    validate: (value) => validatePassword(String(value ?? ''), { minLength }),
    errorCode: ErrorCode.PASSWORD_TOO_SHORT,
  }),

  passwordMatch: (password: string): ValidationRule => ({
    validate: (value) => validatePasswordMatch(password, String(value ?? '')),
    errorCode: ErrorCode.PASSWORDS_DO_NOT_MATCH,
  }),

  phone: (): ValidationRule => ({
    validate: (value) => validatePhone(String(value ?? '')),
    errorCode: ErrorCode.INVALID_PHONE,
  }),

  postalCode: (): ValidationRule => ({
    validate: (value) => validatePostalCode(String(value ?? '')),
    errorCode: ErrorCode.INVALID_POSTAL_CODE,
  }),

  required: (fieldName: string): ValidationRule => ({
    validate: (value) => validateRequired(value, fieldName),
    errorCode: ErrorCode.REQUIRED_FIELD,
  }),

  minLength: (min: number, fieldName?: string): ValidationRule => ({
    validate: (value) => validateLength(String(value ?? ''), { min, fieldName }),
    errorCode: ErrorCode.VALUE_TOO_SHORT,
  }),

  maxLength: (max: number, fieldName?: string): ValidationRule => ({
    validate: (value) => validateLength(String(value ?? ''), { max, fieldName }),
    errorCode: ErrorCode.VALUE_TOO_LONG,
  }),

  age: (min = 3, max = 150): ValidationRule => ({
    validate: (value) =>
      validateAge(
        typeof value === 'number' ? value : String(value ?? ''),
        { min, max }
      ),
    errorCode: ErrorCode.AGE_TOO_YOUNG,
  }),
};
