import React from 'react';
import { IconType } from 'react-icons';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  icon: IconType;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  iconSize?: number;
  iconColor?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  message,
  actionLabel,
  onAction,
  iconSize = 60,
  iconColor = '#ccc',
}) => {
  return (
    <div className={styles.emptyStateContainer}>
      <Icon size={iconSize} color={iconColor} />
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className={styles.actionButton}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
