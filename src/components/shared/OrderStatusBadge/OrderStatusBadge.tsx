import React from 'react';
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getOrderStatusText, getOrderStatusVariant, getOrderStatusIcon } from '@/utils/orderStatus';
import styles from './OrderStatusBadge.module.scss';

interface OrderStatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, showIcon = true }) => {
  const text = getOrderStatusText(status);
  const variant = getOrderStatusVariant(status);
  const iconType = getOrderStatusIcon(status);

  const renderIcon = () => {
    if (!showIcon) return null;

    switch (iconType) {
      case 'box':
        return <FaBoxOpen className={styles.icon} />;
      case 'truck':
        return <FaTruck className={styles.icon} />;
      case 'check':
        return <FaCheckCircle className={styles.icon} />;
      case 'times':
        return <FaTimesCircle className={styles.icon} />;
      default:
        return <FaBoxOpen className={styles.icon} />;
    }
  };

  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {renderIcon()}
      {text}
    </span>
  );
};

export default OrderStatusBadge;
