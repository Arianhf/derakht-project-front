'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { userService } from '@/services/userService';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { FaBox, FaUser, FaMapMarkerAlt, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import styles from './AccountDashboard.module.scss';

interface RecentOrder {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
}

const AccountDashboard: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                setLoading(true);
                const response = await userService.getOrders(1, 3); // Get first 3 orders
                setRecentOrders(response.results || []);
            } catch (error) {
                console.error('Error fetching recent orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentOrders();
    }, []);

    const getStatusText = (status: string) => {
        // Convert status to lowercase for comparison
        const statusLower = status.toLowerCase();

        switch (statusLower) {
            case 'cart': return 'در سبد خرید';
            case 'pending': return 'در انتظار پرداخت';
            case 'processing': return 'در حال پردازش';
            case 'shipped': return 'ارسال شده';
            case 'delivered': return 'تحویل داده شده';
            case 'canceled': return 'لغو شده';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        // Convert status to lowercase for comparison
        const statusLower = status.toLowerCase();

        switch (statusLower) {
            case 'cart': return styles.pending;
            case 'pending': return styles.pending;
            case 'processing': return styles.processing;
            case 'shipped': return styles.shipped;
            case 'delivered': return styles.delivered;
            case 'canceled': return styles.canceled;
            default: return '';
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>داشبورد</h1>

            <div className={styles.welcomeSection}>
                <h2>خوش آمدید، {user?.first_name || 'کاربر گرامی'}</h2>
                <p>از این بخش می‌توانید اطلاعات حساب و سفارش‌های خود را مدیریت کنید.</p>
            </div>

            <div className={styles.cardGrid}>
                <div className={styles.card}>
                    <div className={styles.cardIcon}>
                        <FaUser />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>پروفایل من</h3>
                        <p>مدیریت اطلاعات شخصی</p>
                        <button
                            className={styles.cardButton}
                            onClick={() => router.push('/account/profile')}
                        >
                            ویرایش پروفایل <FaArrowLeft size={12} />
                        </button>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardIcon}>
                        <FaBox />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>سفارش‌های من</h3>
                        <p>مشاهده و پیگیری سفارش‌ها</p>
                        <button
                            className={styles.cardButton}
                            onClick={() => router.push('/account/orders')}
                        >
                            مشاهده سفارش‌ها <FaArrowLeft size={12} />
                        </button>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardIcon}>
                        <FaMapMarkerAlt />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>آدرس‌ها</h3>
                        <p>مدیریت آدرس‌های تحویل</p>
                        <button
                            className={styles.cardButton}
                            onClick={() => router.push('/account/profile')}
                        >
                            مدیریت آدرس‌ها <FaArrowLeft size={12} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.recentOrdersSection}>
                <div className={styles.sectionHeader}>
                    <h2>سفارش‌های اخیر</h2>
                    <button
                        className={styles.viewAllButton}
                        onClick={() => router.push('/account/orders')}
                    >
                        مشاهده همه
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loadingState}>
                        <FaSpinner className="animate-spin" style={{ fontSize: '24px', marginBottom: '10px' }} />
                        <p>در حال بارگذاری...</p>
                    </div>
                ) : recentOrders.length > 0 ? (
                    <div className={styles.recentOrdersTable}>
                        <div className={styles.tableHeader}>
                            <div className={styles.orderIdColumn}>شماره سفارش</div>
                            <div className={styles.dateColumn}>تاریخ</div>
                            <div className={styles.statusColumn}>وضعیت</div>
                            <div className={styles.totalColumn}>مبلغ</div>
                            <div className={styles.actionColumn}></div>
                        </div>

                        {recentOrders.map(order => (
                            <div key={order.id} className={styles.tableRow}>
                                <div className={styles.orderIdColumn}>{order.id.substring(0, 8)}</div>
                                <div className={styles.dateColumn}>
                                    {toPersianNumber(new Date(order.created_at).toLocaleDateString('fa-IR'))}
                                </div>
                                <div className={styles.statusColumn}>
                                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                                <div className={styles.totalColumn}>
                                    {toPersianNumber(order.total_amount)} تومان
                                </div>
                                <div className={styles.actionColumn}>
                                    <button
                                        className={styles.viewButton}
                                        onClick={() => router.push(`/account/orders/${order.id}`)}
                                    >
                                        مشاهده
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>هنوز سفارشی ثبت نکرده‌اید.</p>
                        <button
                            className={styles.shopButton}
                            onClick={() => router.push('/shop')}
                        >
                            مشاهده محصولات
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountDashboard;