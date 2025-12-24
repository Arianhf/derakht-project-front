// src/app/shop/category/[slug]/CategoryPageClient.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import ProductCard from '@/components/shop/ProductCard';
import CategoryNavigation from '@/components/shop/CategoryNavigation';
import ProductFilters from '@/components/shop/ProductFilters';
import Breadcrumbs from '@/components/shop/Breadcrumbs';
import styles from '../../shop.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from '@/assets/images/header1.jpg';
import { Product, ShopFilters, Breadcrumb, ProductCategory } from '@/types/shop';
import { shopService } from '@/services/shopService';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface CategoryPageClientProps {
    category: ProductCategory;
    initialProducts: Product[];
    categorySlug: string;
}

const CategoryPageClient: React.FC<CategoryPageClientProps> = ({
    category,
    initialProducts,
    categorySlug
}) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<ShopFilters>({
        category: categorySlug,
        sort: 'newest'
    });

    const breadcrumbs: Breadcrumb[] = [
        { label: 'فروشگاه', href: '/shop' },
        { label: category.name, href: `/shop/category/${categorySlug}` }
    ];

    const fetchProducts = async (appliedFilters: ShopFilters) => {
        try {
            setLoading(true);
            // Use the special category endpoint for filtering by category
            const data = await shopService.getProductsByCategory(
                categorySlug,
                {
                    searchTerm: appliedFilters.searchTerm,
                    price: appliedFilters.price,
                    sort: appliedFilters.sort
                }
            );
            setProducts(data.results || []);
        } catch (error) {
            // Silently handle error
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: ShopFilters) => {
        // Preserve the category while updating other filters
        const updatedFilters = { ...newFilters, category: categorySlug };
        setFilters(updatedFilters);
        fetchProducts(updatedFilters);
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
                    src={category?.image_url || heroImage}
                    alt={category?.name || "Category Hero"}
                    layout="fill"
                    objectFit="cover"
                    className={styles.heroImage}
                />
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroText}>{category?.name || 'دسته‌بندی'}</h1>
                </div>
            </div>

            <div className={styles.contentContainer}>
                <Breadcrumbs items={breadcrumbs} />

                <div className={styles.shopLayout}>
                    <aside className={styles.sidebar}>
                        <CategoryNavigation activeCategory={categorySlug} />
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
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noProducts}>
                                    <p>محصولی در این دسته‌بندی یافت نشد</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryPageClient;
