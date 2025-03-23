// src/components/shop/CategoryNavigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProductCategory } from '@/types/shop';
import { categoryService } from '@/services/categoryService';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import styles from './CategoryNavigation.module.scss';

interface CategoryItemProps {
    category: ProductCategory;
    level?: number;
    activeCategory?: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, level = 0, activeCategory }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const hasChildren = category.children && category.children.length > 0;
    const isActive = category.slug === activeCategory;

    // Automatically expand the category if it or any of its children are active
    useEffect(() => {
        if (isActive || (hasChildren && category.children?.some(child => child.slug === activeCategory))) {
            setIsExpanded(true);
        }
    }, [activeCategory, category.children, isActive, hasChildren]);

    const toggleExpand = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className={`${styles.categoryItem} ${level > 0 ? styles.subCategory : ''}`}>
            <div className={`${styles.categoryHeader} ${isActive ? styles.activeCategory : ''}`}>
                <Link
                    href={`/shop/category/${category.slug}`}
                    className={styles.categoryLink}
                    onClick={hasChildren ? toggleExpand : undefined}
                >
                    <span style={{ marginRight: `${level * 10}px` }}></span>
                    {category.name}
                </Link>

                {hasChildren && (
                    <button
                        className={styles.expandButton}
                        onClick={toggleExpand}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "بستن زیرمجموعه‌ها" : "نمایش زیرمجموعه‌ها"}
                    >
                        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                )}
            </div>

            {isExpanded && hasChildren && (
                <div className={styles.childCategories}>
                    {category.children?.map(child => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            level={level + 1}
                            activeCategory={activeCategory}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface CategoryNavigationProps {
    activeCategory?: string;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ activeCategory }) => {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const pathname = usePathname();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryService.getCategories();
                const categoryTree = categoryService.buildCategoryTree(data);
                setCategories(categoryTree);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className={styles.loading}>در حال بارگذاری دسته‌بندی‌ها...</div>;
    }

    return (
        <div className={styles.categoryNavigation}>
            <h3 className={styles.navigationTitle}>دسته‌بندی‌ها</h3>
            <div className={styles.categoriesList}>
                <div className={`${styles.categoryItem} ${pathname === '/shop' ? styles.activeCategory : ''}`}>
                    <Link href="/shop" className={styles.categoryLink}>
                        همه محصولات
                    </Link>
                </div>
                {categories.map(category => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        activeCategory={activeCategory}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryNavigation;