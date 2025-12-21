'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { storyService } from '@/services/storyService';
import { StoryTemplate } from '@/types/story';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog/ConfirmDialog';
import styles from './page.module.scss';

const TemplateDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const templateId = params.id as string;

    const [template, setTemplate] = useState<StoryTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (templateId) {
            fetchTemplate();
        }
    }, [templateId]);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            const data = await storyService.getTemplateById(templateId);
            setTemplate(data);
        } catch (error) {
            toast.error('خطا در بارگذاری قالب');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await storyService.deleteTemplate(templateId);
            toast.success('قالب با موفقیت حذف شد');
            router.push('/admin/templates');
        } catch (error) {
            toast.error('خطا در حذف قالب');
            console.error(error);
        }
    };

    const getActivityTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            WRITE_FOR_DRAWING: 'نوشتن برای نقاشی',
            ILLUSTRATE: 'تصویرسازی',
            COMPLETE_STORY: 'تکمیل داستان',
        };
        return labels[type] || type;
    };

    const getOrientationLabel = (orientation: string) => {
        return orientation === 'PORTRAIT' ? 'عمودی' : 'افقی';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>در حال بارگذاری...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!template) {
        return (
            <AdminLayout>
                <div className={styles.error}>
                    <p>قالب یافت نشد</p>
                    <button onClick={() => router.push('/admin/templates')}>
                        بازگشت به لیست قالب‌ها
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.templateDetail}>
                <div className={styles.header}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/admin/templates')}
                    >
                        <FaArrowLeft /> بازگشت
                    </button>

                    <div className={styles.actions}>
                        <button
                            className={styles.editButton}
                            onClick={() => router.push(`/admin/templates/${templateId}/edit`)}
                        >
                            <FaEdit /> ویرایش
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <FaTrash /> حذف
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {template.cover_image && (
                        <div className={styles.coverImage}>
                            <img src={template.cover_image} alt={template.title} />
                        </div>
                    )}

                    <div className={styles.infoSection}>
                        <h1 className={styles.title}>{template.title}</h1>
                        <p className={styles.description}>{template.description}</p>

                        <div className={styles.metadata}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>نوع فعالیت:</span>
                                <span className={styles.metaValue}>
                                    {getActivityTypeLabel(template.activity_type)}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>جهت:</span>
                                <span className={styles.metaValue}>
                                    {getOrientationLabel(template.orientation)}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>اندازه:</span>
                                <span className={styles.metaValue}>{template.size}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.partsSection}>
                        <h2 className={styles.sectionTitle}>
                            بخش‌های قالب ({template.template_parts?.length || 0})
                        </h2>

                        {template.template_parts && template.template_parts.length > 0 ? (
                            <div className={styles.partsList}>
                                {template.template_parts.map((part, index) => (
                                    <div key={part.id} className={styles.partCard}>
                                        <h3 className={styles.partTitle}>بخش {index + 1}</h3>

                                        <div className={styles.partDetail}>
                                            <span className={styles.detailLabel}>موقعیت:</span>
                                            <span className={styles.detailValue}>{part.position}</span>
                                        </div>

                                        <div className={styles.canvasInfo}>
                                            <div className={styles.canvasItem}>
                                                <h4>قالب بوم متن</h4>
                                                {part.canvas_text_template ? (
                                                    <pre className={styles.jsonPreview}>
                                                        {JSON.stringify(part.canvas_text_template, null, 2)}
                                                    </pre>
                                                ) : (
                                                    <p className={styles.noData}>داده‌ای وجود ندارد</p>
                                                )}
                                            </div>

                                            <div className={styles.canvasItem}>
                                                <h4>قالب بوم تصویرسازی</h4>
                                                {part.canvas_illustration_template ? (
                                                    <pre className={styles.jsonPreview}>
                                                        {JSON.stringify(part.canvas_illustration_template, null, 2)}
                                                    </pre>
                                                ) : (
                                                    <p className={styles.noData}>داده‌ای وجود ندارد</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noParts}>
                                <p>این قالب هیچ بخشی ندارد</p>
                            </div>
                        )}
                    </div>
                </div>

                <ConfirmDialog
                    isOpen={showDeleteConfirm}
                    title="حذف قالب"
                    message="آیا مطمئن هستید که می‌خواهید این قالب را حذف کنید؟ این عملیات قابل بازگشت نیست."
                    confirmText="بله، حذف شود"
                    cancelText="انصراف"
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            </div>
        </AdminLayout>
    );
};

export default TemplateDetailPage;
