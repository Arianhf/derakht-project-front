import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
  validatePostalCode,
} from '@/utils/validation'
import { ErrorCode } from '@/types/error'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.ir',
        'user+tag@gmail.com',
        'admin@test.org',
        'info@company-name.com',
      ]

      validEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(true)
        expect(result.errorCode).toBeUndefined()
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
        '',
      ]

      invalidEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(false)
        expect(result.errorCode).toBeDefined()
      })
    })

    it('should require email field', () => {
      const result = validateEmail('')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.REQUIRED_FIELD)
      expect(result.details).toEqual({ field: 'email' })
    })

    it('should return INVALID_EMAIL for malformed email', () => {
      const result = validateEmail('notanemail')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.INVALID_EMAIL)
    })
  })

  describe('validatePassword', () => {
    it('should validate passwords with default options (min 8 chars)', () => {
      const validPasswords = [
        'password123',
        'mySecurePass',
        'test1234',
      ]

      validPasswords.forEach(password => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(true)
      })
    })

    it('should reject passwords shorter than minimum length', () => {
      const result = validatePassword('short')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.PASSWORD_TOO_SHORT)
      expect(result.details).toEqual({ limit: 8 })
    })

    it('should enforce custom minimum length', () => {
      const result = validatePassword('pass', { minLength: 10 })
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.PASSWORD_TOO_SHORT)
      expect(result.details).toEqual({ limit: 10 })
    })

    it('should require uppercase when specified', () => {
      const result = validatePassword('password123', { requireUppercase: true })
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.PASSWORD_TOO_WEAK)

      const validResult = validatePassword('Password123', { requireUppercase: true })
      expect(validResult.isValid).toBe(true)
    })

    it('should require lowercase when specified', () => {
      const result = validatePassword('PASSWORD123', { requireLowercase: true })
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.PASSWORD_TOO_WEAK)

      const validResult = validatePassword('Password123', { requireLowercase: true })
      expect(validResult.isValid).toBe(true)
    })

    it('should require number when specified', () => {
      const result = validatePassword('Password', { requireNumber: true })
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.PASSWORD_TOO_WEAK)

      const validResult = validatePassword('Password123', { requireNumber: true })
      expect(validResult.isValid).toBe(true)
    })

    it('should require special character when specified', () => {
      const result = validatePassword('Password123', { requireSpecialChar: true })
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.PASSWORD_TOO_WEAK)

      const validResult = validatePassword('Password123!', { requireSpecialChar: true })
      expect(validResult.isValid).toBe(true)
    })

    it('should validate complex password with all requirements', () => {
      const result = validatePassword('MyP@ssw0rd', {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecialChar: true,
      })
      expect(result.isValid).toBe(true)
    })

    it('should require password field', () => {
      const result = validatePassword('')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.REQUIRED_FIELD)
      expect(result.details).toEqual({ field: 'password' })
    })
  })

  describe('validatePasswordMatch', () => {
    it('should validate matching passwords', () => {
      const result = validatePasswordMatch('Password123', 'Password123')
      expect(result.isValid).toBe(true)
    })

    it('should reject non-matching passwords', () => {
      const result = validatePasswordMatch('Password123', 'Password456')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.PASSWORDS_DO_NOT_MATCH)
    })

    it('should require confirm password field', () => {
      const result = validatePasswordMatch('Password123', '')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.REQUIRED_FIELD)
      expect(result.details).toEqual({ field: 'confirmPassword' })
    })

    it('should be case-sensitive', () => {
      const result = validatePasswordMatch('Password', 'password')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.PASSWORDS_DO_NOT_MATCH)
    })
  })

  describe('validatePhone', () => {
    it('should validate Iranian mobile numbers', () => {
      const validPhones = [
        '09121234567',
        '09351234567',
        '09191234567',
        '09901234567',
        '09381234567',
      ]

      validPhones.forEach(phone => {
        const result = validatePhone(phone)
        expect(result.isValid).toBe(true)
      })
    })

    it('should validate phone numbers with international prefix', () => {
      const result = validatePhone('+989121234567')
      expect(result.isValid).toBe(true)
    })

    it('should handle phone numbers with formatting', () => {
      const phonesWithFormatting = [
        '0912-123-4567',
        '0912 123 4567',
        '(0912) 123-4567',
      ]

      phonesWithFormatting.forEach(phone => {
        const result = validatePhone(phone)
        expect(result.isValid).toBe(true)
      })
    })

    it('should reject invalid Iranian phone numbers', () => {
      const invalidPhones = [
        '0812345678',     // Not mobile (landline)
        '912345678',      // Missing leading 0
        '09121234',       // Too short
        '091212345678',   // Too long
        '12345678901',    // Not starting with 09
        '08121234567',    // Landline number (not mobile)
      ]

      invalidPhones.forEach(phone => {
        const result = validatePhone(phone)
        expect(result.isValid).toBe(false)
        expect(result.errorCode).toBe(ErrorCode.INVALID_PHONE)
      })
    })

    it('should require phone field', () => {
      const result = validatePhone('')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.REQUIRED_FIELD)
      expect(result.details).toEqual({ field: 'phone' })
    })
  })

  describe('validatePostalCode', () => {
    it('should validate 10-digit postal codes', () => {
      const validCodes = [
        '1234567890',
        '9876543210',
        '1111111111',
      ]

      validCodes.forEach(code => {
        const result = validatePostalCode(code)
        expect(result.isValid).toBe(true)
      })
    })

    it('should handle postal codes with formatting', () => {
      const codesWithFormatting = [
        '12345-67890',
        '12345 67890',
      ]

      codesWithFormatting.forEach(code => {
        const result = validatePostalCode(code)
        expect(result.isValid).toBe(true)
      })
    })

    it('should reject invalid postal codes', () => {
      const invalidCodes = [
        '123456789',      // Too short
        '12345678901',    // Too long
        'abcdefghij',     // Non-numeric
        '123abc7890',     // Contains letters
        '',               // Empty
      ]

      invalidCodes.forEach(code => {
        const result = validatePostalCode(code)
        expect(result.isValid).toBe(false)
      })
    })

    it('should require postal code field', () => {
      const result = validatePostalCode('')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.REQUIRED_FIELD)
      expect(result.details).toEqual({ field: 'postalCode' })
    })

    it('should return INVALID_POSTAL_CODE for malformed code', () => {
      const result = validatePostalCode('12345')
      expect(result.isValid).toBe(false)
      expect(result.errorCode).toBe(ErrorCode.INVALID_POSTAL_CODE)
    })
  })
})
