'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import ProductInfoCard from '@/components/product-info/ProductInfoCard';
import logo from '@/assets/images/logo2.png';
import styles from './page.module.scss';

interface ProductInfoItem {
    id: number;
    meta: {
        type: string;
        detail_url: string;
        html_url: string;
        slug: string;
        first_published_at: string;
    };
    title: string;
    product_code: string;
    intro: string;
    product_image?: {
        id: number;
        title: string;
        meta: {
            download_url: string;
        };
    };
}

interface ProductInfoListPageClientProps {
    productInfoItems: ProductInfoItem[];
}

const ProductInfoListPageClient: React.FC<ProductInfoListPageClientProps> = ({ productInfoItems }) => {
    const router = useRouter();

    const handleCardClick = (id: number) => {
        router.push(`/product-info/${id}`);
    };

    return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logo} />
            <main className={styles.mainContent}>
                <div className={styles.contentContainer}>
                    <h1 className={styles.pageTitle}>اطلاعات محصولات</h1>

                    {productInfoItems.length > 0 ? (
                        <div className={styles.productsGrid}>
                            {productInfoItems.map((item) => (
                                <ProductInfoCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => handleCardClick(item.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>هیچ اطلاعات محصولی یافت نشد.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductInfoListPageClient;
