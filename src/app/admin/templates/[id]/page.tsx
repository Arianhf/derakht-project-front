import TemplateDetailPageClient from './TemplateDetailPageClient';
import AdminLayout from '@/components/admin/AdminLayout';
import { storyService } from '@/services/storyService';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';

export const metadata = {
    title: 'جزئیات قالب | پنل مدیریت درخت',
    description: 'مشاهده جزئیات قالب داستان',
};

export default async function Page({ params }: { params: { id: string } }) {
    try {
        const template = await storyService.getTemplateById(params.id);

        if (!template) {
            notFound();
        }

        return <TemplateDetailPageClient template={template} templateId={params.id} />;
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
