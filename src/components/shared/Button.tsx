import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    rounded?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  size = 'medium',
                                                  fullWidth = false,
                                                  rounded = false,
                                                  icon,
                                                  iconPosition = 'left',
                                                  className,
                                                  ...props
                                              }) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        rounded ? styles.rounded : '',
        icon ? styles.withIcon : '',
        className || ''
    ].filter(Boolean).join(' ');

    return (
        <button className={buttonClasses} {...props}>
            {icon && iconPosition === 'left' && (
                <span className={styles.iconLeft}>{icon}</span>
            )}
            <span className={styles.text}>{children}</span>
            {icon && iconPosition === 'right' && (
                <span className={styles.iconRight}>{icon}</span>
            )}
        </button>
    );
};