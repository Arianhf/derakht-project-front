'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CreateTemplatePayload, CreateTemplatePartPayload } from '@/types/story';
import { FaPlus, FaSave, FaTimes, FaImage } from 'react-icons/fa';
import TemplatePartEditor from './TemplatePartEditor';
import styles from './TemplateForm.module.scss';

interface TemplateFormProps {
    initialData?: Partial<CreateTemplatePayload>;
    onSubmit: (data: CreateTemplatePayload) => void;
    onCancel: () => void;
    loading?: boolean;
    templateId?: string; // Template ID for editing (required for image uploads)
}

const TemplateForm: React.FC<TemplateFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    loading = false,
    templateId,
}) => {
    const [formData, setFormData] = useState<CreateTemplatePayload>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        activity_type: initialData?.activity_type || 'WRITE_FOR_DRAWING',
        orientation: initialData?.orientation || 'PORTRAIT',
        size: initialData?.size || '20x20',
        template_parts: initialData?.template_parts || [],
    });

    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, cover_image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTemplatePart = () => {
        const newPart: CreateTemplatePartPayload = {
            position: formData.template_parts?.length || 0,
            canvas_text_template: null,
            canvas_illustration_template: null,
        };
        setFormData((prev) => ({
            ...prev,
            template_parts: [...(prev.template_parts || []), newPart],
        }));
    };

    const removeTemplatePart = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            template_parts: prev.template_parts?.filter((_, i) => i !== index),
        }));
    };

    const updateTemplatePart = (
        index: number,
        field: keyof CreateTemplatePartPayload,
        value: any
    ) => {
        setFormData((prev) => ({
            ...prev,
            template_parts: prev.template_parts?.map((part, i) =>
                i === index ? { ...part, [field]: value } : part
            ),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className={styles.templateForm} onSubmit={handleSubmit}>
            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>اطلاعات اصلی قالب</h2>

                <div className={styles.formGroup}>
                    <label htmlFor="title">عنوان قالب *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="عنوان قالب را وارد کنید"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">توضیحات *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        placeholder="توضیحات قالب را وارد کنید"
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="activity_type">نوع فعالیت *</label>
                        <select
                            id="activity_type"
                            name="activity_type"
                            value={formData.activity_type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="WRITE_FOR_DRAWING">نوشتن برای نقاشی</option>
                            <option value="ILLUSTRATE">تصویرسازی</option>
                            <option value="COMPLETE_STORY">تکمیل داستان</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="orientation">جهت *</label>
                        <select
                            id="orientation"
                            name="orientation"
                            value={formData.orientation}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="PORTRAIT">عمودی</option>
                            <option value="LANDSCAPE">افقی</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="size">اندازه *</label>
                        <select
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="20x20">20x20</option>
                            <option value="25x25">25x25</option>
                            <option value="15x23">15x23</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="cover_image">تصویر کاور (اختیاری)</label>
                    <div className={styles.imageUpload}>
                        <input
                            type="file"
                            id="cover_image"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className={styles.fileInput}
                        />
                        <label htmlFor="cover_image" className={styles.fileInputLabel}>
                            <FaImage />
                            {coverImagePreview ? 'تغییر تصویر' : 'انتخاب تصویر'}
                        </label>
                        {coverImagePreview && (
                            <div className={styles.imagePreview}>
                                <Image src={coverImagePreview} alt="پیش‌نمایش" width={200} height={200} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>بخش‌های قالب</h2>
                    <button
                        type="button"
                        onClick={addTemplatePart}
                        className={styles.addPartButton}
                        disabled={!formData.orientation || !formData.size}
                        title={!formData.orientation || !formData.size ? 'ابتدا جهت و اندازه را انتخاب کنید' : ''}
                    >
                        <FaPlus /> افزودن بخش
                    </button>
                </div>

                {(!formData.orientation || !formData.size) && (
                    <div className={styles.validationMessage}>
                        ⚠️ برای افزودن بخش‌های قالب، ابتدا <strong>جهت</strong> و <strong>اندازه</strong> را انتخاب کنید
                    </div>
                )}

                {formData.template_parts && formData.template_parts.length > 0 ? (
                    <div className={styles.partsList}>
                        {formData.template_parts.map((part, index) => (
                            <TemplatePartEditor
                                key={index}
                                part={part}
                                index={index}
                                orientation={formData.orientation}
                                size={formData.size}
                                onUpdate={updateTemplatePart}
                                onRemove={removeTemplatePart}
                                templateId={templateId}
                                partIndex={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyParts}>
                        <p>هیچ بخشی اضافه نشده است</p>
                        <button type="button" onClick={addTemplatePart} className={styles.addFirstPart}>
                            افزودن اولین بخش
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.formActions}>
                <button type="submit" disabled={loading} className={styles.submitButton}>
                    <FaSave />
                    {loading ? 'در حال ذخیره...' : 'ذخیره قالب'}
                </button>
                <button type="button" onClick={onCancel} className={styles.cancelButton}>
                    <FaTimes />
                    انصراف
                </button>
            </div>
        </form>
    );
};

export default TemplateForm;
