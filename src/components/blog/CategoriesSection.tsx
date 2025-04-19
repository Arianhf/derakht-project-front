// src/components/blog/CategoriesSection.tsx
import React, { useState, useEffect } from 'react';
import { blogService, BlogCategory } from '@/services/blogService';
import CategoryCard from './CategoryCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import styles from './CategoriesSection.module.scss';

const CategoriesSection: React.FC = () => {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await blogService.getAllCategories();
                setCategories(response.items);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('مشکلی در دریافت دسته‌بندی‌ها رخ داده است.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (categories.length === 0) return null;

    return (
        <section className={styles.categoriesSection}>
            <h2 className={styles.sectionTitle}>دسته‌بندی‌های بلاگ</h2>
            <div className={styles.categoriesGrid}>
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;