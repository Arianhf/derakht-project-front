'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import ProductCard from '@/components/shop/ProductCard';
import CategoryNavigation from '@/components/shop/CategoryNavigation';
import ProductFilters from '@/components/shop/ProductFilters';
import Breadcrumbs from '@/components/shop/Breadcrumbs';
import styles from './shop.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from "../../../public/images/shop_bg.png";
import { Product, ShopFilters, Breadcrumb } from '@/types/shop';
import { shopService } from '@/services/shopService';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const ShopPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ShopFilters>({
        sort: 'newest'
    });

    const breadcrumbs: Breadcrumb[] = [
        { label: 'فروشگاه', href: '/shop' }
    ];

    useEffect(() => {
        // Fetch products on mount with initial filters
        fetchProducts({ sort: 'newest' });
    }, []);

    const fetchProducts = async (appliedFilters: ShopFilters) => {
        try {
            setLoading(true);
            const data = await shopService.getProducts(appliedFilters);
            setProducts(data.results || []);
        } catch (error) {
            // Error fetching products - silently handle in production
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: ShopFilters) => {
        setFilters(newFilters);
        fetchProducts(newFilters);
    };

    const handleSearch = (searchTerm: string) => {
        const newFilters = { ...filters, searchTerm: searchTerm || undefined };
        setFilters(newFilters);
        fetchProducts(newFilters);
    };

    return (
        <div className={styles.shopContainer}>
            <Navbar logo={logo} />
            <Toaster position="top-center" />

            <div className={styles.heroSection}>
                <Image
                    src={heroImage}
                    alt="Shop Hero"
                    layout="fill"
                    objectFit="cover"
                    className={styles.heroImage}
                />
            </div>

            <div className={styles.contentContainer}>
                <Breadcrumbs items={breadcrumbs} />

                <div className={styles.shopLayout}>
                    <aside className={styles.sidebar}>
                        <CategoryNavigation />
                        <ProductFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                        />
                    </aside>

                    <main className={styles.mainContent}>
                        <div className={styles.productsSection}>
                            {loading ? (
                                <LoadingSpinner message="در حال بارگذاری محصولات..." />
                            ) : products.length > 0 ? (
                                <div className={styles.productsGrid}>
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noProducts}>
                                    <p>محصولی یافت نشد</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;