'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import styles from './cart.module.scss';
import logo from '@/assets/images/logo2.png';
import { useCart } from '@/contexts/CartContext';
import NextImage from 'next/image';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const router = useRouter();

  const goBackToShop = () => {
    router.push('/shop');
  };

  return (
    <div className={styles.cartContainer}>
      <Navbar logo={logo} />
      <div className={styles.cartContent}>
        <h1 className={styles.cartTitle}>سبد خرید شما</h1>
        {cartItems.length === 0 ? (
          <p className={styles.emptyMessage}>سبد خرید شما خالی است.</p>
        ) : (
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.controls}>
                  <button 
                    className={styles.decreaseButton}
                    onClick={() => {
                      if (item.quantity > 1) {
                        decreaseQuantity(item.id);
                      } else {
                        removeFromCart(item.id);
                      }
                    }}
                  >
                    {item.quantity > 1 ? <FaMinus /> : <FaTrash />}
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    className={styles.increaseButton}
                    onClick={() => increaseQuantity(item.id)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className={styles.cartItemDetails}>
                  <p className={styles.cartItemTitle}>{item.title}</p>
                  <p className={styles.cartItemPrice}>
                    {item.price.toLocaleString()} تومان
                  </p>
                </div>
                <div className={styles.cartItemImage}>
                  <NextImage 
                    src={item.imageSrc} 
                    alt={item.title} 
                    width={80} 
                    height={60} 
                    objectFit="cover" 
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={goBackToShop} className={styles.backButton}>
          بازگشت به فروشگاه
        </button>
      </div>
    </div>
  );
};

export default CartPage;
