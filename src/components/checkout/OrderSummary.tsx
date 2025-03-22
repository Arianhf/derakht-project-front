import React from 'react';
import Image from 'next/image';
import styles from './OrderSummary.module.scss';
import { CartDetails } from '@/types/shop';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';

interface OrderSummaryProps {
    cartDetails: CartDetails;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cartDetails }) => {
    // Calculate shipping cost - this would normally come from backend
    const shippingCost = cartDetails.total_amount > 500000 ? 0 : 30000; // Free shipping for orders over 500,000 toman
    const totalWithShipping = cartDetails.total_amount + shippingCost;

    return (
        <div className={styles.orderSummaryContainer}>
            <h2 className={styles.summaryTitle}>خلاصه سفارش</h2>

            <div className={styles.itemList}>
                {cartDetails.items.map((item) => (
                    <div key={item.product.id} className={styles.item}>
                        <div className={styles.itemImage}>
                            {item.product.feature_image ? (
                                <Image
                                    src={item.product.feature_image}
                                    alt={item.product.title}
                                    width={60}
                                    height={60}
                                    objectFit="cover"
                                />
                            ) : (
                                <div className={styles.noImage}>
                                    <span>بدون تصویر</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.itemDetails}>
                            <h3 className={styles.itemTitle}>{item.product.title}</h3>
                            <p className={styles.itemQuantity}>
                                {toPersianNumber(item.quantity)} عدد
                            </p>
                        </div>
                        <div className={styles.itemPrice}>
                            {formatPrice(item.total_price, false)}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                    <span>جمع سبد خرید</span>
                    <span>{formatPrice(cartDetails.total_amount, false)}</span>
                </div>
                <div className={styles.summaryRow}>
                    <span>هزینه ارسال</span>
                    <span>
            {shippingCost === 0
                ? 'رایگان'
                : formatPrice(shippingCost, false)}
          </span>
                </div>
                {shippingCost === 0 && (
                    <div className={styles.freeShippingMessage}>
                        سفارش شما شامل ارسال رایگان می‌شود
                    </div>
                )}
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>مبلغ قابل پرداخت</span>
                    <span>{formatPrice(totalWithShipping, false)}</span>
                </div>
            </div>
        </div>
    );
};