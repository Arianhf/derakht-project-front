'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Order } from '@/types/shop';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { FaArrowRight } from 'react-icons/fa';
import styles from './OrderDetail.module.scss';
import OrderStatusBadge from '@/components/shared/OrderStatusBadge/OrderStatusBadge';

interface OrderDetailProps {
    order: Order;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
    const router = useRouter();

    const formatPrice = (amount: number): string => {
        // Convert to toman from rial
        const tomanAmount = Math.round(amount / 10000);
        return toPersianNumber(tomanAmount.toLocaleString()) + ' تومان';
    };

    const goBack = () => {
        router.push('/account/orders');
    };

    return (
        <div className={styles.orderDetailContainer}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>جزئیات سفارش</h1>
                <button
                    className={styles.backButton}
                    onClick={goBack}
                >
                    <FaArrowRight /> بازگشت
                </button>
            </div>

            <div className={styles.orderInfoCard}>
                <div className={styles.orderHeader}>
                    <div className={styles.orderHeaderLeft}>
                        <div className={styles.orderNumber}>
                            سفارش شماره: <span>{toPersianNumber(order.id.substring(0, 8))}</span>
                        </div>
                        <div className={styles.orderDate}>
                            تاریخ: {toPersianNumber(new Date(order.created_at).toLocaleDateString('fa-IR'))}
                        </div>
                    </div>
                    <div className={styles.orderStatus}>
                        <OrderStatusBadge status={order.status} showIcon={true} />
                    </div>
                </div>

                <div className={styles.orderSection}>
                    <h3 className={styles.sectionTitle}>اطلاعات تحویل</h3>
                    <div className={styles.deliveryInfo}>
                        {order.shipping_info && (
                            <>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>نام گیرنده:</div>
                                    <div className={styles.infoValue}>{order.shipping_info.recipient_name}</div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>آدرس:</div>
                                    <div className={styles.infoValue}>
                                        {order.shipping_info.province}، {order.shipping_info.city}، {order.shipping_info.address}
                                    </div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>کد پستی:</div>
                                    <div className={styles.infoValue}>{toPersianNumber(order.shipping_info.postal_code)}</div>
                                </div>
                            </>
                        )}
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>شماره تماس:</div>
                            <div className={styles.infoValue}>{toPersianNumber(order.phone_number)}</div>
                        </div>
                    </div>
                </div>

                <div className={styles.orderSection}>
                    <h3 className={styles.sectionTitle}>اقلام سفارش</h3>
                    <div className={styles.orderItems}>
                        {order.items.map((item) => (
                            <div key={item.id} className={styles.orderItem}>
                                <div className={styles.itemImage}>
                                    {item.product.feature_image ? (
                                        <Image
                                            src={item.product.feature_image}
                                            alt={item.product.title}
                                            width={80}
                                            height={80}
                                            objectFit="cover"
                                        />
                                    ) : (
                                        <div className={styles.noImage}>
                                            <span>بدون تصویر</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.itemDetails}>
                                    <h4 className={styles.itemTitle}>{item.product.title}</h4>
                                    <div className={styles.itemMeta}>
                                        <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                                        <span className={styles.itemQuantity}>تعداد: {toPersianNumber(item.quantity)}</span>
                                    </div>
                                </div>
                                <div className={styles.itemTotal}>
                                    {formatPrice(item.total_price)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.orderSummary}>
                    <div className={styles.summaryRow}>
                        <span>جمع کل:</span>
                        <span>{formatPrice(order.total_amount)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
