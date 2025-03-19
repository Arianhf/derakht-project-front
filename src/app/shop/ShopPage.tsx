
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import ProductCard from '@/components/shop/ProductCard';
import styles from './shop.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from '@/assets/images/header1.jpg';
import { useCart } from '@/contexts/CartContext';
import { Product, ShopFilters } from '@/types/shop';
import { shopService } from '@/services/shopService';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';

const ShopPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();
    const [filters, setFilters] = useState<ShopFilters>({
        price: { min: undefined, max: undefined },
        age: { min: undefined, max: undefined },
        category: undefined,
        searchTerm: undefined
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (appliedFilters?: ShopFilters) => {
        try {
            setLoading(true);

            // Convert filters to the format expected by the API
            const apiFilters: Record<string, string> = {};

            if (appliedFilters?.searchTerm) {
                apiFilters.search = appliedFilters.searchTerm;
            }

            if (appliedFilters?.age?.min && appliedFilters?.age?.max) {
                // Use age_filter endpoint via a different call
                const ageFilterData = await shopService.getProductsByAgeRange(
                    appliedFilters.age.min,
                    appliedFilters.age.max
                );
                setProducts(ageFilterData.results || []);
                setLoading(false);
                return;
            } else if (appliedFilters?.age?.min) {
                // Use by_age endpoint for single age
                const byAgeData = await shopService.getProductsByAge(appliedFilters.age.min);
                setProducts(byAgeData.results || []);
                setLoading(false);
                return;
            }

            // Handle other filters
            if (appliedFilters?.price?.min) {
                apiFilters.min_price = appliedFilters.price.min.toString();
            }

            if (appliedFilters?.price?.max) {
                apiFilters.max_price = appliedFilters.price.max.toString();
            }

            if (appliedFilters?.category) {
                apiFilters.category = appliedFilters.category;
            }

            // Check for sorting
            if (appliedFilters?.sort) {
                apiFilters.ordering = appliedFilters.sort === 'price_low' ? 'price' : '-price';
            }


            const data = await shopService.getProducts(apiFilters);
            setProducts(data.results || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType: keyof ShopFilters, value: any) => {
        const newFilters = { ...filters };

        if (filterType === 'price') {
            if (value === 'low') {
                newFilters.price = { min: undefined, max: undefined };
                // We'll handle this as a sort parameter
            } else if (value === 'high') {
                newFilters.price = { min: undefined, max: undefined };
                // We'll handle this as a sort parameter
            } else {
                newFilters.price = undefined;
            }
        } else if (filterType === 'age') {
            if (value === 'all') {
                newFilters.age = undefined;
            } else if (value === 'children') {
                newFilters.age = { min: 3, max: 7 };
            } else if (value === 'youth') {
                newFilters.age = { min: 8, max: 13 };
            } else if (value === 'teen') {
                newFilters.age = { min: 14, max: 18 };
            }
        } else {
            newFilters[filterType] = value === '' ? undefined : value;
        }

        setFilters(newFilters);
        fetchProducts(newFilters);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
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
                <div className={styles.filtersContainer}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchInputContainer}>
                            <input
                                type="text"
                                placeholder="جستجوی محصول..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchButton}>
                                <FaSearch />
                            </button>
                        </div>
                    </form>

                    <div className={styles.filterControls}>
                        <div className={styles.filterItem}>
                            <span className={styles.filterLabel}>قیمت:</span>
                            <select
                                className={styles.filterDropdown}
                                onChange={(e) => handleFilterChange('price', e.target.value)}
                            >
                                <option value="">همه قیمت‌ها</option>
                                <option value="low">از کم به زیاد</option>
                                <option value="high">از زیاد به کم</option>
                            </select>
                        </div>

                        <div className={styles.filterItem}>
                            <span className={styles.filterLabel}>رده سنی:</span>
                            <select
                                className={styles.filterDropdown}
                                onChange={(e) => handleFilterChange('age', e.target.value)}
                            >
                                <option value="all">همه سنین</option>
                                <option value="children">کودکان (۳-۷ سال)</option>
                                <option value="youth">نوجوانان (۸-۱۳ سال)</option>
                                <option value="teen">نوجوانان (۱۴-۱۸ سال)</option>
                            </select>
                        </div>
                    </div>
                </div>

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
                            <p>محصولی یافت نشد</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;