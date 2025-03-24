'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar';
import styles from './cart.module.scss';
import logo from '@/assets/images/logo2.png';
import { useCart } from '@/contexts/CartContext';
import NextImage from 'next/image';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { CartItem } from '@/types/shop';

const CartPage: React.FC = () => {
  const { cartDetails, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const router = useRouter();

  const goBackToShop = () => {
    router.push('/shop');
  };

  const proceedToCheckout = () => {
      router.push('/shop/checkout');
  };

  return (
    <div className={styles.cartContainer}>
      <Navbar logo={logo} />
      <div className={styles.cartContent}>
        <h1 className={styles.cartTitle}>سبد خرید شما</h1>
        {!cartDetails?.items || cartDetails.items.length === 0 ? (
          <div className={styles.emptyCartContainer}>
          <p className={styles.emptyMessage}>سبد خرید شما خالی است.</p>
            <button onClick={goBackToShop} className={styles.backButton}>
              بازگشت به فروشگاه
            </button>
          </div>
        ) : (
          <>
          <ul className={styles.cartList}>
            {cartDetails.items.map((item: CartItem) => (
                <li key={item.product.id} className={styles.cartItem}>
                    <div className={styles.cartItemImage}>
                        {item.product.feature_image ? (
                            <NextImage
                                src={item.product.feature_image}
                                alt={item.product.title}
                                width={80}
                                height={60}
                                objectFit="cover"
                            />
                        ) : (
                            <div className={styles.noImage}>بدون تصویر</div>
                        )}
                    </div>
                    <div className={styles.cartItemDetails}>
                        <p className={styles.cartItemPrice}>
                            {toPersianNumber(item.price)} تومان
                        </p>
                        <p className={styles.cartItemTitle}>{item.product.title}</p>
                        <p className={styles.cartItemTotalPrice}>
                            مجموع: {toPersianNumber(item.total_price)} تومان
                        </p>
                    </div>
                    <div className={styles.controls}>
                        <button
                            className={styles.decreaseButton}
                            onClick={() => {
                                if (item.quantity > 1) {
                                    decreaseQuantity(item.product.id);
                                } else {
                                    removeFromCart(item.product.id);
                                }
                            }}
                        >
                            {item.quantity > 1 ? <FaMinus/> : <FaTrash/>}
                        </button>
                        <span className={styles.quantity}>{toPersianNumber(item.quantity)}</span>
                        <button
                            className={styles.increaseButton}
                            onClick={() => increaseQuantity(item.product.id)}
                        >
                            <FaPlus/>
                        </button>
                    </div>
                </li>
            ))}
          </ul>

              <div className={styles.cartSummary}>
                  <div className={styles.summaryRow}>
                      <span>تعداد اقلام:</span>
                      <span>{toPersianNumber(cartDetails.items_count)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                      <span>مجموع:</span>
                      <span>{toPersianNumber(cartDetails.total_amount)} تومان</span>
                  </div>
                  <div className={styles.cartActions}>
                      <button onClick={goBackToShop} className={styles.backButton}>
                          بازگشت به فروشگاه
                      </button>
                      <button onClick={proceedToCheckout} className={styles.checkoutButton}>
                          نهایی کردن خرید
                      </button>
                  </div>
              </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;