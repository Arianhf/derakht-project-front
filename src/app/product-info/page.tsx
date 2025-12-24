import ProductInfoListPageClient from './ProductInfoListPageClient';
import api from '@/services/api';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import ErrorMessage from "@/components/shared/ErrorMessage";
import logo from '@/assets/images/logo2.png';
import styles from './page.module.scss';

export const metadata = {
    title: 'اطلاعات محصولات | درخت',
    description: 'اطلاعات و راهنمای محصولات',
};

export default async function Page() {
    try {
        const response = await api.get('/v2/product-info/');
        const productInfoItems = response.data.items || [];

        return <ProductInfoListPageClient productInfoItems={productInfoItems} />;
    } catch (error) {
        return (
            <div className={styles.pageWrapper}>
                <Navbar logo={logo} />
                <main className={styles.mainContent}>
                    <ErrorMessage message="مشکلی در دریافت اطلاعات محصولات رخ داده است." />
                </main>
                <Footer />
            </div>
        );
    }
}
