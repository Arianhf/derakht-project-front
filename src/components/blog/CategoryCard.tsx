// src/components/blog/CategoryCard.tsx
import React from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import styles from './CategoryCard.module.scss';
import {BlogCategory} from '@/services/blogService';
import {toPersianNumber} from '@/utils/convertToPersianNumber';

interface CategoryCardProps {
    category: BlogCategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({category}) => {
    const router = useRouter();

    const handleCategoryClick = () => {
        router.push(`/blog/category/${category.slug}`);
    };

    return (
        <div
            className={styles.categoryCard}
            onClick={handleCategoryClick}
        >
            <div className={styles.imageContainer}>
                <Image
                    src={category.icon || '/images/default-category.jpg'}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.categoryImage}
                />
                <div className={styles.overlay}/>
            </div>
            <div className={styles.content}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                {category.post_count !== undefined && (
                    <span className={styles.postCount}>
                        {toPersianNumber(category.post_count)} مقاله
                    </span>
                )}
            </div>
        </div>
    );
};

export default CategoryCard;