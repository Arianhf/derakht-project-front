import React, { useState, useRef } from 'react';
import styles from './CardToCardPayment.module.scss';
import { FaArrowRight, FaUpload, FaCheckCircle } from 'react-icons/fa';

interface CardToCardPaymentProps {
    onSubmit: (receiptImage: File) => void;
    onBack: () => void;
}

export const CardToCardPayment: React.FC<CardToCardPaymentProps> = ({
    onSubmit,
    onBack
}) => {
    const [receiptImage, setReceiptImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReceiptImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (receiptImage) {
            onSubmit(receiptImage);
        }
    };

    return (
        <div className={styles.cardToCardContainer}>
            <h2 className={styles.sectionTitle}>پرداخت کارت به کارت</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Bank Card Display */}
                <div className={styles.bankCard}>
                    <div className={styles.cardBackground}>
                        <div className={styles.cardHeader}>
                            <div className={styles.bankLogo}>
                                <span className={styles.logoText}>بانک سامان</span>
                            </div>
                            <div className={styles.chipIcon}></div>
                        </div>

                        <div className={styles.cardNumber}>
                            <span>6219</span>
                            <span>8610</span>
                            <span>7018</span>
                            <span>3024</span>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.cardHolder}>
                                <div className={styles.cardLabel}>نام دارنده کارت</div>
                                <div className={styles.cardHolderName}>آرین هدایتی فر</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className={styles.instructions}>
                    <p>لطفاً مبلغ سفارش را به شماره کارت بالا واریز نمایید و رسید پرداخت را آپلود کنید.</p>
                </div>

                {/* Receipt Upload Section */}
                <div className={styles.uploadSection}>
                    <h3 className={styles.uploadTitle}>آپلود رسید پرداخت</h3>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className={styles.fileInput}
                    />

                    {previewUrl ? (
                        <div className={styles.previewContainer}>
                            <img src={previewUrl} alt="Receipt preview" className={styles.previewImage} />
                            <div className={styles.uploadSuccess}>
                                <FaCheckCircle /> رسید با موفقیت انتخاب شد
                            </div>
                            <button
                                type="button"
                                className={styles.changeButton}
                                onClick={handleUploadClick}
                            >
                                تغییر فایل
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={styles.uploadButton}
                            onClick={handleUploadClick}
                        >
                            <FaUpload />
                            <span>انتخاب فایل رسید</span>
                        </button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={onBack}
                    >
                        <FaArrowRight /> بازگشت
                    </button>
                    <button
                        type="submit"
                        className={styles.continueButton}
                        disabled={!receiptImage}
                    >
                        ادامه
                    </button>
                </div>
            </form>
        </div>
    );
};
