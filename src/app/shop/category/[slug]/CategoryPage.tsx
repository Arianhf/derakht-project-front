// src/app/shop/category/[slug]/CategoryPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import ProductCard from '@/components/shop/ProductCard';
import CategoryNavigation from '@/components/shop/CategoryNavigation';
import ProductFilters from '@/components/shop/ProductFilters';
import Breadcrumbs from '@/components/shop/Breadcrumbs';
import styles from '../../shop.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from '@/assets/images/header1.jpg';
import { useCart } from '@/contexts/CartContext';
import { Product, ShopFilters, Breadcrumb, ProductCategory } from '@/types/shop';
import { shopService } from '@/services/shopService';
import { categoryService } from '@/services/categoryService';
import { FaSpinner } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
    const { slug } = params;
    const [category, setCategory] = useState<ProductCategory | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [filters, setFilters] = useState<ShopFilters>({
        category: slug,
        sort: 'newest'
    });

    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
        { label: 'فروشگاه', href: '/shop' },
        { label: 'دسته‌بندی', href: `/shop/category/${slug}` }
    ]);

    useEffect(() => {
        fetchCategory();
        fetchProducts({ ...filters, category: slug });
    }, [slug]);

    const fetchCategory = async () => {
        try {
            const data = await categoryService.getCategoryBySlug(slug);
            setCategory(data);

            // Update breadcrumbs with correct category name
            setBreadcrumbs([
                { label: 'فروشگاه', href: '/shop' },
                { label: data.name, href: `/shop/category/${slug}` }
            ]);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    };

    const fetchProducts = async (appliedFilters: ShopFilters) => {
        try {
            setLoading(true);
            // Use the special category endpoint for filtering by category
            const data = await shopService.getProductsByCategory(
                slug,
                {
                    searchTerm: appliedFilters.searchTerm,
                    price: appliedFilters.price,
                    sort: appliedFilters.sort
                }
            );
            setProducts(data.results || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: ShopFilters) => {
        // Preserve the category while updating other filters
        const updatedFilters = { ...newFilters, category: slug };
        setFilters(updatedFilters);
        fetchProducts(updatedFilters);
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
                        <CategoryNavigation activeCategory={slug} />
                    </aside>

                    <main className={styles.mainContent}>
                        <ProductFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                        />

                        <div className={styles.productsSection}>
                            {loading ? (
                                <div className={styles.loaderContainer}>
                                    <FaSpinner className={styles.spinner} />
                                    <p>در حال بارگذاری محصولات...</p>
                                </div>
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

export default CategoryPage;