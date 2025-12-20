// src/components/shop/ProductFilters.tsx
'use client';

import React, { useState } from 'react';
import { ShopFilters, SortOption, PriceFilter } from '@/types/shop';
import { FaFilter, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import styles from './ProductFilters.module.scss';

interface ProductFiltersProps {
    filters: ShopFilters;
    onFilterChange: (filters: ShopFilters) => void;
    onSearch: (searchTerm: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
                                                           filters,
                                                           onFilterChange,
                                                           onSearch
                                                       }) => {
    const [searchTerm, setSearchTerm] = useState<string>(filters.searchTerm || '');
    const [minPrice, setMinPrice] = useState<string>(filters.price?.min?.toString() || '');
    const [maxPrice, setMaxPrice] = useState<string>(filters.price?.max?.toString() || '');
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

    const handleSortChange = (sortValue: SortOption) => {
        onFilterChange({
            ...filters,
            sort: sortValue
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handlePriceFilterApply = () => {
        const priceFilter: PriceFilter = {};

        if (minPrice) {
            priceFilter.min = parseInt(minPrice);
        }

        if (maxPrice) {
            priceFilter.max = parseInt(maxPrice);
        }

        onFilterChange({
            ...filters,
            price: Object.keys(priceFilter).length > 0 ? priceFilter : undefined
        });
    };

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        onFilterChange({
            searchTerm: filters.searchTerm,
            category: filters.category
        });
    };

    const toggleFilters = () => {
        setIsFiltersOpen(!isFiltersOpen);
    };

    return (
        <div className={styles.filtersContainer}>
            <h3 className={styles.filterTitle}>فیلترها</h3>

            <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>مرتب‌سازی</h4>
                <div className={styles.sortOptions}>
                    <button
                        className={`${styles.sortButton} ${filters.sort === 'newest' ? styles.active : ''}`}
                        onClick={() => handleSortChange('newest')}
                    >
                        جدیدترین
                    </button>
                    <button
                        className={`${styles.sortButton} ${filters.sort === 'popular' ? styles.active : ''}`}
                        onClick={() => handleSortChange('popular')}
                    >
                        محبوب‌ترین
                    </button>
                    <button
                        className={`${styles.sortButton} ${filters.sort === 'price_low' ? styles.active : ''}`}
                        onClick={() => handleSortChange('price_low')}
                    >
                        ارزان‌ترین
                    </button>
                    <button
                        className={`${styles.sortButton} ${filters.sort === 'price_high' ? styles.active : ''}`}
                        onClick={() => handleSortChange('price_high')}
                    >
                        گران‌ترین
                    </button>
                </div>
            </div>

            <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>محدوده قیمت (تومان)</h4>
                <div className={styles.priceFilter}>
                    <div className={styles.priceInputs}>
                        <div className={styles.priceInputGroup}>
                            <label htmlFor="minPrice">از</label>
                            <input
                                type="number"
                                id="minPrice"
                                placeholder="قیمت از"
                                min="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className={styles.priceInput}
                            />
                        </div>
                        <div className={styles.priceInputGroup}>
                            <label htmlFor="maxPrice">تا</label>
                            <input
                                type="number"
                                id="maxPrice"
                                placeholder="قیمت تا"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className={styles.priceInput}
                            />
                        </div>
                    </div>
                    <div className={styles.priceFilterActions}>
                        <button
                            type="button"
                            className={styles.applyButton}
                            onClick={handlePriceFilterApply}
                        >
                            اعمال
                        </button>
                        {(filters.price?.min || filters.price?.max) && (
                            <button
                                type="button"
                                className={styles.resetButton}
                                onClick={resetFilters}
                            >
                                حذف فیلتر
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;