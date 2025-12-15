import React from 'react';
import styles from './Form.module.scss';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
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
      <textarea
        id={inputId}
        name={name}
        className={`${error ? styles.inputError : ''} ${className || ''}`}
        {...rest}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default FormTextarea;
