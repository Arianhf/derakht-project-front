'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import styles from './cart.module.scss';
import logo from '@/assets/images/logo2.png';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { FaTrash, FaPlus, FaMinus, FaShoppingBasket } from 'react-icons/fa';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { CartItem } from '@/types/shop';
import { Toaster } from 'react-hot-toast';

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
            <Toaster position="top-center" />

            <div className={styles.cartContent}>
                <h1 className={styles.cartTitle}>سبد خرید شما</h1>

                {!cartDetails?.items || cartDetails.items.length === 0 ? (
                    <div className={styles.emptyCartContainer}>
                        <FaShoppingBasket size={60} color="#ccc" />
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
                                            <Image
                                                src={item.product.feature_image}
                                                alt={item.product.title}
                                                width={70}
                                                height={70}
                                                objectFit="cover"
                                            />
                                        ) : (
                                            <div className={styles.noImage}>بدون تصویر</div>
                                        )}
                                    </div>

                                    <div className={styles.cartItemDetails}>
                                        <h3 className={styles.cartItemTitle}>{item.product.title}</h3>
                                        <p className={styles.cartItemPrice}>
                                            قیمت واحد: {toPersianNumber(item.product.price_in_toman)} تومان
                                        </p>
                                        <p className={styles.cartItemTotalPrice}>
                                            مجموع: {toPersianNumber(item.total_price)} تومان
                                        </p>
                                    </div>

                                    <div className={styles.controls}>
                                        <button
                                            className={styles.decreaseButton}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (item.quantity > 1) {
                                                    decreaseQuantity(item.product.id);
                                                } else {
                                                    removeFromCart(item.product.id);
                                                }
                                            }}
                                            aria-label={item.quantity > 1 ? "کاهش تعداد" : "حذف از سبد خرید"}
                                        >
                                            {item.quantity > 1 ? <FaMinus /> : <FaTrash />}
                                        </button>

                                        <span className={styles.quantity}>{toPersianNumber(item.quantity)}</span>

                                        <button
                                            className={styles.increaseButton}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                increaseQuantity(item.product.id);
                                            }}
                                            aria-label="افزایش تعداد"
                                        >
                                            <FaPlus />
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
                                    ادامه خرید
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