import ProductInfoPageClient from './ProductInfoPageClient';
import api from '@/services/api';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import ErrorMessage from "@/components/shared/ErrorMessage";
import logo from '@/assets/images/logo2.png';
import styles from './page.module.scss';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'اطلاعات محصول | درخت',
    description: 'جزئیات محصول',
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const response = await api.get(`/v2/product-info/${id}/`);
        const productInfo = response.data;

        if (!productInfo) {
            notFound();
        }

        return <ProductInfoPageClient productInfo={productInfo} />;
    } catch (error) {
        return (
            <div className={styles.pageWrapper}>
                <Navbar logo={logo}/>
                <main className={styles.mainContent}>
                    <ErrorMessage message="مشکلی در دریافت اطلاعات محصول رخ داده است." />
                </main>
                <Footer/>
            </div>
        );
    }
}
