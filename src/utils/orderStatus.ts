/**
 * Order status utility functions
 * Provides consistent status text, styling, and icons across the application
 */

export type OrderStatus = 'cart' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

/**
 * Get Persian text for order status
 */
export const getOrderStatusText = (status: string): string => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case 'cart':
      return 'در سبد خرید';
    case 'pending':
      return 'در انتظار پرداخت';
    case 'processing':
      return 'در حال پردازش';
    case 'shipped':
      return 'ارسال شده';
    case 'delivered':
      return 'تحویل داده شده';
    case 'canceled':
      return 'لغو شده';
    default:
      return status;
  }
};

/**
 * Get CSS class variant for order status
 */
export const getOrderStatusVariant = (status: string): 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled' => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case 'cart':
    case 'pending':
      return 'pending';
    case 'processing':
      return 'processing';
    case 'shipped':
      return 'shipped';
    case 'delivered':
      return 'delivered';
    case 'canceled':
      return 'canceled';
    default:
      return 'pending';
  }
};

/**
 * Get icon name for order status
 */
export const getOrderStatusIcon = (status: string): 'box' | 'truck' | 'check' | 'times' => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case 'cart':
    case 'pending':
    case 'processing':
      return 'box';
    case 'shipped':
      return 'truck';
    case 'delivered':
      return 'check';
    case 'canceled':
      return 'times';
    default:
      return 'box';
  }
};
