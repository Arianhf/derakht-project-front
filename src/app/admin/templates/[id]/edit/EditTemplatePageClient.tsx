'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import TemplateForm from '@/components/admin/TemplateForm';
import { storyService } from '@/services/storyService';
import { StoryTemplate, UpdateTemplatePayload } from '@/types/story';
import { toast } from 'react-hot-toast';
import styles from './page.module.scss';

interface EditTemplatePageClientProps {
    template: StoryTemplate;
    templateId: string;
}

const EditTemplatePageClient: React.FC<EditTemplatePageClientProps> = ({ template, templateId }) => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

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
                    templateId={templateId}
                />
            </div>
        </AdminLayout>
    );
};

export default EditTemplatePageClient;
