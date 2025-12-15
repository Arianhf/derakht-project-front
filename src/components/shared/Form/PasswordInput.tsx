import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Form.module.scss';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  required,
  id,
  name,
  className,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || 'password';

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={inputId}>
        {label} {required && '*'}
      </label>
      <div className={styles.passwordContainer}>
        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          className={`${error ? styles.inputError : ''} ${className || ''}`}
          dir="ltr"
          {...rest}
        />
        <button
          type="button"
          className={styles.eyeButton}
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default PasswordInput;
