'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { storyService } from '@/services/storyService';
import { StoryTemplate } from '@/types/story';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog/ConfirmDialog';
import styles from './page.module.scss';

const TemplatesListPage = () => {
    const router = useRouter();
    const [templates, setTemplates] = useState<StoryTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; templateId: string | null }>({
        show: false,
        templateId: null,
    });

    useEffect(() => {
        fetchTemplates();
    }, [filter]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await storyService.getTemplates(filter || undefined);
            setTemplates(response.results);
        } catch (error) {
            toast.error('خطا در بارگذاری قالب‌ها');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.templateId) return;

        try {
            await storyService.deleteTemplate(deleteConfirm.templateId);
            toast.success('قالب با موفقیت حذف شد');
            setDeleteConfirm({ show: false, templateId: null });
            fetchTemplates();
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

    return (
        <AdminLayout>
            <div className={styles.templatesPage}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>مدیریت قالب‌های داستان</h1>
                        <p className={styles.subtitle}>ایجاد و ویرایش قالب‌های داستان</p>
                    </div>
                    <button
                        className={styles.createButton}
                        onClick={() => router.push('/admin/templates/new')}
                    >
                        <FaPlus /> قالب جدید
                    </button>
                </div>

                <div className={styles.filters}>
                    <label>
                        نوع فعالیت:
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="">همه</option>
                            <option value="WRITE_FOR_DRAWING">نوشتن برای نقاشی</option>
                            <option value="ILLUSTRATE">تصویرسازی</option>
                            <option value="COMPLETE_STORY">تکمیل داستان</option>
                        </select>
                    </label>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>در حال بارگذاری...</p>
                    </div>
                ) : templates.length === 0 ? (
                    <div className={styles.empty}>
                        <p>قالبی یافت نشد</p>
                        <button onClick={() => router.push('/admin/templates/new')}>
                            ایجاد اولین قالب
                        </button>
                    </div>
                ) : (
                    <div className={styles.templatesGrid}>
                        {templates.map((template) => (
                            <div key={template.id} className={styles.templateCard}>
                                <div className={styles.cardHeader}>
                                    {template.cover_image && (
                                        <img
                                            src={template.cover_image}
                                            alt={template.title}
                                            className={styles.coverImage}
                                        />
                                    )}
                                    <div className={styles.cardBadge}>
                                        {getActivityTypeLabel(template.activity_type)}
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{template.title}</h3>
                                    <p className={styles.cardDescription}>{template.description}</p>

                                    <div className={styles.cardMeta}>
                                        <span className={styles.metaItem}>
                                            جهت: {getOrientationLabel(template.orientation)}
                                        </span>
                                        <span className={styles.metaItem}>
                                            اندازه: {template.size}
                                        </span>
                                        <span className={styles.metaItem}>
                                            بخش‌ها: {template.template_parts?.length || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardActions}>
                                    <button
                                        className={`${styles.actionButton} ${styles.viewButton}`}
                                        onClick={() => router.push(`/admin/templates/${template.id}`)}
                                        title="مشاهده جزئیات"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.editButton}`}
                                        onClick={() => router.push(`/admin/templates/${template.id}/edit`)}
                                        title="ویرایش"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => setDeleteConfirm({ show: true, templateId: template.id })}
                                        title="حذف"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <ConfirmDialog
                    isOpen={deleteConfirm.show}
                    title="حذف قالب"
                    message="آیا مطمئن هستید که می‌خواهید این قالب را حذف کنید؟ این عملیات قابل بازگشت نیست."
                    confirmText="بله، حذف شود"
                    cancelText="انصراف"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirm({ show: false, templateId: null })}
                />
            </div>
        </AdminLayout>
    );
};

export default TemplatesListPage;
