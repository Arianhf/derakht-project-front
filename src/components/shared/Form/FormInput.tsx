import React from 'react';
import styles from './Form.module.scss';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required,
  id,
  name,
  className,
  ...rest
}) => {
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.formGroup}>
      <label htmlFor={inputId}>
        {label} {required && '*'}
      </label>
      <input
        id={inputId}
        name={name}
        className={`${error ? styles.inputError : ''} ${className || ''}`}
        {...rest}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default FormInput;
