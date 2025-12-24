import EditTemplatePageClient from './EditTemplatePageClient';
import AdminLayout from '@/components/admin/AdminLayout';
import { storyService } from '@/services/storyService';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';

export const metadata = {
    title: 'ویرایش قالب | پنل مدیریت درخت',
    description: 'ویرایش قالب داستان',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const template = await storyService.getTemplateById(id);

        if (!template) {
            notFound();
        }

        return <EditTemplatePageClient template={template} templateId={id} />;
    } catch (error) {
        return (
            <AdminLayout>
                <div className={styles.error}>
                    <p>خطا در بارگذاری قالب</p>
                </div>
            </AdminLayout>
        );
    }
}
