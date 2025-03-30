'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import logo from '@/assets/images/logo2.png';
import styles from './PaymentFailedPage.module.scss';
import { FaTimesCircle, FaExclamationTriangle, FaArrowLeft, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';

const PaymentFailedPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshCart } = useCart();
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        // Get error details from URL parameters
        const code = searchParams.get('error_code');
        const message = searchParams.get('error_message');

        setErrorCode(code);

        // Set appropriate error message based on code or use default
        if (message) {
            setErrorMessage(decodeURIComponent(message));
        } else if (code === 'insufficient_funds') {
            setErrorMessage('موجودی کافی نیست. لطفاً از روش پرداخت دیگری استفاده کنید.');
        } else if (code === 'card_declined') {
            setErrorMessage('کارت شما توسط بانک رد شد. لطفاً با بانک خود تماس بگیرید یا از کارت دیگری استفاده کنید.');
        } else if (code === 'expired_card') {
            setErrorMessage('کارت شما منقضی شده است. لطفاً از کارت دیگری استفاده کنید.');
        } else if (code === 'timeout') {
            setErrorMessage('زمان پرداخت به پایان رسید. لطفاً دوباره تلاش کنید.');
        } else {
            setErrorMessage('پرداخت با مشکل مواجه شد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.');
        }

        // Make sure cart is refreshed
        refreshCart();
    }, [searchParams, refreshCart]);

    const handleRetryPayment = () => {
        router.push('/checkout');
    };

    const handleBackToCart = () => {
        router.push('/cart');
    };

    const handleContinueShopping = () => {
        router.push('/shop');
    };

    return (
        <div className={styles.paymentFailedContainer}>
            <Navbar logo={logo} />
            <Toaster position="top-center" />

            <div className={styles.contentContainer}>
                <div className={styles.failureCard}>
                    <div className={styles.iconContainer}>
                        <FaTimesCircle className={styles.failureIcon} />
                    </div>

                    <h1 className={styles.title}>پرداخت ناموفق</h1>

                    <div className={styles.errorInfo}>
                        <FaExclamationTriangle className={styles.warningIcon} />
                        <p className={styles.errorMessage}>{errorMessage}</p>
                    </div>

                    <div className={styles.actionsContainer}>
                        <button
                            className={`${styles.actionButton} ${styles.retryButton}`}
                            onClick={handleRetryPayment}
                        >
                            <FaCreditCard />
                            تلاش مجدد پرداخت
                        </button>

                        <button
                            className={`${styles.actionButton} ${styles.cartButton}`}
                            onClick={handleBackToCart}
                        >
                            <FaShoppingCart />
                            بازگشت به سبد خرید
                        </button>

                        <button
                            className={`${styles.actionButton} ${styles.shopButton}`}
                            onClick={handleContinueShopping}
                        >
                            <FaArrowLeft />
                            ادامه خرید
                        </button>
                    </div>

                    <div className={styles.supportInfo}>
                        <p>اگر مشکل همچنان ادامه دارد، لطفاً با پشتیبانی ما تماس بگیرید.</p>
                        <p className={styles.supportContact}>support@derakhtyari.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;