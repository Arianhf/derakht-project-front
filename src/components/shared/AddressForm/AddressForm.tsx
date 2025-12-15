import React, { useState } from 'react';
import FormInput from '../Form/FormInput';
import FormSelect from '../Form/FormSelect';
import { IRANIAN_PROVINCES } from '@/constants/iranianProvinces';
import styles from './AddressForm.module.scss';

export interface AddressFormData {
  fullName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
}

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  showCancelButton?: boolean;
}

const defaultFormData: AddressFormData = {
  fullName: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  phoneNumber: '',
};

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'ادامه',
  cancelLabel = 'انصراف',
  showCancelButton = false,
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof AddressFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof AddressFormData];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};

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
      newErrors.province = 'لطفا استان را انتخاب کنید';
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

  return (
    <form onSubmit={handleSubmit} className={styles.addressForm}>
      <FormInput
        label="نام و نام خانوادگی"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        required
      />

      <FormInput
        label="شماره تماس"
        name="phoneNumber"
        type="tel"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="09123456789"
        error={errors.phoneNumber}
        required
      />

      <FormSelect
        label="استان"
        name="province"
        value={formData.province}
        onChange={handleChange}
        options={IRANIAN_PROVINCES}
        placeholder="انتخاب استان"
        error={errors.province}
        required
      />

      <FormInput
        label="شهر"
        name="city"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
        required
      />

      <FormInput
        label="آدرس کامل"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        required
      />

      <FormInput
        label="کد پستی"
        name="postalCode"
        type="text"
        value={formData.postalCode}
        onChange={handleChange}
        placeholder="1234567890"
        error={errors.postalCode}
        required
      />

      <div className={styles.formActions}>
        {showCancelButton && onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            {cancelLabel}
          </button>
        )}
        <button type="submit" className={styles.submitButton}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
