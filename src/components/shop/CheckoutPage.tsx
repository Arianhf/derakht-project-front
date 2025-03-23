'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import styles from './checkout.module.scss';
import logo from '@/assets/images/logo2.png';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { PaymentMethod } from '@/components/checkout/PaymentMethod';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { Toaster } from 'react-hot-toast';
import { FaArrowRight, FaSpinner, FaEdit } from 'react-icons/fa';
import { shopService } from '@/services/shopService';
import toast from 'react-hot-toast';

// Checkout steps
enum CheckoutStep {
    SHIPPING = 'shipping',
    PAYMENT = 'payment',
    REVIEW = 'review',
}

const CheckoutPage: React.FC = () => {
    const router = useRouter();
    const { cartDetails, clearCart } = useCart();
    const { user } = useUser();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string | null>(null);
    const [useDefaultAddress, setUseDefaultAddress] = useState<boolean>(true);

    // Form state
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        phoneNumber: '',
    });

    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');

    useEffect(() => {
        // Redirect to cart if there are no items
        if (cartDetails && cartDetails.items.length === 0) {
            router.push('/cart');
        }

        // Load default address if available
        if (user?.default_address && useDefaultAddress) {
            setShippingInfo({
                fullName: user.default_address.recipient_name || `${user.first_name} ${user.last_name}`,
                address: user.default_address.address || '',
                city: user.default_address.city || '',
                province: user.default_address.province || '',
                postalCode: user.default_address.postal_code || '',
                phoneNumber: user.default_address.phone_number || user.phone_number || '',
            });
        }
    }, [cartDetails, router, user, useDefaultAddress]);

    // Check if we're returning from a payment gateway
    useEffect(() => {
        const handlePaymentReturn = async () => {
            // Get query parameters
            const urlParams = new URLSearchParams(window.location.search);
            const returnedOrderId = urlParams.get('order_id');
            const status = urlParams.get('status');
            const transactionId = urlParams.get('transaction_id');

            if (returnedOrderId && status && transactionId) {
                setLoading(true);
                try {
                    // Verify the payment with the backend
                    const result = await shopService.verifyPayment(returnedOrderId, transactionId);

                    if (result.status === 'success') {
                        toast.success('پرداخت با موفقیت انجام شد');
                        await clearCart(); // Clear the cart after successful payment
                        router.push(`/shop/order-confirmation/${returnedOrderId}`);
                    } else {
                        toast.error('پرداخت ناموفق بود. لطفا مجددا تلاش کنید.');
                        setError('پرداخت ناموفق بود. لطفا مجددا تلاش کنید.');
                    }
                } catch (err) {
                    console.error('Error verifying payment:', err);
                    toast.error('خطا در تایید پرداخت');
                    setError('خطا در تایید پرداخت. لطفا با پشتیبانی تماس بگیرید.');
                } finally {
                    setLoading(false);
                }
            }
        };

        handlePaymentReturn();
    }, [router, clearCart]);

    const handleToggleAddressMode = () => {
        setUseDefaultAddress(!useDefaultAddress);

        if (!useDefaultAddress && user?.default_address) {
            // Switch back to default address
            setShippingInfo({
                fullName: user.default_address.recipient_name || `${user.first_name} ${user.last_name}`,
                address: user.default_address.address || '',
                city: user.default_address.city || '',
                province: user.default_address.province || '',
                postalCode: user.default_address.postal_code || '',
                phoneNumber: user.default_address.phone_number || user.phone_number || '',
            });
        }
    };

    const handleShippingSubmit = (data: any) => {
        setShippingInfo(data);
        setCurrentStep(CheckoutStep.PAYMENT);
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = (method: 'online' | 'cash') => {
        setPaymentMethod(method);
        setCurrentStep(CheckoutStep.REVIEW);
        window.scrollTo(0, 0);
    };

    const handleBackToShipping = () => {
        setCurrentStep(CheckoutStep.SHIPPING);
        window.scrollTo(0, 0);
    };

    const handleBackToPayment = () => {
        setCurrentStep(CheckoutStep.PAYMENT);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            const ShippingInfo = {
                address: shippingInfo.address,
                city: shippingInfo.city,
                province: shippingInfo.province,
                postal_code: shippingInfo.postalCode,
                recipient_name: shippingInfo.fullName,
                phone_number: shippingInfo.phoneNumber
            };

            // Call checkout API with properly formatted data
            const order = await shopService.checkout(ShippingInfo);
            setOrderId(order.id);

            if (paymentMethod === 'online') {
                // Request payment for online payment method
                const paymentResponse = await shopService.requestPayment(order.id);

                if (paymentResponse.payment_url) {
                    // Redirect to payment gateway
                    window.location.href = paymentResponse.payment_url;
                } else {
                    throw new Error('دریافت آدرس درگاه پرداخت با خطا مواجه شد');
                }
            } else {
                // For cash on delivery, just proceed to confirmation
                await clearCart();
                router.push(`/shop/order-confirmation/${order.id}`);
            }
        } catch (err: any) {
            console.error('Error placing order:', err);
            setError(err.message || 'خطا در ثبت سفارش. لطفا مجددا تلاش کنید.');
        } finally {
            setLoading(false);
        }
    };

    const goBackToCart = () => {
        router.push('/cart');
    };

    if (!cartDetails) {
        return (
            <div className={styles.checkoutContainer}>
                <Navbar logo={logo} />
                <div className={styles.loadingContainer}>
                    <FaSpinner className={styles.spinner} />
                    <p>در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    const renderShippingStep = () => {
        if (user?.default_address && useDefaultAddress) {
            return (
                <div className={styles.defaultAddressContainer}>
                    <h2 className={styles.sectionTitle}>آدرس ارسال</h2>

                    <div className={styles.addressCard}>
                        <div className={styles.addressDetails}>
                            <div className={styles.addressHeader}>
                                <h3>{shippingInfo.fullName}</h3>
                                <button
                                    className={styles.editButton}
                                    onClick={handleToggleAddressMode}
                                >
                                    <FaEdit /> تغییر آدرس
                                </button>
                            </div>
                            <p>{shippingInfo.address}</p>
                            <p>{shippingInfo.city}، {shippingInfo.province}</p>
                            <p>کد پستی: {toPersianNumber(shippingInfo.postalCode)}</p>
                            <p>شماره تماس: {toPersianNumber(shippingInfo.phoneNumber)}</p>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            className={styles.continueButton}
                            onClick={() => setCurrentStep(CheckoutStep.PAYMENT)}
                        >
                            ادامه به پرداخت
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <ShippingForm
                initialData={shippingInfo}
                onSubmit={handleShippingSubmit}
                onCancel={user?.default_address ? handleToggleAddressMode : undefined}
            />
        );
    };

    return (
        <div className={styles.checkoutContainer}>
            <Navbar logo={logo} />
            <Toaster position="top-center" />

            <div className={styles.contentContainer}>
                <div className={styles.breadcrumbs}>
                    <button onClick={goBackToCart} className={styles.backButton}>
                        <FaArrowRight /> بازگشت به سبد خرید
                    </button>
                </div>

                <h1 className={styles.pageTitle}>تکمیل خرید</h1>

                <div className={styles.checkoutSteps}>
                    <div className={`${styles.step} ${currentStep === CheckoutStep.SHIPPING ? styles.active : ''} ${currentStep === CheckoutStep.PAYMENT || currentStep === CheckoutStep.REVIEW ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>1</span>
                        <span className={styles.stepTitle}>اطلاعات ارسال</span>
                    </div>
                    <div className={`${styles.step} ${currentStep === CheckoutStep.PAYMENT ? styles.active : ''} ${currentStep === CheckoutStep.REVIEW ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>2</span>
                        <span className={styles.stepTitle}>روش پرداخت</span>
                    </div>
                    <div className={`${styles.step} ${currentStep === CheckoutStep.REVIEW ? styles.active : ''}`}>
                        <span className={styles.stepNumber}>3</span>
                        <span className={styles.stepTitle}>بررسی سفارش</span>
                    </div>
                </div>

                <div className={styles.checkoutContent}>
                    <div className={styles.formContainer}>
                        {currentStep === CheckoutStep.SHIPPING && renderShippingStep()}

                        {currentStep === CheckoutStep.PAYMENT && (
                            <PaymentMethod
                                selectedMethod={paymentMethod}
                                onSubmit={handlePaymentSubmit}
                                onBack={handleBackToShipping}
                            />
                        )}

                        {currentStep === CheckoutStep.REVIEW && (
                            <div className={styles.reviewContainer}>
                                <h2 className={styles.sectionTitle}>بررسی سفارش</h2>

                                <div className={styles.reviewSection}>
                                    <h3>آدرس ارسال</h3>
                                    <p>{shippingInfo.fullName}</p>
                                    <p>{shippingInfo.address}</p>
                                    <p>{shippingInfo.city}، {shippingInfo.province}</p>
                                    <p>کد پستی: {toPersianNumber(shippingInfo.postalCode)}</p>
                                    <p>شماره تماس: {toPersianNumber(shippingInfo.phoneNumber)}</p>
                                    <button
                                        className={styles.editButton}
                                        onClick={handleBackToShipping}
                                    >
                                        ویرایش
                                    </button>
                                </div>

                                <div className={styles.reviewSection}>
                                    <h3>روش پرداخت</h3>
                                    <p>{paymentMethod === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل'}</p>
                                    <button
                                        className={styles.editButton}
                                        onClick={handleBackToPayment}
                                    >
                                        ویرایش
                                    </button>
                                </div>

                                <div className={styles.placeOrderContainer}>
                                    {error && <p className={styles.errorMessage}>{error}</p>}
                                    <button
                                        className={styles.placeOrderButton}
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className={styles.spinner} />
                                                در حال پردازش...
                                            </>
                                        ) : (
                                            paymentMethod === 'online' ? 'پرداخت و ثبت سفارش' : 'ثبت سفارش'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.summaryContainer}>
                        <OrderSummary cartDetails={cartDetails} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;