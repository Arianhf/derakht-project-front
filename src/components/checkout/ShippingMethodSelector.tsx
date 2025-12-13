import React from 'react';
import styles from './ShippingMethodSelector.module.scss';
import { ShippingMethod } from '@/types/shop';
import { toPersianNumber, formatPrice } from '@/utils/convertToPersianNumber';
import { FaTruck, FaMotorcycle, FaClock, FaCheckCircle } from 'react-icons/fa';

interface ShippingMethodSelectorProps {
    methods: ShippingMethod[];
    selectedMethodId: string | null;
    onSelect: (method: ShippingMethod) => void;
    loading?: boolean;
    freeShippingMessage?: string;
}

export const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
    methods,
    selectedMethodId,
    onSelect,
    loading = false,
    freeShippingMessage,
}) => {
    if (loading) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>روش ارسال</h2>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>در حال بارگذاری روش‌های ارسال...</p>
                </div>
            </div>
        );
    }

    if (!methods || methods.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>روش ارسال</h2>
                <div className={styles.error}>
                    <p>هیچ روش ارسالی برای این آدرس یافت نشد</p>
                </div>
            </div>
        );
    }

    const getDeliveryEstimate = (method: ShippingMethod): string => {
        if (method.estimated_delivery_hours_min && method.estimated_delivery_hours_max) {
            return `${toPersianNumber(method.estimated_delivery_hours_min)} تا ${toPersianNumber(method.estimated_delivery_hours_max)} ساعت`;
        }
        if (method.estimated_delivery_days_min && method.estimated_delivery_days_max) {
            return `${toPersianNumber(method.estimated_delivery_days_min)} تا ${toPersianNumber(method.estimated_delivery_days_max)} روز کاری`;
        }
        return '';
    };

    const getMethodIcon = (methodId: string) => {
        switch (methodId) {
            case 'express':
                return <FaMotorcycle className={styles.methodIcon} />;
            case 'standard_post':
            default:
                return <FaTruck className={styles.methodIcon} />;
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>روش ارسال</h2>

            {freeShippingMessage && (
                <div className={styles.freeShippingBanner}>
                    <FaCheckCircle className={styles.bannerIcon} />
                    <span>{freeShippingMessage}</span>
                </div>
            )}

            <div className={styles.methodsList}>
                {methods.map((method) => {
                    const isSelected = selectedMethodId === method.id;
                    const deliveryEstimate = getDeliveryEstimate(method);

                    return (
                        <div
                            key={method.id}
                            className={`${styles.methodCard} ${isSelected ? styles.selected : ''} ${!method.is_available ? styles.disabled : ''}`}
                            onClick={() => method.is_available && onSelect(method)}
                        >
                            <div className={styles.methodHeader}>
                                <div className={styles.methodInfo}>
                                    {getMethodIcon(method.id)}
                                    <div className={styles.methodDetails}>
                                        <h3 className={styles.methodName}>{method.name}</h3>
                                        <p className={styles.methodDescription}>{method.description}</p>
                                    </div>
                                </div>

                                <div className={styles.methodPrice}>
                                    {method.is_free ? (
                                        <span className={styles.freeTag}>رایگان</span>
                                    ) : (
                                        <>
                                            {method.original_cost !== method.cost && (
                                                <span className={styles.originalPrice}>
                                                    {formatPrice(method.original_cost, false)}
                                                </span>
                                            )}
                                            <span className={styles.finalPrice}>
                                                {formatPrice(method.cost, false)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {deliveryEstimate && (
                                <div className={styles.deliveryEstimate}>
                                    <FaClock className={styles.clockIcon} />
                                    <span>زمان تحویل: {deliveryEstimate}</span>
                                </div>
                            )}

                            {isSelected && (
                                <div className={styles.selectedIndicator}>
                                    <FaCheckCircle />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
