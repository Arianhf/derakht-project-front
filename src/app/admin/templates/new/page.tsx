'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import TemplateForm from '@/components/admin/TemplateForm';
import { storyService } from '@/services/storyService';
import { CreateTemplatePayload } from '@/types/story';
import { toast } from 'react-hot-toast';
import styles from './page.module.scss';

const NewTemplatePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: CreateTemplatePayload) => {
        try {
            setLoading(true);
            const template = await storyService.createTemplate(data);
            toast.success('قالب با موفقیت ایجاد شد');
            router.push(`/admin/templates/${template.id}`);
        } catch (error: any) {
            console.error('Error creating template:', error);
            const errorMessage = error?.response?.data?.message || 'خطا در ایجاد قالب';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/templates');
    };

    return (
        <AdminLayout>
            <div className={styles.newTemplatePage}>
                <div className={styles.header}>
                    <h1 className={styles.title}>ایجاد قالب جدید</h1>
                    <p className={styles.subtitle}>قالب داستان جدید را پیکربندی کنید</p>
                </div>

                <TemplateForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                />
            </div>
        </AdminLayout>
    );
};

export default NewTemplatePage;
