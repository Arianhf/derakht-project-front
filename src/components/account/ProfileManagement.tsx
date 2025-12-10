'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useUser, UserAddress } from '@/contexts/UserContext';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTrash, FaCamera } from 'react-icons/fa';
import styles from './ProfileManagement.module.scss';

const ProfileManagement: React.FC = () => {
    const { user, updateProfile, updateAddress, updateProfileImage, deleteProfileImage } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: user?.phone_number || ''
    });
    const [addressData, setAddressData] = useState<UserAddress>({
        recipient_name: user?.default_address?.recipient_name || `${user?.first_name || ''} ${user?.last_name || ''}`,
        address: user?.default_address?.address || '',
        city: user?.default_address?.city || '',
        province: user?.default_address?.province || '',
        postal_code: user?.default_address?.postal_code || '',
        phone_number: user?.default_address?.phone_number || user?.phone_number || '',
        is_default: true
    });
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddressData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateProfile(profileData);
            setIsEditingProfile(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateAddress({
                ...addressData,
                id: user?.default_address?.id
            });
            setIsEditingAddress(false);
        } catch (error) {
            console.error('Error updating address:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('لطفاً یک فایل تصویری انتخاب کنید');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
            return;
        }

        try {
            setImageLoading(true);
            await updateProfileImage(file);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setImageLoading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteImage = async () => {
        if (!window.confirm('آیا از حذف تصویر پروفایل اطمینان دارید؟')) {
            return;
        }

        try {
            setImageLoading(true);
            await deleteProfileImage();
        } catch (error) {
            console.error('Error deleting image:', error);
        } finally {
            setImageLoading(false);
        }
    };

    // List of Iranian provinces for select options
    const provinces = [
        'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام', 'بوشهر',
        'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی', 'خراسان شمالی',
        'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس', 'قزوین', 'قم', 'کردستان',
        'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد', 'گلستان', 'گیلان', 'لرستان', 'مازندران',
        'مرکزی', 'هرمزگان', 'همدان', 'یزد'
    ];

    return (
        <div className={styles.profileContainer}>
            <h1 className={styles.pageTitle}>پروفایل من</h1>

            {/* Profile Image Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2><FaCamera className={styles.sectionIcon} /> تصویر پروفایل</h2>
                </div>
                <div className={styles.imageCard}>
                    <div className={styles.imageContainer}>
                        <div className={styles.profileImageWrapper}>
                            {user?.profile_image ? (
                                <Image
                                    src={user.profile_image}
                                    alt="Profile"
                                    width={150}
                                    height={150}
                                    className={styles.profileImage}
                                />
                            ) : (
                                <div className={styles.profileImagePlaceholder}>
                                    <FaUser className={styles.placeholderIcon} />
                                </div>
                            )}
                            {imageLoading && (
                                <div className={styles.imageLoadingOverlay}>
                                    <div className={styles.spinner}></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.imageActions}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            onClick={handleImageClick}
                            className={styles.uploadButton}
                            disabled={imageLoading}
                        >
                            <FaCamera /> {user?.profile_image ? 'تغییر تصویر' : 'آپلود تصویر'}
                        </button>
                        {user?.profile_image && (
                            <button
                                onClick={handleDeleteImage}
                                className={styles.deleteImageButton}
                                disabled={imageLoading}
                            >
                                <FaTrash /> حذف تصویر
                            </button>
                        )}
                        <small className={styles.imageHelpText}>
                            حداکثر حجم: ۵ مگابایت | فرمت‌های مجاز: JPG, PNG, GIF
                        </small>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2><FaUser className={styles.sectionIcon} /> اطلاعات شخصی</h2>
                    {!isEditingProfile && (
                        <button
                            className={styles.editButton}
                            onClick={() => setIsEditingProfile(true)}
                        >
                            <FaEdit /> ویرایش
                        </button>
                    )}
                </div>

                {isEditingProfile ? (
                    <form onSubmit={handleProfileSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="first_name" className={styles.formLabel}>نام</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={profileData.first_name}
                                    onChange={handleProfileChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="last_name" className={styles.formLabel}>نام خانوادگی</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={profileData.last_name}
                                    onChange={handleProfileChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone_number" className={styles.formLabel}>شماره تماس</label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={profileData.phone_number}
                                    onChange={handleProfileChange}
                                    className={styles.input}
                                    placeholder="09123456789"
                                    dir="ltr"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.formLabel}>ایمیل</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={user?.email || ''}
                                    className={`${styles.input} ${styles.disabled}`}
                                    disabled
                                    dir="ltr"
                                />
                                <small className={styles.helpText}>ایمیل قابل تغییر نیست</small>
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => {
                                    setIsEditingProfile(false);
                                    setProfileData({
                                        first_name: user?.first_name || '',
                                        last_name: user?.last_name || '',
                                        phone_number: user?.phone_number || ''
                                    });
                                }}
                            >
                                انصراف
                            </button>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={loading}
                            >
                                {loading ? 'در حال ذخیره...' : 'ذخیره اطلاعات'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.infoCard}>
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>
                                <FaUser className={styles.infoIcon} /> نام و نام خانوادگی:
                            </div>
                            <div className={styles.infoValue}>
                                {user?.first_name} {user?.last_name}
                            </div>
                        </div>
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>
                                <FaEnvelope className={styles.infoIcon} /> ایمیل:
                            </div>
                            <div className={styles.infoValue}>
                                {user?.email}
                            </div>
                        </div>
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>
                                <FaPhone className={styles.infoIcon} /> شماره تماس:
                            </div>
                            <div className={styles.infoValue}>
                                {user?.phone_number ? toPersianNumber(user.phone_number) : 'ثبت نشده'}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2><FaMapMarkerAlt className={styles.sectionIcon} /> آدرس پیش‌فرض</h2>
                    {!isEditingAddress && (
                        <button
                            className={styles.editButton}
                            onClick={() => setIsEditingAddress(true)}
                        >
                            <FaEdit /> ویرایش
                        </button>
                    )}
                </div>

                {isEditingAddress ? (
                    <form onSubmit={handleAddressSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="recipient_name" className={styles.formLabel}>نام گیرنده</label>
                                <input
                                    type="text"
                                    id="recipient_name"
                                    name="recipient_name"
                                    value={addressData.recipient_name}
                                    onChange={handleAddressChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone_number" className={styles.formLabel}>شماره تماس</label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={addressData.phone_number}
                                    onChange={handleAddressChange}
                                    className={styles.input}
                                    placeholder="09123456789"
                                    required
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="province" className={styles.formLabel}>استان</label>
                                <select
                                    id="province"
                                    name="province"
                                    value={addressData.province}
                                    onChange={handleAddressChange}
                                    className={styles.select}
                                    required
                                >
                                    <option value="">انتخاب استان</option>
                                    {provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="city" className={styles.formLabel}>شهر</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={addressData.city}
                                    onChange={handleAddressChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup} style={{ flex: 2 }}>
                                <label htmlFor="address" className={styles.formLabel}>آدرس کامل</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={addressData.address}
                                    onChange={handleAddressChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="postal_code" className={styles.formLabel}>کد پستی</label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    value={addressData.postal_code}
                                    onChange={handleAddressChange}
                                    className={styles.input}
                                    placeholder="1234567890"
                                    required
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => {
                                    setIsEditingAddress(false);
                                    setAddressData({
                                        recipient_name: user?.default_address?.recipient_name || `${user?.first_name || ''} ${user?.last_name || ''}`,
                                        address: user?.default_address?.address || '',
                                        city: user?.default_address?.city || '',
                                        province: user?.default_address?.province || '',
                                        postal_code: user?.default_address?.postal_code || '',
                                        phone_number: user?.default_address?.phone_number || user?.phone_number || '',
                                        is_default: true
                                    });
                                }}
                            >
                                انصراف
                            </button>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={loading}
                            >
                                {loading ? 'در حال ذخیره...' : 'ذخیره آدرس'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.infoCard}>
                        {user?.default_address ? (
                            <>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>نام گیرنده:</div>
                                    <div className={styles.infoValue}>
                                        {user.default_address.recipient_name}
                                    </div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>شماره تماس:</div>
                                    <div className={styles.infoValue}>
                                        {toPersianNumber(user.default_address.phone_number)}
                                    </div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>آدرس:</div>
                                    <div className={styles.infoValue}>
                                        {user.default_address.province}، {user.default_address.city}، {user.default_address.address}
                                    </div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>کد پستی:</div>
                                    <div className={styles.infoValue}>
                                        {toPersianNumber(user.default_address.postal_code)}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.emptyAddress}>
                                <p>هنوز آدرسی ثبت نشده است.</p>
                                <button
                                    className={styles.addButton}
                                    onClick={() => setIsEditingAddress(true)}
                                >
                                    افزودن آدرس
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileManagement;