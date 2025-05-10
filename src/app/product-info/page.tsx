// src/app/product-info/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import ProductInfoCard from '@/components/product-info/ProductInfoCard';
import logo from '@/assets/images/logo2.png';
import styles from './page.module.scss';
import api from '@/services/api';

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

interface ProductInfoResponse {
    meta: {
        total_count: number;
    };
    items: ProductInfoItem[];
}

const ProductInfoListPage: React.FC = () => {
    const router = useRouter();
    const [productInfoItems, setProductInfoItems] = useState<ProductInfoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductInfoList = async () => {
            try {
                setLoading(true);
                const response = await api.get<ProductInfoResponse>('/v2/product-info/');
                setProductInfoItems(response.data.items);
            } catch (err) {
                console.error(err);
                setError('مشکلی در دریافت اطلاعات محصولات رخ داده است.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductInfoList();
    }, []);

    const handleCardClick = (id: number) => {
        router.push(`/product-info/${id}`);
    };

    if (loading) return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logo} />
            <main className={styles.mainContent}>
                <LoadingSpinner message="در حال بارگذاری اطلاعات محصولات..." fullPage />
            </main>
            <Footer />
        </div>
    );

    if (error) return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logo} />
            <main className={styles.mainContent}>
                <ErrorMessage message={error} />
            </main>
            <Footer />
        </div>
    );

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

export default ProductInfoListPage;