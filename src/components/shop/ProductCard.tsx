'use client';

import React from 'react';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa';
import { StaticImageData } from 'next/image';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  imageSrc: string | StaticImageData;
  title: string;
  price: number;
  description: string;
  onAddToCart: () => void;
  onCardClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageSrc, title, price, description, onAddToCart, onCardClick }) => {
  return (
    <div className={styles.card} onClick={onCardClick}>
      <div className={styles.imageContainer}>
        <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardPrice}>{price.toLocaleString()} تومان</p>
        <p className={styles.cardDescription}>{description}</p>
        <button
          className={styles.addToCartButton}
          onClick={(e) => {
            e.stopPropagation(); 
            onAddToCart();
          }}
        >
          افزودن به سبد خرید <FaPlus className={styles.plusIcon} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
