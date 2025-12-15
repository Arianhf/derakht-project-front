import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaShoppingBasket, FaTrash } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import EmptyState from '@/components/shared/EmptyState/EmptyState';
import styles from '../Navbar.module.scss';
import { toPersianNumber } from '@/utils/convertToPersianNumber';

interface CartItem {
    product: {
        id: string;
        title: string;
        price: number;
        feature_image?: string;
    };
    quantity: number;
}

const CartDropdown: React.FC = () => {
    const router = useRouter();
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const cartDropdownRef = useRef<HTMLDivElement>(null);
    const cartDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Use cart context
    const { cartDetails, removeFromCart } = useCart();
    const totalQuantity = cartDetails?.items_count || 0;

    const handleCartDropdownMouseEnter = () => {
        if (cartDropdownTimeoutRef.current) {
            clearTimeout(cartDropdownTimeoutRef.current);
            cartDropdownTimeoutRef.current = null;
        }
        setIsCartDropdownOpen(true);
    };

    const handleCartDropdownMouseLeave = () => {
        cartDropdownTimeoutRef.current = setTimeout(() => {
            setIsCartDropdownOpen(false);
        }, 300); // 300ms delay before closing
    };

    const handleBasketClick = () => {
        router.push('/cart');
    };

    const handleRemoveFromCart = (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        removeFromCart(productId);
    };

    return (
        <div
            className={styles.basketContainer}
            onMouseEnter={handleCartDropdownMouseEnter}
            onMouseLeave={handleCartDropdownMouseLeave}
            ref={cartDropdownRef}
        >
            <div className={styles.iconWrapper}>
                <FaShoppingBasket className={styles.icon} />
                {totalQuantity > 0 && (
                    <span className={styles.cartCounter}>
                        {toPersianNumber(totalQuantity)}
                    </span>
                )}
            </div>

            {isCartDropdownOpen && cartDetails && (
                <div className={styles.cartDropdown} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.cartDropdownTitle}>سبد خرید</div>
                    {!cartDetails?.items || cartDetails.items.length === 0 ? (
                        <EmptyState
                            icon={FaShoppingBasket}
                            message="سبد خرید شما خالی است"
                            iconSize={40}
                        />
                    ) : (
                        <>
                            <div className={styles.cartItems}>
                                {cartDetails.items.map((item: CartItem) => (
                                    <div key={item.product.id} className={styles.cartItem}>
                                        <div className={styles.cartItemContent}>
                                            {item.product.feature_image ? (
                                                <Image
                                                    src={item.product.feature_image}
                                                    alt={item.product.title}
                                                    width={50}
                                                    height={40}
                                                    className={styles.cartItemImage}
                                                />
                                            ) : (
                                                <div className={styles.noImage}>بدون تصویر</div>
                                            )}
                                            <div className={styles.cartItemInfo}>
                                                <p className={styles.cartItemTitle}>{item.product.title}</p>
                                                <span className={styles.cartItemPrice}>
                                                    {toPersianNumber(item.product.price.toLocaleString())} تومان x {toPersianNumber(item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.removeButton}
                                            onClick={(e) => handleRemoveFromCart(e, item.product.id)}
                                            aria-label="حذف از سبد خرید"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.cartFooter}>
                                <div className={styles.cartTotal}>
                                    <span>جمع کل:</span>
                                    <span>{toPersianNumber(cartDetails.total_amount.toLocaleString())} تومان</span>
                                </div>
                                <button className={styles.viewCartButton} onClick={handleBasketClick}>
                                    مشاهده سبد خرید
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartDropdown;