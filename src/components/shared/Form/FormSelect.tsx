import React from 'react';
import styles from './Form.module.scss';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: FormSelectOption[] | readonly string[];
  placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  required,
  id,
  name,
  className,
  options,
  placeholder,
  ...rest
}) => {
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  // Check if options are strings or objects
  const isStringArray = typeof options[0] === 'string';

  return (
    <div className={styles.formGroup}>
      <label htmlFor={inputId}>
        {label} {required && '*'}
      </label>
      <select
        id={inputId}
        name={name}
        className={`${error ? styles.inputError : ''} ${className || ''}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {isStringArray
          ? (options as readonly string[]).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          : (options as FormSelectOption[]).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default FormSelect;
