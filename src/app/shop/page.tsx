'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import ProductCard from '@/components/shop/ProductCard';
import styles from './shop.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from '@/assets/images/header1.jpg';
import image1 from '@/assets/images/story.png';
import { useCart } from '@/contexts/CartContext';
import { toPersianNumber } from '@/utils/convertToPersianNumber';

interface Product {
  id: number;
  imageSrc: string | StaticImageData;
  title: string;
  price: number;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    imageSrc: image1,
    title: 'محصول اول',
    price: 100000,
    description: 'توضیح مختصر درباره محصول اول',
  },
  {
    id: 2,
    imageSrc: image1,
    title: 'محصول دوم',
    price: 200000,
    description: 'توضیح مختصر درباره محصول دوم',
  },
];

const ShopPage = () => {
  const [filters, setFilters] = useState({ price: '', category: '' });
  const { cartItems, addToCart } = useCart();
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification(`${product.title} به سبد خرید اضافه شد`);
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className={styles.shopContainer}>
      <Navbar logo={logo} />
      <div className={styles.heroSection}>
        <Image src={heroImage} alt="Shop Hero" layout="fill" objectFit="cover" className={styles.heroImage} />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroText}>فروشگاه درخت</h1>
        </div>
      </div>
      <div className={styles.filtersContainer}>
        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>قیمت</span>
          <select
            className={styles.filterDropdown}
            value={filters.price}
            onChange={(e) => setFilters({ ...filters, price: e.target.value })}
          >
            <option value="">انتخاب کنید</option>
            <option value="low">کمترین قیمت</option>
            <option value="high">بیشترین قیمت</option>
          </select>
        </div>
        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>دسته‌بندی</span>
          <select
            className={styles.filterDropdown}
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">انتخاب کنید</option>
            <option value="electronics">لوازم الکترونیکی</option>
            <option value="clothing">پوشاک</option>
            <option value="home">لوازم خانگی</option>
          </select>
        </div>
      </div>
      <div className={styles.productsContainer}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            imageSrc={product.imageSrc}
            title={product.title}
            price={product.price}
            description={product.description}
            onAddToCart={() => handleAddToCart(product)}
            onCardClick={() => router.push(`/shop/${product.id}`)}
          />
        ))}
      </div>
      {notification && <div className={styles.notification}>{notification}</div>}
    </div>
  );
};

export default ShopPage;
