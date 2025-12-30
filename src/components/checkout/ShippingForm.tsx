import React from 'react';
import AddressForm, { AddressFormData } from '@/components/shared/AddressForm/AddressForm';
import styles from './ShippingForm.module.scss';

interface ShippingFormProps {
    initialData: AddressFormData;
    onSubmit: (data: AddressFormData) => void;
    onCancel?: () => void; // Optional cancel handler for returning to default address
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ initialData, onSubmit, onCancel }) => {
    return (
        <div className={styles.shippingFormContainer}>
            <h2 className={styles.formTitle}>اطلاعات ارسال</h2>

            {onCancel && (
                <div className={styles.defaultAddressToggle}>
                    <button onClick={onCancel} className={styles.useDefaultButton}>
                        استفاده از آدرس پیش‌فرض
                    </button>
                </div>
            )}

            <AddressForm
                initialData={initialData}
                onSubmit={onSubmit}
                submitLabel="ادامه به پرداخت"
            />
        </div>
    );
};
