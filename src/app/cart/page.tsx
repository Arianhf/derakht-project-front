// src/app/cart/page.tsx (or pages/cart.tsx)
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import styles from './cart.module.scss';
import logo from '@/assets/images/logo2.png';
import { useCart } from '@/contexts/CartContext';

const CartPage = () => {
  const { cartItems } = useCart();
  const router = useRouter();

  const goBackToShop = () => {
    router.push('/shop');
  };

  return (
    <div className={styles.cartContainer}>
      <Navbar logo={logo} cartItems={cartItems} />
      <div className={styles.cartContent}>
        <h1 className={styles.cartTitle}>سبد خرید شما</h1>
        {cartItems.length === 0 ? (
          <p className={styles.emptyMessage}>سبد خرید شما خالی است.</p>
        ) : (
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <span>{item.title}</span>
                <span>{item.price.toLocaleString()} تومان</span>
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
