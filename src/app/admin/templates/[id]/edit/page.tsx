import EditTemplatePageClient from './EditTemplatePageClient';
import AdminLayout from '@/components/admin/AdminLayout';
import { storyService } from '@/services/storyService';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';

export const metadata = {
    title: 'ویرایش قالب | پنل مدیریت درخت',
    description: 'ویرایش قالب داستان',
};

export default async function Page({ params }: { params: { id: string } }) {
    try {
        const template = await storyService.getTemplateById(params.id);

        if (!template) {
            notFound();
        }

        return <EditTemplatePageClient template={template} templateId={params.id} />;
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
