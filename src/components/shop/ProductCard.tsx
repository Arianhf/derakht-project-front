'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.scss';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { Product } from '@/types/shop';
import { FaShoppingCart, FaChild, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useProductQuantity } from '@/hooks/useProductQuantity';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const {
        quantity,
        isInCart,
        handleAddToCart,
        handleIncreaseQuantity,
        handleDecreaseQuantity
    } = useProductQuantity(product);

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
                        <FaChild size={18} style={{ marginLeft: '5px' }} />
                        <span className={styles.ageValue}>{product.age_range}</span>
                    </div>
                )}
            </div>
            <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productPrice}>
                    {toPersianNumber(product.price.toLocaleString())} تومان
                </p>

                {isInCart ? (
                    <div className={styles.quantityControls}>
                        <button
                            className={styles.decreaseButton}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDecreaseQuantity();
                            }}
                            aria-label={quantity === 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
                        >
                            {quantity === 1 ? <FaTrash /> : <FaMinus />}
                        </button>
                        <span className={styles.quantityDisplay}>
                            {toPersianNumber(quantity)}
                        </span>
                        <button
                            className={styles.increaseButton}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleIncreaseQuantity();
                            }}
                            aria-label="افزایش تعداد"
                        >
                            <FaPlus />
                        </button>
                    </div>
                ) : (
                    <button
                        className={styles.addToCartButton}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart();
                        }}
                        disabled={!product.is_available}
                        aria-label="افزودن به سبد خرید"
                    >
                        <FaShoppingCart />
                        <span>افزودن به سبد خرید</span>
                    </button>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;