'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import TemplateForm from '@/components/admin/TemplateForm';
import { storyService } from '@/services/storyService';
import { StoryTemplate, UpdateTemplatePayload } from '@/types/story';
import { toast } from 'react-hot-toast';
import styles from './page.module.scss';

const EditTemplatePage = () => {
    const router = useRouter();
    const params = useParams();
    const templateId = params.id as string;

    const [template, setTemplate] = useState<StoryTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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

    const handleSubmit = async (data: UpdateTemplatePayload) => {
        try {
            setSubmitting(true);
            const updated = await storyService.updateTemplate(templateId, data);
            toast.success('قالب با موفقیت به‌روزرسانی شد');
            router.push(`/admin/templates/${updated.id}`);
        } catch (error: any) {
            console.error('Error updating template:', error);
            const errorMessage = error?.response?.data?.message || 'خطا در به‌روزرسانی قالب';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push(`/admin/templates/${templateId}`);
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
            <div className={styles.editTemplatePage}>
                <div className={styles.header}>
                    <h1 className={styles.title}>ویرایش قالب</h1>
                    <p className={styles.subtitle}>{template.title}</p>
                </div>

                <TemplateForm
                    initialData={{
                        title: template.title,
                        description: template.description,
                        activity_type: template.activity_type,
                        orientation: template.orientation,
                        size: template.size,
                        template_parts: template.template_parts?.map((part) => ({
                            position: part.position,
                            canvas_text_template: part.canvas_text_template,
                            canvas_illustration_template: part.canvas_illustration_template,
                        })),
                    }}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={submitting}
                />
            </div>
        </AdminLayout>
    );
};

export default EditTemplatePage;
