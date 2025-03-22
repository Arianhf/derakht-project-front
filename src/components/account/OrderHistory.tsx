'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { Order } from '@/types/shop';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import styles from './OrderHistory.module.scss';

const OrderHistory: React.FC = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = orders.filter(order =>
                order.id.includes(searchTerm)
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchTerm, orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await userService.getOrders(currentPage);
            setOrders(response.results);
            setFilteredOrders(response.results);
            setTotalItems(response.count);

            // Calculate total pages (10 items per page)
            const itemsPerPage = 10;
            const pages = Math.ceil(response.count / itemsPerPage);
            setTotalPages(pages);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is already handled by the useEffect
    };

    const handleViewOrder = (id: string) => {
        router.push(`/account/orders/${id}`);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                قبلی
            </button>
        );

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {toPersianNumber(i)}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                بعدی
            </button>
        );

        return pages;
    };

    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.pageTitle}>سفارش‌های من</h1>

            <div className={styles.searchContainer}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="جستجو بر اساس شماره سفارش..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton}>
                        <FaSearch />
                    </button>
                </form>
            </div>

            <div className={styles.ordersContent}>
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <FaSpinner className={styles.spinner} />
                        <p>در حال بارگذاری سفارش‌ها...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <>
                        <div className={styles.ordersTable}>
                            <div className={styles.tableHeader}>
                                <div className={styles.idColumn}>شماره سفارش</div>
                                <div className={styles.dateColumn}>تاریخ</div>
                                <div className={styles.statusColumn}>وضعیت</div>
                                <div className={styles.totalColumn}>مبلغ کل</div>
                                <div className={styles.actionColumn}></div>
                            </div>

                            {filteredOrders.map(order => (
                                <div key={order.id} className={styles.tableRow}>
                                    <div className={styles.idColumn}>{toPersianNumber(order.id.substring(0, 8))}</div>
                                    <div className={styles.dateColumn}>
                                        {toPersianNumber(new Date(order.created_at).toLocaleDateString('fa-IR'))}
                                    </div>
                                    <div className={styles.statusColumn}>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                                    </div>
                                    <div className={styles.totalColumn}>
                                        {toPersianNumber(Math.round(order.total_amount / 10000).toLocaleString())} تومان
                                    </div>
                                    <div className={styles.actionColumn}>
                                        <button
                                            className={styles.viewButton}
                                            onClick={() => handleViewOrder(order.id)}
                                        >
                                            جزئیات
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                {renderPagination()}
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.emptyOrders}>
                        <p>{searchTerm ? 'سفارشی با این شماره یافت نشد.' : 'هنوز سفارشی ثبت نکرده‌اید.'}</p>
                        {!searchTerm && (
                            <button
                                className={styles.shopButton}
                                onClick={() => router.push('/shop')}
                            >
                                مشاهده محصولات
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;