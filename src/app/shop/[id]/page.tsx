'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import styles from '../productDetails.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from '@/assets/images/header1.jpg';
import image1 from '@/assets/images/story.png';

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

const ProductDetailsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  
  const product = products.find((p) => p.id === productId);
  
  if (!product) {
    return <div className={styles.notFound}>محصولی یافت نشد</div>;
  }

  const goBack = () => {
    router.push('/shop');
  };

  return (
    <div className={styles.productContainer}>
      <Navbar logo={logo} />
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
      <div className={styles.productContent}>
        <div className={styles.productImage}>
          <Image 
            src={product.imageSrc} 
            alt={product.title} 
            layout="responsive" 
            objectFit="cover" 
            width={800}
            height={500}
          />
        </div>
        <div className={styles.productDetails}>
          <h1 className={styles.productTitle}>{product.title}</h1>
          <p className={styles.productPrice}>{product.price.toLocaleString()} تومان</p>
          <p className={styles.productDescription}>{product.description}</p>
          <button onClick={goBack} className={styles.backButton}>
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
