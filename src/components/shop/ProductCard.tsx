'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.scss';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { Product } from '@/types/shop';
import { FaShoppingCart, FaChild } from 'react-icons/fa';

interface ProductCardProps {
    product: Product;
    onAddToCart: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart(e);
    };

    return (
        <Link href={`/shop/${product.slug}`} className={styles.productCard}>
            <div className={styles.imageContainer}>
                {product.feature_image ? (
                    <Image
                        src={product.feature_image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.productImage}
                        style={{ objectFit: 'contain' }}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        تصویر موجود نیست
                    </div>
                )}
                {!product.is_available && (
                    <div className={styles.unavailableBadge}>ناموجود</div>
                )}
                {product.age_range && (
                    <div className={styles.ageBadge}>
                        <FaChild style={{ marginLeft: '5px' }} />
                        {product.age_range}
                    </div>
                )}
            </div>
            <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productPrice}>
                    {toPersianNumber(product.price_in_toman.toLocaleString())} تومان
                </p>
                <button
                    className={styles.addToCartButton}
                    onClick={handleAddToCart}
                    disabled={!product.is_available}
                >
                    <FaShoppingCart />
                    <span>افزودن به سبد خرید</span>
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;