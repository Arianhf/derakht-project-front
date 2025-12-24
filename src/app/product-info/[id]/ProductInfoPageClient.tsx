'use client';

import React from 'react';
import ProductInfoDetails from '@/components/product-info/ProductInfoDetails';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import Footer from '@/components/shared/Footer/Footer';
import logo from '@/assets/images/logo2.png';
import styles from './page.module.scss';

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

interface ProductInfoPageClientProps {
    productInfo: ProductInfo;
}

const ProductInfoPageClient: React.FC<ProductInfoPageClientProps> = ({ productInfo }) => {
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

export default ProductInfoPageClient;
