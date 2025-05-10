// src/app/product-info/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductInfoDetails from '@/components/product-info/ProductInfoDetails';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import logo from '@/assets/images/logo2.png';
import styles from './page.module.scss';
import api from '@/services/api';

interface ProductInfo {
    id: number;
    title: string;
    product_code: string;
    intro: string;
    body: string;
    product_image?: {
        id: number;
        title: string;
        meta: {
            download_url: string;
        };
    };
}

const ProductInfoPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const productInfoId = params?.id as string;

    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
                setLoading(true);

                // Fetch product info
                const response = await api.get(`/v2/product-info/${productInfoId}/`);
                setProductInfo(response.data);
            } catch (err) {
                console.error(err);
                setError('مشکلی در دریافت اطلاعات محصول رخ داده است.');
            } finally {
                setLoading(false);
            }
        };

        if (productInfoId) {
            fetchProductInfo();
        }
    }, [productInfoId]);

    if (loading) return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <LoadingSpinner message="در حال بارگذاری اطلاعات محصول..." fullPage/>
            </main>
            <Footer/>
        </div>
    );

    if (error) return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <ErrorMessage message={error}/>
            </main>
            <Footer/>
        </div>
    );

    if (!productInfo) return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <ErrorMessage message="اطلاعات محصول یافت نشد"/>
            </main>
            <Footer/>
        </div>
    );

    return (
        <div className={styles.pageWrapper}>
            <Navbar logo={logo}/>
            <main className={styles.mainContent}>
                <ProductInfoDetails productInfo={productInfo} />
            </main>
            <Footer/>
        </div>
    );
};

export default ProductInfoPage;