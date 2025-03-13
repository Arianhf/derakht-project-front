'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image, { StaticImageData } from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import styles from '../productDetails.module.scss';
import logo from '@/assets/images/logo2.png';
import heroImage from '@/assets/images/header1.jpg';
import image1 from '@/assets/images/story.png';
import { useCart } from '@/contexts/CartContext';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

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
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  if (!product) {
    return <div className={styles.notFound}>محصولی یافت نشد</div>;
  }

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      const diff = quantity - existing.quantity;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          increaseQuantity(product.id);
        }
      } else if (diff < 0) {
        for (let i = 0; i < -diff; i++) {
          decreaseQuantity(product.id);
        }
      }
    } else {
      addToCart(product);
      for (let i = 1; i < quantity; i++) {
        increaseQuantity(product.id);
      }
    }
    // Optionally, show a notification here.
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      setComments((prev) => [...prev, comment.trim()]);
      setComment('');
    }
  };

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
        {/* Left Column: Product Information & Controls */}
        <div className={styles.productDetails}>
          <h1 className={styles.productTitle}>{product.title}</h1>
          <p className={styles.productPrice}>{product.price.toLocaleString()} تومان</p>
          <p className={styles.productDescription}>{product.description}</p>
          <div className={styles.quantityControls}>
            <button 
              className={styles.decreaseButton}
              onClick={handleDecrease}
            >
              {quantity === 1 ? <FaTrash /> : <FaMinus />}
            </button>
            <span className={styles.quantityDisplay}>{quantity}</span>
            <button className={styles.increaseButton} onClick={handleIncrease}>
              <FaPlus />
            </button>
          </div>
          <button className={styles.addToCartButton} onClick={handleAddToCart}>
            افزودن به سبد خرید
          </button>
        </div>
        {/* Right Column: Product Image */}
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
      </div>
      {/* Comments Section */}
      <div className={styles.commentsContainer}>
        <h2 className={styles.commentsTitle}>نظرات</h2>
        <div className={styles.commentsBox}>
          {comments.length === 0 ? (
            <p className={styles.noComments}>هنوز نظری ثبت نشده است.</p>
          ) : (
            <ul className={styles.commentsList}>
              {comments.map((cmt, index) => (
                <li key={index} className={styles.commentItem}>
                  {cmt}
                </li>
              ))}
            </ul>
          )}
          <textarea 
            className={styles.commentInput}
            placeholder="نظر خود را وارد کنید..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className={styles.submitCommentButton} onClick={handleSubmitComment}>
            ارسال نظر
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
