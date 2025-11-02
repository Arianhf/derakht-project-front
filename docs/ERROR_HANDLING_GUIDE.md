# Error Handling Implementation Guide

This guide explains how to use the comprehensive error handling system implemented in this application.

## Overview

The error handling system provides:
- **Standardized error responses** from the backend
- **Centralized error handling** utility for transforming and displaying errors
- **User-friendly Persian messages** for all error types
- **Form validation** utilities with error code mapping
- **React Error Boundary** for catching render errors
- **Structured error logging** with development/production modes
- **Automatic error transformation** via Axios interceptors

---

## File Structure

```
src/
├── types/
│   └── error.ts                      # TypeScript interfaces and error codes
├── constants/
│   └── errorMessages.ts              # User-facing Persian error messages
├── utils/
│   ├── errorHandler.ts               # Central error handling utility
│   ├── errorLogger.ts                # Structured error logging
│   └── validation.ts                 # Form validation utilities
├── services/
│   └── api.tsx                       # Enhanced with error interceptor
└── components/
    └── shared/
        └── ErrorBoundary/            # React Error Boundary component
```

---

## Quick Start

### 1. Handling API Errors with Toast Notification

The simplest way to handle errors is to use the `handleApiError` function:

```typescript
import { handleApiError } from '@/utils/errorHandler';
import { loginService } from '@/services/loginService';

async function handleLogin() {
  try {
    const result = await loginService.login(email, password);
    toast.success('ورود موفقیت‌آمیز بود');
  } catch (error) {
    // Automatically shows toast with user-friendly message
    handleApiError(error);
  }
}
```

### 2. Handling Form Validation Errors

For forms, use `handleFormError` to get field-level errors:

```typescript
import { handleFormError } from '@/utils/errorHandler';
import { loginService } from '@/services/loginService';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit() {
    try {
      await loginService.login(email, password);
      // Success
    } catch (error) {
      // Get field errors without showing toast
      const processedError = handleFormError(error);

      if (processedError.fieldErrors) {
        setErrors(processedError.fieldErrors);
      } else {
        // Show general error as toast
        toast.error(processedError.userMessage);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit">ورود</button>
    </form>
  );
}
```

### 3. Client-Side Form Validation

Use validation utilities before making API calls:

```typescript
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateAge,
} from '@/utils/validation';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    // Validate email
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      const template = ERROR_MESSAGES[emailResult.errorCode!];
      newErrors.email = typeof template === 'function'
        ? template(emailResult.details)
        : template;
    }

    // Validate password
    const passwordResult = validatePassword(password, { minLength: 8 });
    if (!passwordResult.isValid) {
      const template = ERROR_MESSAGES[passwordResult.errorCode!];
      newErrors.password = typeof template === 'function'
        ? template(passwordResult.details)
        : template;
    }

    // Validate password match
    const matchResult = validatePasswordMatch(password, confirmPassword);
    if (!matchResult.isValid) {
      newErrors.confirmPassword = ERROR_MESSAGES[matchResult.errorCode!] as string;
    }

    // Validate age
    const ageResult = validateAge(parseInt(age), { min: 3 });
    if (!ageResult.isValid) {
      const template = ERROR_MESSAGES[ageResult.errorCode!];
      newErrors.age = typeof template === 'function'
        ? template(ageResult.details)
        : template;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      await loginService.signup(email, password, confirmPassword, parseInt(age));
      toast.success('ثبت‌نام با موفقیت انجام شد');
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      {errors.email && <span>{errors.email}</span>}

      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {errors.password && <span>{errors.password}</span>}

      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      {errors.confirmPassword && <span>{errors.confirmPassword}</span>}

      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      {errors.age && <span>{errors.age}</span>}

      <button onClick={handleSubmit}>ثبت‌نام</button>
    </form>
  );
}
```

### 4. Using Error Boundary

Wrap your components with ErrorBoundary to catch render errors:

```typescript
// app/layout.tsx
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

Or wrap specific sections:

```typescript
function MyPage() {
  return (
    <div>
      <Header />

      <ErrorBoundary
        fallback={<div>خطا در بارگذاری محتوا</div>}
        onError={(error, errorInfo) => {
          console.error('Caught error:', error, errorInfo);
        }}
      >
        <MainContent />
      </ErrorBoundary>

      <Footer />
    </div>
  );
}
```

---

## Advanced Usage

### Custom Error Handling Options

```typescript
import { handleApiError } from '@/utils/errorHandler';

// Don't show toast, just get the message
const processedError = handleApiError(error, {
  showToast: false,
  logError: true,
});

console.log(processedError.userMessage);
console.log(processedError.severity);
console.log(processedError.retryable);

// Use custom fallback message
handleApiError(error, {
  fallbackMessage: 'خطای سفارشی من',
});
```

### Getting Error Message Without Processing

```typescript
import { getErrorMessage } from '@/utils/errorHandler';

const message = getErrorMessage(error, 'پیام پیش‌فرض');
```

### Check if Error is Retryable

```typescript
import { isRetryableError } from '@/utils/errorHandler';

if (isRetryableError(error)) {
  // Show retry button
  console.log('این خطا قابل تلاش مجدد است');
}
```

### Using Validation Rules

```typescript
import { validationRules, validateForm } from '@/utils/validation';

const formValues = {
  email: 'user@example.com',
  password: 'mypassword',
  confirmPassword: 'mypassword',
  phone: '09123456789',
  age: 25,
};

const rules = {
  email: [validationRules.required('email'), validationRules.email()],
  password: [validationRules.required('password'), validationRules.password(8)],
  confirmPassword: [validationRules.passwordMatch(formValues.password)],
  phone: [validationRules.phone()],
  age: [validationRules.age(3, 100)],
};

const { isValid, errors } = validateForm(formValues, rules);

if (!isValid) {
  console.log('Form errors:', errors);
}
```

### Configure Error Logger

```typescript
import { configureErrorLogger } from '@/utils/errorLogger';

// Enable Sentry integration
configureErrorLogger({
  enabled: true,
  logToConsole: process.env.NODE_ENV === 'development',
  logToService: true,
  serviceName: 'sentry',
  includeStackTrace: true,
  includeBreadcrumbs: true,
});
```

### Manual Breadcrumb Tracking

```typescript
import { addBreadcrumb, getBreadcrumbs } from '@/utils/errorLogger';

// Add breadcrumbs for tracking user actions
addBreadcrumb('navigation', 'User navigated to checkout', {
  page: '/checkout',
  cartItems: 3,
});

addBreadcrumb('user-action', 'User clicked pay button', {
  amount: 150000,
  paymentMethod: 'card',
});

// Get recent breadcrumbs
const recentBreadcrumbs = getBreadcrumbs(10);
console.log('Recent actions:', recentBreadcrumbs);
```

---

## Backend Integration

### Standard Error Response Format

Your backend should return errors in this format:

```json
{
  "code": "INVALID_EMAIL",
  "message": "The provided email format is invalid",
  "userMessage": "فرمت ایمیل نامعتبر است",
  "severity": "error",
  "details": {
    "field": "email",
    "value": "invalid-email"
  },
  "timestamp": "2025-10-26T10:30:00Z",
  "requestId": "req_abc123"
}
```

### Field-Level Validation Errors

For multiple field errors:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Multiple validation errors",
  "userMessage": "لطفاً خطاهای فرم را بررسی کنید",
  "severity": "error",
  "details": {
    "fields": [
      {
        "field": "email",
        "code": "INVALID_EMAIL",
        "message": "Invalid email format",
        "userMessage": "فرمت ایمیل نامعتبر است"
      },
      {
        "field": "password",
        "code": "PASSWORD_TOO_SHORT",
        "message": "Password must be at least 8 characters",
        "userMessage": "رمز عبور باید حداقل 8 کاراکتر باشد"
      }
    ]
  }
}
```

### Fallback Support

If your backend doesn't return the standard format yet, the system will automatically transform common formats:

- `{ error: "message" }` → Transformed
- `{ detail: "message" }` → Transformed
- `{ message: "message" }` → Transformed
- `{ error_code: "...", error_message: "..." }` → Transformed
- HTTP status codes → Inferred error codes

---

## Error Codes Reference

All available error codes are defined in `src/types/error.ts`:

### Validation Errors
- `INVALID_EMAIL` - Invalid email format
- `PASSWORD_TOO_SHORT` - Password below minimum length
- `PASSWORDS_DO_NOT_MATCH` - Password and confirmation don't match
- `REQUIRED_FIELD` - Required field is empty
- `INVALID_PHONE` - Invalid phone number
- `INVALID_POSTAL_CODE` - Invalid postal code
- `AGE_TOO_YOUNG` - Age below minimum

### Authentication Errors
- `INVALID_CREDENTIALS` - Wrong email or password
- `EMAIL_ALREADY_EXISTS` - Email already registered
- `USER_NOT_FOUND` - User doesn't exist
- `SESSION_EXPIRED` - Session has expired
- `TOKEN_INVALID` - Invalid authentication token

### Authorization Errors
- `UNAUTHORIZED` - Not logged in
- `FORBIDDEN` - Insufficient permissions

### Business Logic Errors
- `PRODUCT_OUT_OF_STOCK` - Product not available
- `CART_EMPTY` - Shopping cart is empty
- `PAYMENT_FAILED` - Payment unsuccessful
- `INVALID_QUANTITY` - Invalid product quantity

### Network Errors
- `NETWORK_ERROR` - Connection failed
- `TIMEOUT_ERROR` - Request timed out

### Server Errors
- `SERVER_ERROR` - Internal server error
- `SERVICE_UNAVAILABLE` - Service temporarily down

---

## Adding New Error Codes

1. **Add error code to enum** (`src/types/error.ts`):
```typescript
export enum ErrorCode {
  // ... existing codes
  MY_NEW_ERROR = 'MY_NEW_ERROR',
}
```

2. **Add to category mapping** (`src/types/error.ts`):
```typescript
export const ERROR_CATEGORY_MAP: Record<string, ErrorCategory> = {
  // ... existing mappings
  [ErrorCode.MY_NEW_ERROR]: ErrorCategory.BUSINESS_LOGIC,
};
```

3. **Add user-facing message** (`src/constants/errorMessages.ts`):
```typescript
export const ERROR_MESSAGES: Record<string, ErrorMessageTemplate> = {
  // ... existing messages
  [ErrorCode.MY_NEW_ERROR]: 'پیام فارسی برای کاربر',

  // Or with parameters:
  [ErrorCode.MY_NEW_ERROR]: (details?: any) =>
    `خطا با مقدار ${details?.value}`,
};
```

4. **Optionally add action** (`src/constants/errorMessages.ts`):
```typescript
export const ERROR_ACTIONS: Record<string, string> = {
  // ... existing actions
  [ErrorCode.MY_NEW_ERROR]: 'تلاش مجدد',
};
```

---

## Testing Error Handling

### Test Different Error Scenarios

```typescript
import { ErrorHandler } from '@/utils/errorHandler';
import { ErrorCode } from '@/types/error';

const handler = new ErrorHandler('development');

// Test network error
const networkError = {
  request: {},
  response: undefined,
};
const processed = handler.handle(networkError, { showToast: false });
console.log(processed.userMessage); // "خطا در برقراری ارتباط با سرور..."

// Test validation error
const validationError = {
  response: {
    data: {
      code: ErrorCode.INVALID_EMAIL,
      message: 'Invalid email',
      severity: 'error',
    },
  },
};
const processed2 = handler.handle(validationError, { showToast: false });
console.log(processed2.userMessage); // "فرمت ایمیل نامعتبر است"
```

---

## Best Practices

1. **Always use try-catch** for async operations
2. **Use handleApiError** for simple error display
3. **Use handleFormError** for form validation
4. **Validate on client-side** before API calls to reduce server load
5. **Wrap components with ErrorBoundary** to prevent crashes
6. **Add breadcrumbs** for important user actions
7. **Configure error logging** for production monitoring
8. **Keep error messages user-friendly** in Persian
9. **Never expose stack traces** in production
10. **Test error scenarios** during development

---

## Troubleshooting

### Toast not showing
- Ensure `react-hot-toast` Toaster component is in your layout
- Check that `showToast: true` (default) in options

### Error not transformed correctly
- Check axios interceptor is imported (it runs on import)
- Verify backend response format
- Check console in development mode for error details

### Form validation not working
- Import validation functions from `@/utils/validation`
- Check error codes match those in ERROR_MESSAGES
- Ensure you're getting the template result correctly

### Error Boundary not catching errors
- Error Boundaries only catch errors in React lifecycle
- They don't catch async errors or event handlers
- Use try-catch for those scenarios

---

## Integration Checklist

- [ ] Added ErrorBoundary to root layout
- [ ] Updated service layer to use StandardErrorResponse types
- [ ] Implemented client-side validation in forms
- [ ] Using handleApiError for API errors
- [ ] Using handleFormError for form submissions
- [ ] Configured error logger for your environment
- [ ] Added breadcrumbs for key user actions
- [ ] Tested common error scenarios
- [ ] Backend returns standard error format (or will transform)
- [ ] Error messages reviewed and approved

---

## Examples from Existing Codebase

See these files for real-world usage:
- **Login Service**: `src/services/loginService.tsx`
- **Axios Setup**: `src/services/api.tsx`
- **Error Boundary**: `src/components/shared/ErrorBoundary/`

---

## Support

For questions or issues with error handling:
1. Check this guide first
2. Review error logs in console (development mode)
3. Check breadcrumbs for user action context
4. Review the source files listed above

---

**Last Updated**: October 26, 2025
