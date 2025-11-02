/**
 * Error Handling Examples
 *
 * This file contains practical examples of using the error handling system.
 * Copy and adapt these patterns to your components.
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { handleApiError, handleFormError, getErrorMessage } from '@/utils/errorHandler';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateAge,
  validatePhone,
  validationRules,
  validateForm,
} from '@/utils/validation';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { loginService } from '@/services/loginService';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

// ============================================================================
// Example 1: Simple API Call with Error Handling
// ============================================================================

function Example1_SimpleApiCall() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    try {
      const result = await loginService.login(email, password);
      toast.success('ورود موفقیت‌آمیز بود');
      // Redirect or update state
    } catch (error) {
      // Automatically shows toast with user-friendly message
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ایمیل"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="رمز عبور"
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'در حال ورود...' : 'ورود'}
      </button>
    </div>
  );
}

// ============================================================================
// Example 2: Form with Field-Level Error Display
// ============================================================================

function Example2_FormWithFieldErrors() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setLoading(true);

    try {
      await loginService.login(email, password);
      toast.success('ورود موفقیت‌آمیز بود');
    } catch (error) {
      // Get field errors without showing toast
      const processedError = handleFormError(error);

      if (processedError.fieldErrors) {
        // Display field-specific errors
        setErrors(processedError.fieldErrors);
      } else {
        // Show general error as toast
        toast.error(processedError.userMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'در حال ورود...' : 'ورود'}
      </button>
    </form>
  );
}

// ============================================================================
// Example 3: Client-Side Validation Before API Call
// ============================================================================

function Example3_ClientSideValidation() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validateFormData(): boolean {
    const newErrors: Record<string, string> = {};

    // Validate email
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      const template = ERROR_MESSAGES[emailResult.errorCode!];
      newErrors.email =
        typeof template === 'function' ? template(emailResult.details) : template;
    }

    // Validate password
    const passwordResult = validatePassword(password, { minLength: 8 });
    if (!passwordResult.isValid) {
      const template = ERROR_MESSAGES[passwordResult.errorCode!];
      newErrors.password =
        typeof template === 'function' ? template(passwordResult.details) : template;
    }

    // Validate password match
    const matchResult = validatePasswordMatch(password, confirmPassword);
    if (!matchResult.isValid) {
      newErrors.confirmPassword = ERROR_MESSAGES[matchResult.errorCode!] as string;
    }

    // Validate age
    const ageNum = parseInt(age);
    if (age) {
      const ageResult = validateAge(ageNum, { min: 3 });
      if (!ageResult.isValid) {
        const template = ERROR_MESSAGES[ageResult.errorCode!];
        newErrors.age =
          typeof template === 'function' ? template(ageResult.details) : template;
      }
    } else {
      newErrors.age = 'سن الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate client-side first
    if (!validateFormData()) {
      toast.error('لطفاً خطاهای فرم را برطرف کنید');
      return;
    }

    setLoading(true);

    try {
      await loginService.signup(email, password, confirmPassword, parseInt(age));
      toast.success('ثبت‌نام با موفقیت انجام شد');
    } catch (error) {
      // Handle server-side errors
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="تکرار رمز عبور"
        />
        {errors.confirmPassword && (
          <span className="error-text">{errors.confirmPassword}</span>
        )}
      </div>

      <div>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="سن"
        />
        {errors.age && <span className="error-text">{errors.age}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
      </button>
    </form>
  );
}

// ============================================================================
// Example 4: Using Validation Rules
// ============================================================================

function Example4_ValidationRules() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function validateWithRules(): boolean {
    const rules = {
      email: [validationRules.required('email'), validationRules.email()],
      password: [validationRules.required('password'), validationRules.password(8)],
      confirmPassword: [validationRules.passwordMatch(formData.password)],
      phone: [validationRules.phone()],
      age: [validationRules.age(3, 100)],
    };

    const { isValid, errors: validationErrors } = validateForm(formData, rules);

    // Convert error codes to messages
    const errorMessages: Record<string, string> = {};
    Object.entries(validationErrors).forEach(([field, errorCode]) => {
      const template = ERROR_MESSAGES[errorCode];
      errorMessages[field] =
        typeof template === 'function' ? template({ field }) : template;
    });

    setErrors(errorMessages);
    return isValid;
  }

  async function handleSubmit() {
    if (!validateWithRules()) {
      toast.error('لطفاً تمام فیلدها را به درستی پر کنید');
      return;
    }

    // Submit form
    try {
      // Your API call here
      toast.success('فرم با موفقیت ارسال شد');
    } catch (error) {
      handleApiError(error);
    }
  }

  return (
    <form>
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {errors.email && <span>{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
        {errors.password && <span>{errors.password}</span>}
      </div>

      <div>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
        />
        {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
      </div>

      <div>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        {errors.phone && <span>{errors.phone}</span>}
      </div>

      <div>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => handleChange('age', e.target.value)}
        />
        {errors.age && <span>{errors.age}</span>}
      </div>

      <button type="button" onClick={handleSubmit}>
        ارسال
      </button>
    </form>
  );
}

// ============================================================================
// Example 5: Using Error Boundary
// ============================================================================

function Example5_ErrorBoundaryUsage() {
  return (
    <ErrorBoundary
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>خطا در بارگذاری محتوا</h2>
          <p>لطفاً صفحه را دوباره بارگذاری کنید</p>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Component error:', error, errorInfo);
        // Send to error tracking service
      }}
    >
      {/* Your component that might throw errors */}
      <PotentiallyBuggyComponent />
    </ErrorBoundary>
  );
}

function PotentiallyBuggyComponent() {
  // This component might throw errors
  return <div>محتوای من</div>;
}

// ============================================================================
// Example 6: Getting Error Message Without Toast
// ============================================================================

function Example6_GetErrorMessage() {
  const [errorMessage, setErrorMessage] = useState('');

  async function loadData() {
    try {
      // API call
    } catch (error) {
      // Get error message without showing toast
      const message = getErrorMessage(error, 'خطا در بارگذاری اطلاعات');
      setErrorMessage(message);
    }
  }

  return (
    <div>
      {errorMessage && <div className="error-banner">{errorMessage}</div>}
      <button onClick={loadData}>بارگذاری مجدد</button>
    </div>
  );
}

// ============================================================================
// Example 7: Conditional Error Display Based on Severity
// ============================================================================

function Example7_SeverityBasedDisplay() {
  async function handleAction() {
    try {
      // API call
    } catch (error) {
      const processedError = handleFormError(error);

      // Display differently based on severity
      switch (processedError.severity) {
        case 'error':
          toast.error(processedError.userMessage);
          break;
        case 'warning':
          toast(processedError.userMessage, { icon: '⚠️', duration: 4000 });
          break;
        case 'info':
          toast(processedError.userMessage, { icon: 'ℹ️', duration: 3000 });
          break;
      }

      // Show retry button if retryable
      if (processedError.retryable) {
        console.log('این خطا قابل تلاش مجدد است');
        // Show retry UI
      }
    }
  }

  return <button onClick={handleAction}>انجام عملیات</button>;
}

// ============================================================================
// Example 8: Real-time Field Validation
// ============================================================================

function Example8_RealTimeValidation() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  function handleEmailChange(value: string) {
    setEmail(value);

    // Validate in real-time
    const result = validateEmail(value);
    if (!result.isValid && value.length > 0) {
      const template = ERROR_MESSAGES[result.errorCode!];
      setEmailError(
        typeof template === 'function' ? template(result.details) : template
      );
    } else {
      setEmailError('');
    }
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => handleEmailChange(e.target.value)}
        placeholder="ایمیل"
      />
      {emailError && <span className="error-text">{emailError}</span>}
    </div>
  );
}

// ============================================================================
// Export examples for reference
// ============================================================================

export {
  Example1_SimpleApiCall,
  Example2_FormWithFieldErrors,
  Example3_ClientSideValidation,
  Example4_ValidationRules,
  Example5_ErrorBoundaryUsage,
  Example6_GetErrorMessage,
  Example7_SeverityBasedDisplay,
  Example8_RealTimeValidation,
};
