import React from 'react';
import Image from 'next/image';
import styles from './OrderSummary.module.scss';
import { CartDetails, ShippingMethod } from '@/types/shop';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';

interface OrderSummaryProps {
    cartDetails: CartDetails;
    selectedShippingMethod?: ShippingMethod | null;
    loadingShipping?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    cartDetails,
    selectedShippingMethod,
    loadingShipping = false,
}) => {
    const shippingCost = selectedShippingMethod?.cost ?? 0;
    const totalWithShipping = Number(cartDetails.total_amount) + shippingCost;

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
                    {loadingShipping ? (
                        <span className={styles.loadingText}>در حال محاسبه...</span>
                    ) : selectedShippingMethod ? (
                        <span>
                            {selectedShippingMethod.is_free || shippingCost === 0
                                ? 'رایگان'
                                : formatPrice(shippingCost, false)}
                        </span>
                    ) : (
                        <span className={styles.pendingText}>انتخاب نشده</span>
                    )}
                </div>
                {selectedShippingMethod && (selectedShippingMethod.is_free || shippingCost === 0) && (
                    <div className={styles.freeShippingMessage}>
                        سفارش شما شامل ارسال رایگان می‌شود
                    </div>
                )}
                {selectedShippingMethod && (
                    <div className={styles.shippingMethodInfo}>
                        <span className={styles.shippingMethodName}>
                            {selectedShippingMethod.name}
                        </span>
                        {selectedShippingMethod.estimated_delivery_days_min && selectedShippingMethod.estimated_delivery_days_max && (
                            <span className={styles.deliveryEstimate}>
                                ({toPersianNumber(selectedShippingMethod.estimated_delivery_days_min)} تا {toPersianNumber(selectedShippingMethod.estimated_delivery_days_max)} روز کاری)
                            </span>
                        )}
                        {selectedShippingMethod.estimated_delivery_hours_min && selectedShippingMethod.estimated_delivery_hours_max && (
                            <span className={styles.deliveryEstimate}>
                                ({toPersianNumber(selectedShippingMethod.estimated_delivery_hours_min)} تا {toPersianNumber(selectedShippingMethod.estimated_delivery_hours_max)} ساعت)
                            </span>
                        )}
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