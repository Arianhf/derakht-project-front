'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { userService } from '@/services/userService';
import { Order } from '@/types/shop';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';
import { FaArrowRight, FaSpinner, FaCheckCircle, FaTruck, FaBoxOpen, FaTimesCircle } from 'react-icons/fa';
import styles from './OrderDetail.module.scss';

interface OrderDetailProps {
    orderId: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId }) => {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await userService.getOrderDetails(orderId);
            setOrder(data);
        } catch (err: any) {
            console.error('Error fetching order details:', err);
            setError('خطا در دریافت اطلاعات سفارش');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <FaBoxOpen className={styles.statusIconPending} />;
            case 'processing': return <FaBoxOpen className={styles.statusIconProcessing} />;
            case 'shipped': return <FaTruck className={styles.statusIconShipped} />;
            case 'delivered': return <FaCheckCircle className={styles.statusIconDelivered} />;
            case 'canceled': return <FaTimesCircle className={styles.statusIconCanceled} />;
            default: return <FaBoxOpen className={styles.statusIconPending} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'در انتظار پرداخت';
            case 'processing': return 'در حال پردازش';
            case 'shipped': return 'ارسال شده';
            case 'delivered': return 'تحویل داده شده';
            case 'canceled': return 'لغو شده';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'pending': return styles.pending;
            case 'processing': return styles.processing;
            case 'shipped': return styles.shipped;
            case 'delivered': return styles.delivered;
            case 'canceled': return styles.canceled;
            default: return '';
        }
    };

    const goBack = () => {
        router.push('/account/orders');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <FaSpinner className={styles.spinner} />
                <p>در حال بارگذاری اطلاعات سفارش...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className={styles.errorContainer}>
                <h2>خطا در دریافت اطلاعات سفارش</h2>
                <p>{error || 'اطلاعات سفارش یافت نشد'}</p>
                <button
                    className={styles.backButton}
                    onClick={goBack}
                >
                    <FaArrowRight /> بازگشت به سفارش‌ها
                </button>
            </div>
        );
    }

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
                            سفارش شماره: <span>{toPersianNumber(order.id)}</span>
                        </div>
                        <div className={styles.orderDate}>
                            تاریخ: {toPersianNumber(new Date(order.created_at).toLocaleDateString('fa-IR'))}
                        </div>
                    </div>
                    <div className={styles.orderStatus}>
                        <div className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.orderSection}>
                    <h3 className={styles.sectionTitle}>اطلاعات تحویل</h3>
                    <div className={styles.deliveryInfo}>
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>آدرس:</div>
                            <div className={styles.infoValue}>{order.shipping_address}</div>
                        </div>
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>شماره تماس:</div>
                            <div className={styles.infoValue}>{toPersianNumber(order.phone_number)}</div>
                        </div>
                        {order.tracking_info && (
                            <>
                                {order.tracking_info.tracking_number && (
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>کد رهگیری:</div>
                                        <div className={styles.infoValue}>
                                            {toPersianNumber(order.tracking_info.tracking_number)}
                                        </div>
                                    </div>
                                )}
                                {order.tracking_info.carrier && (
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>شرکت پستی:</div>
                                        <div className={styles.infoValue}>{order.tracking_info.carrier}</div>
                                    </div>
                                )}
                            </>
                        )}
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
                                        <span className={styles.itemPrice}>{formatPrice(item.price, false)}</span>
                                        <span className={styles.itemQuantity}>تعداد: {toPersianNumber(item.quantity)}</span>
                                    </div>
                                </div>
                                <div className={styles.itemTotal}>
                                    {formatPrice(item.price * item.quantity, false)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.orderSummary}>
                    <div className={styles.summaryRow}>
                        <span>جمع کل:</span>
                        <span>{formatPrice(order.total_amount, true)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;