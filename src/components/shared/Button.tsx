import React from 'react';
import { THEME } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  size = 'medium',
                                                  fullWidth = false,
                                                  ...props
                                              }) => {
    const baseStyle = {
        border: 'none',
        borderRadius: THEME.borderRadius.medium,
        cursor: 'pointer',
        fontFamily: THEME.fontFamily.primary,
        transition: 'all 0.3s ease',
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: THEME.colors.button[variant],
        color: '#fff',
        padding: size === 'small' ? '8px 16px' : size === 'medium' ? '12px 24px' : '16px 32px',
        fontSize: size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px',
    };

    return (
        <button
            style={baseStyle}
            {...props}
        >
            {children}
        </button>
    );
};