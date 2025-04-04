// src/components/shared/LoadingSpinner.tsx
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
    message?: string;
    fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           message = 'در حال بارگذاری...',
                                                           fullPage = false
                                                       }) => {
    return (
        <div className={`${styles.container} ${fullPage ? styles.fullPage : ''}`}>
            <FaSpinner className={styles.spinner} />
            <p className={styles.message}>{message}</p>
        </div>
    );
};

export default LoadingSpinner;