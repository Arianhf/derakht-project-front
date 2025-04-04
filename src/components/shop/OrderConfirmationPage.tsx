'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './orderConfirmation.module.scss';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import logo from '@/assets/images/logo2.png';
import { FaCheckCircle, FaHome, FaListAlt } from 'react-icons/fa';
import { shopService } from '@/services/shopService';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';
import { Order } from '@/types/shop';
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";

const OrderConfirmationPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const data = await shopService.getOrderById(orderId);
            setOrder(data);
        } catch (err: any) {
            console.error('Error fetching order:', err);
            setError('خطا در دریافت اطلاعات سفارش');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueShopping = () => {
        router.push('/shop');
    };

    const handleViewOrders = () => {
        router.push('/account/orders');
    };

    if (loading) {
        return (
            <div className={styles.confirmationContainer}>
                <Navbar logo={logo} />
                <LoadingSpinner message="در حال بارگذاری اطلاعات سفارش..." fullPage />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className={styles.confirmationContainer}>
                <Navbar logo={logo} />
                <div className={styles.errorContainer}>
                    <ErrorMessage message={error || 'اطلاعات سفارش یافت نشد'} />
                    <button
                        className={styles.actionButton}
                        onClick={handleContinueShopping}
                    >
                        <FaHome />
                        بازگشت به فروشگاه
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.confirmationContainer}>
            <Navbar logo={logo} />

            <div className={styles.contentContainer}>
                <div className={styles.successHeader}>
                    <div className={styles.successIcon}>
                        <FaCheckCircle />
                    </div>
                    <h1 className={styles.successTitle}>سفارش شما با موفقیت ثبت شد</h1>
                    <p className={styles.orderNumber}>
                        شماره سفارش: <span>{order.id}</span>
                    </p>
                </div>

                <div className={styles.orderDetailsCard}>
                    <h2 className={styles.sectionTitle}>اطلاعات سفارش</h2>

                    <div className={styles.orderInfo}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>وضعیت سفارش:</span>
                            <span className={styles.infoValue}>
                {order.status === 'pending' && 'در انتظار پرداخت'}
                                {order.status === 'processing' && 'در حال پردازش'}
                                {order.status === 'shipped' && 'ارسال شده'}
                                {order.status === 'delivered' && 'تحویل داده شده'}
                                {order.status === 'canceled' && 'لغو شده'}
              </span>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>تاریخ ثبت سفارش:</span>
                            <span className={styles.infoValue}>
                {toPersianNumber(new Date(order.created_at).toLocaleDateString('fa-IR'))}
              </span>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>آدرس ارسال:</span>
                            <span className={styles.infoValue}>{order.shipping_address}</span>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>شماره تماس:</span>
                            <span className={styles.infoValue}>{toPersianNumber(order.phone_number)}</span>
                        </div>
                    </div>

                    <div className={styles.orderedItems}>
                        <h3>اقلام سفارش</h3>
                        {order.items.map((item) => (
                            <div key={item.id} className={styles.orderItem}>
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
                                    <h4 className={styles.itemTitle}>{item.product.title}</h4>
                                    <div className={styles.itemMeta}>
                                        <span className={styles.itemQuantity}>{toPersianNumber(item.quantity)} عدد</span>
                                        <span className={styles.itemPrice}>{formatPrice(item.price, false)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.orderSummary}>
                        <div className={styles.summaryRow}>
                            <span>مبلغ کل:</span>
                            <span>{formatPrice(order.total_amount, true)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.actionsContainer}>
                    <button
                        className={`${styles.actionButton} ${styles.shopButton}`}
                        onClick={handleContinueShopping}
                    >
                        <FaHome />
                        ادامه خرید
                    </button>
                    <button
                        className={styles.actionButton}
                        onClick={handleViewOrders}
                    >
                        <FaListAlt />
                        مشاهده سفارش‌ها
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;