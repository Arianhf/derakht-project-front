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
import heroImage from "../../../public/images/shop_hero.jpg";
import { useCart } from '@/contexts/CartContext';
import { Product, ShopFilters, Breadcrumb } from '@/types/shop';
import { shopService } from '@/services/shopService';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const ShopPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [filters, setFilters] = useState<ShopFilters>({
        sort: 'newest'
    });

    const breadcrumbs: Breadcrumb[] = [
        { label: 'فروشگاه', href: '/shop' }
    ];

    useEffect(() => {
        fetchProducts(filters);
    }, []);

    const fetchProducts = async (appliedFilters: ShopFilters) => {
        try {
            setLoading(true);
            const data = await shopService.getProducts(appliedFilters);
            setProducts(data.results || []);
        } catch (error) {
            console.error('Error fetching products:', error);
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

    const handleAddToCart = async (product: Product) => {
        if (!product.is_available) return;
        await addToCart(product.id);
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
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroText}>فروشگاه درخت</h1>
                </div>
            </div>

            <div className={styles.contentContainer}>
                <Breadcrumbs items={breadcrumbs} />

                <div className={styles.shopLayout}>
                    <aside className={styles.sidebar}>
                        <CategoryNavigation />
                    </aside>

                    <main className={styles.mainContent}>
                        <ProductFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                        />

                        <div className={styles.productsSection}>
                            {loading ? (
                                <LoadingSpinner message="در حال بارگذاری محصولات..." />
                            ) : products.length > 0 ? (
                                <div className={styles.productsGrid}>
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={() => handleAddToCart(product)}
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