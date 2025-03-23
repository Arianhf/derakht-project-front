import React, { useState } from 'react';
import styles from './ShippingForm.module.scss';

interface ShippingFormProps {
    initialData: {
        fullName: string;
        address: string;
        city: string;
        province: string;
        postalCode: string;
        phoneNumber: string;
    };
    onSubmit: (data: any) => void;
    onCancel?: () => void; // Optional cancel handler for returning to default address
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'لطفا نام و نام خانوادگی را وارد کنید';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'لطفا آدرس را وارد کنید';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'لطفا شهر را وارد کنید';
        }

        if (!formData.province.trim()) {
            newErrors.province = 'لطفا استان را وارد کنید';
        }

        if (!formData.postalCode.trim()) {
            newErrors.postalCode = 'لطفا کد پستی را وارد کنید';
        } else if (!/^\d{10}$/.test(formData.postalCode)) {
            newErrors.postalCode = 'کد پستی باید 10 رقم باشد';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'لطفا شماره تماس را وارد کنید';
        } else if (!/^09\d{9}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'شماره تماس باید با 09 شروع شود و 11 رقم باشد';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    // List of Iranian provinces
    const provinces = [
        'آذربایجان شرقی',
        'آذربایجان غربی',
        'اردبیل',
        'اصفهان',
        'البرز',
        'ایلام',
        'بوشهر',
        'تهران',
        'چهارمحال و بختیاری',
        'خراسان جنوبی',
        'خراسان رضوی',
        'خراسان شمالی',
        'خوزستان',
        'زنجان',
        'سمنان',
        'سیستان و بلوچستان',
        'فارس',
        'قزوین',
        'قم',
        'کردستان',
        'کرمان',
        'کرمانشاه',
        'کهگیلویه و بویراحمد',
        'گلستان',
        'گیلان',
        'لرستان',
        'مازندران',
        'مرکزی',
        'هرمزگان',
        'همدان',
        'یزد',
    ];

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

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="fullName">نام و نام خانوادگی *</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={errors.fullName ? styles.inputError : ''}
                    />
                    {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">شماره تماس *</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="09123456789"
                        className={errors.phoneNumber ? styles.inputError : ''}
                    />
                    {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="province">استان *</label>
                    <select
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className={errors.province ? styles.inputError : ''}
                    >
                        <option value="">انتخاب استان</option>
                        {provinces.map(province => (
                            <option key={province} value={province}>{province}</option>
                        ))}
                    </select>
                    {errors.province && <span className={styles.errorMessage}>{errors.province}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="city">شهر *</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={errors.city ? styles.inputError : ''}
                    />
                    {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address">آدرس کامل *</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? styles.inputError : ''}
                    />
                    {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="postalCode">کد پستی *</label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="1234567890"
                        className={errors.postalCode ? styles.inputError : ''}
                    />
                    {errors.postalCode && <span className={styles.errorMessage}>{errors.postalCode}</span>}
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.continueButton}>
                        ادامه به پرداخت
                    </button>
                </div>
            </form>
        </div>
    );
};