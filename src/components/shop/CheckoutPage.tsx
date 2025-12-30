'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowRight, FaSpinner, FaEdit } from 'react-icons/fa';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { PaymentMethod } from '@/components/checkout/PaymentMethod';
import { CardToCardPayment } from '@/components/checkout/CardToCardPayment';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingMethodSelector } from '@/components/checkout/ShippingMethodSelector';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { shopService } from '@/services/shopService';
import { ShippingMethod, ShippingEstimateResponse } from '@/types/shop';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';
import logo from '@/assets/images/logo2.png';
import styles from './CheckoutPage.module.scss';

// Checkout steps
enum CheckoutStep {
    SHIPPING = 'shipping',
    SHIPPING_METHOD = 'shipping_method',
    PAYMENT = 'payment',
    CARD_TO_CARD = 'card_to_card',
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

    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash' | 'card_to_card'>('card_to_card');
    const [receiptImage, setReceiptImage] = useState<File | null>(null);

    // Shipping method state
    const [availableShippingMethods, setAvailableShippingMethods] = useState<ShippingMethod[]>([]);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
    const [loadingShippingMethods, setLoadingShippingMethods] = useState<boolean>(false);
    const [shippingEstimateMessage, setShippingEstimateMessage] = useState<string>('');

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
            const errorCode = urlParams.get('error_code') || 'unknown';
            const errorMessage = urlParams.get('error_message') || 'خطا در پرداخت';

            // Case 1: Payment gateway returned with success status and transaction ID
            if (returnedOrderId && status === 'success' && transactionId) {
                setLoading(true);
                try {
                    // Verify the payment with the backend
                    const result = await shopService.verifyPayment(returnedOrderId, transactionId);

                    if (result.status === 'success') {
                        toast.success('پرداخت با موفقیت انجام شد');
                        await clearCart(false);  // Clear the cart without refreshing (redirecting away)
                        router.push(`/shop/order-confirmation/${returnedOrderId}`);
                    } else {
                        // Backend verification failed
                        const resultErrorCode = result.error_code || errorCode;
                        const resultErrorMessage = encodeURIComponent(result.error_message || errorMessage);
                        router.push(`/shop/payment-failed?order_id=${returnedOrderId}&error_code=${resultErrorCode}&error_message=${resultErrorMessage}`);
                    }
                } catch (err: unknown) {
                    console.error('Error verifying payment:', err);
                    // Extract error message safely
                    const errorMessage = err && typeof err === 'object' && 'message' in err
                        ? String((err as { message?: string }).message)
                        : 'خطا در تایید پرداخت';
                    // Redirect to payment failed page with error details
                    router.push(`/shop/payment-failed?order_id=${returnedOrderId}&error_code=api_error&error_message=${encodeURIComponent(errorMessage)}`);
                } finally {
                    setLoading(false);
                }
            }
            // Case 2: Payment gateway returned with failure status or missing transaction ID
            else if (returnedOrderId && (status === 'failed' || !transactionId)) {
                // Direct failure from payment gateway
                router.push(`/shop/payment-failed?order_id=${returnedOrderId}&error_code=${errorCode}&error_message=${encodeURIComponent(decodeURIComponent(errorMessage))}`);
            }
            // Case 3: Payment gateway returned with other status (canceled, etc.)
            else if (returnedOrderId && status) {
                router.push(`/shop/payment-failed?order_id=${returnedOrderId}&error_code=${status}&error_message=${encodeURIComponent('پرداخت توسط کاربر لغو شد')}`);
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

    const fetchShippingMethods = async (province: string, city: string) => {
        try {
            setLoadingShippingMethods(true);
            const response: ShippingEstimateResponse = await shopService.getShippingEstimate(province, city);
            setAvailableShippingMethods(response.shipping_methods);
            setShippingEstimateMessage(response.message || '');

            // Auto-select first available method
            if (response.shipping_methods.length > 0) {
                setSelectedShippingMethod(response.shipping_methods[0]);
            }
        } catch (err) {
            console.error('Error fetching shipping methods:', err);
            toast.error('خطا در دریافت روش‌های ارسال');
            setAvailableShippingMethods([]);
        } finally {
            setLoadingShippingMethods(false);
        }
    };

    const handleShippingSubmit = async (data: any) => {
        setShippingInfo(data);

        // Fetch shipping methods based on entered address
        await fetchShippingMethods(data.province, data.city);

        setCurrentStep(CheckoutStep.SHIPPING_METHOD);
        window.scrollTo(0, 0);
    };

    const handleShippingMethodSubmit = () => {
        if (!selectedShippingMethod) {
            toast.error('لطفاً روش ارسال را انتخاب کنید');
            return;
        }
        setCurrentStep(CheckoutStep.PAYMENT);
        window.scrollTo(0, 0);
    };

    const handleShippingMethodSelect = (method: ShippingMethod) => {
        setSelectedShippingMethod(method);
    };

    const handlePaymentSubmit = (method: 'online' | 'cash' | 'card_to_card') => {
        setPaymentMethod(method);
        // If card-to-card is selected, go to card-to-card step
        if (method === 'card_to_card') {
            setCurrentStep(CheckoutStep.CARD_TO_CARD);
        } else {
            setCurrentStep(CheckoutStep.REVIEW);
        }
        window.scrollTo(0, 0);
    };

    const handleCardToCardSubmit = (receipt: File) => {
        setReceiptImage(receipt);
        setCurrentStep(CheckoutStep.REVIEW);
        window.scrollTo(0, 0);
    };

    const handleBackToCardToCard = () => {
        setCurrentStep(CheckoutStep.CARD_TO_CARD);
        window.scrollTo(0, 0);
    };

    const handleBackToShipping = () => {
        setCurrentStep(CheckoutStep.SHIPPING);
        window.scrollTo(0, 0);
    };

    const handleBackToShippingMethod = () => {
        setCurrentStep(CheckoutStep.SHIPPING_METHOD);
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

            if (!selectedShippingMethod) {
                toast.error('لطفاً روش ارسال را انتخاب کنید');
                return;
            }

            const ShippingInfo = {
                address: shippingInfo.address,
                city: shippingInfo.city,
                province: shippingInfo.province,
                postal_code: shippingInfo.postalCode,
                recipient_name: shippingInfo.fullName,
                phone_number: shippingInfo.phoneNumber,
                shipping_method_id: selectedShippingMethod.id
            };

            // Call checkout API with properly formatted data
            const order = await shopService.checkout(ShippingInfo);
            setOrderId(order.id);

            if (paymentMethod === 'online') {
                // Request payment for online payment method
                const paymentResponse = await shopService.requestPayment(order.id, "zarinpal_sdk");

                if (paymentResponse.payment_url) {
                    // Redirect to payment gateway
                    window.location.href = paymentResponse.payment_url;
                } else {
                    // If we can't get payment URL, redirect to payment failed page
                    router.push(`/shop/payment-failed?order_id=${order.id}&error_code=payment_init_failed&error_message=${encodeURIComponent('خطا در ایجاد درخواست پرداخت')}`);
                }
            } else if (paymentMethod === 'card_to_card') {
                // For card-to-card payment, upload receipt and proceed to confirmation
                if (receiptImage) {
                    await shopService.uploadPaymentReceipt(order.id, receiptImage);
                }
                await clearCart(false);  // Clear the cart without refreshing (redirecting away)
                toast.success('سفارش شما با موفقیت ثبت شد. پس از بررسی رسید، سفارش شما تایید خواهد شد.');
                router.push(`/shop/order-confirmation/${order.id}`);
            } else {
                // For cash on delivery, just proceed to confirmation
                await clearCart(false);  // Clear the cart without refreshing (redirecting away)
                router.push(`/shop/order-confirmation/${order.id}`);
            }
        } catch (err: unknown) {
            console.error('Error placing order:', err);

            // Extract error message safely
            const errorMessage = err && typeof err === 'object' && 'message' in err
                ? String((err as { message?: string }).message)
                : 'خطا در ثبت سفارش';

            // Instead of just setting an error, redirect to payment failed page
            if (orderId) {
                router.push(`/shop/payment-failed?order_id=${orderId}&error_code=order_processing&error_message=${encodeURIComponent(errorMessage)}`);
            } else {
                setError(`${errorMessage}. لطفا مجددا تلاش کنید.`);
            }
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
                    <div className={`${styles.step} ${currentStep === CheckoutStep.SHIPPING ? styles.active : ''} ${currentStep === CheckoutStep.SHIPPING_METHOD || currentStep === CheckoutStep.PAYMENT || currentStep === CheckoutStep.CARD_TO_CARD || currentStep === CheckoutStep.REVIEW ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>1</span>
                        <span className={styles.stepTitle}>آدرس ارسال</span>
                    </div>
                    <div className={`${styles.step} ${currentStep === CheckoutStep.SHIPPING_METHOD ? styles.active : ''} ${currentStep === CheckoutStep.PAYMENT || currentStep === CheckoutStep.CARD_TO_CARD || currentStep === CheckoutStep.REVIEW ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>2</span>
                        <span className={styles.stepTitle}>روش ارسال</span>
                    </div>
                    <div className={`${styles.step} ${currentStep === CheckoutStep.PAYMENT ? styles.active : ''} ${currentStep === CheckoutStep.CARD_TO_CARD || currentStep === CheckoutStep.REVIEW ? styles.completed : ''}`}>
                        <span className={styles.stepNumber}>3</span>
                        <span className={styles.stepTitle}>روش پرداخت</span>
                    </div>
                    {paymentMethod === 'card_to_card' && (
                        <div className={`${styles.step} ${currentStep === CheckoutStep.CARD_TO_CARD ? styles.active : ''} ${currentStep === CheckoutStep.REVIEW ? styles.completed : ''}`}>
                            <span className={styles.stepNumber}>4</span>
                            <span className={styles.stepTitle}>پرداخت کارت به کارت</span>
                        </div>
                    )}
                    <div className={`${styles.step} ${currentStep === CheckoutStep.REVIEW ? styles.active : ''}`}>
                        <span className={styles.stepNumber}>{paymentMethod === 'card_to_card' ? '5' : '4'}</span>
                        <span className={styles.stepTitle}>بررسی سفارش</span>
                    </div>
                </div>

                <div className={styles.checkoutContent}>
                    <div className={styles.formContainer}>
                        {currentStep === CheckoutStep.SHIPPING && renderShippingStep()}

                        {currentStep === CheckoutStep.SHIPPING_METHOD && (
                            <div className={styles.shippingMethodContainer}>
                                <ShippingMethodSelector
                                    methods={availableShippingMethods}
                                    selectedMethodId={selectedShippingMethod?.id || null}
                                    onSelect={handleShippingMethodSelect}
                                    loading={loadingShippingMethods}
                                    freeShippingMessage={shippingEstimateMessage}
                                />
                                <div className={styles.formActions}>
                                    <button
                                        className={styles.backButton}
                                        onClick={handleBackToShipping}
                                    >
                                        بازگشت
                                    </button>
                                    <button
                                        className={styles.continueButton}
                                        onClick={handleShippingMethodSubmit}
                                        disabled={!selectedShippingMethod}
                                    >
                                        ادامه به پرداخت
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === CheckoutStep.PAYMENT && (
                            <PaymentMethod
                                selectedMethod={paymentMethod}
                                onSubmit={handlePaymentSubmit}
                                onBack={handleBackToShippingMethod}
                            />
                        )}

                        {currentStep === CheckoutStep.CARD_TO_CARD && (
                            <CardToCardPayment
                                onSubmit={handleCardToCardSubmit}
                                onBack={handleBackToPayment}
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
                                    <h3>روش ارسال</h3>
                                    <p>{selectedShippingMethod?.name}</p>
                                    {selectedShippingMethod && (
                                        <p className={styles.shippingCost}>
                                            هزینه ارسال: {selectedShippingMethod.is_free ? 'رایگان' : formatPrice(selectedShippingMethod.cost, false)}
                                        </p>
                                    )}
                                    <button
                                        className={styles.editButton}
                                        onClick={handleBackToShippingMethod}
                                    >
                                        ویرایش
                                    </button>
                                </div>

                                <div className={styles.reviewSection}>
                                    <h3>روش پرداخت</h3>
                                    <p>
                                        {paymentMethod === 'online' && 'پرداخت آنلاین'}
                                        {paymentMethod === 'cash' && 'پرداخت در محل'}
                                        {paymentMethod === 'card_to_card' && 'کارت به کارت'}
                                    </p>
                                    {paymentMethod === 'card_to_card' && receiptImage && (
                                        <div className={styles.receiptPreview}>
                                            <p>رسید پرداخت آپلود شده ✓</p>
                                        </div>
                                    )}
                                    <button
                                        className={styles.editButton}
                                        onClick={paymentMethod === 'card_to_card' ? handleBackToCardToCard : handleBackToPayment}
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
                                            paymentMethod === 'online' ? 'پرداخت و ثبت سفارش' :
                                            paymentMethod === 'card_to_card' ? 'ثبت سفارش' : 'ثبت سفارش'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.summaryContainer}>
                        <OrderSummary
                            cartDetails={cartDetails}
                            selectedShippingMethod={selectedShippingMethod}
                            loadingShipping={loadingShippingMethods}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;