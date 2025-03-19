'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaShoppingBasket, FaTrash } from 'react-icons/fa';
import styles from './Navbar.module.css';
import { StaticImageData } from 'next/image';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import { useCart } from '@/contexts/CartContext';

interface NavbarProps {
    logo?: string | StaticImageData;
    showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, showSearch = true }) => {
    const pathname = usePathname();
    const isShopPage = pathname?.startsWith("/shop");
    const router = useRouter();
    const { cartDetails, removeFromCart } = useCart();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const totalQuantity = cartDetails?.items_count || 0;

    const handleBasketClick = () => {
        router.push('/cart');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                {logo && (
                    <Image
                        src={logo}
                        alt="Logo"
                        className={styles.logo}
                        width={100}
                        height={50}
                        layout="responsive"
                    />
                )}
            </div>

            <div className={styles.navbarItems}>
                <Link href="/" className={styles.navbarLink}>صفحه اصلی</Link>
                <Link href="/shop" className={styles.navbarLink}>فروشگاه</Link>
                <Link href="/blog" className={styles.navbarLink}>بلاگ</Link>
                <Link href="/contact" className={styles.navbarLink}>تماس با ما</Link>
            </div>

            <div className={styles.rightSection}>
                {showSearch && (
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="جستجو" className={styles.searchInput} />
                        <FaSearch color="#555" />
                    </div>
                )}

                {isShopPage && (
                    <div
                        className={styles.basketContainer}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onClick={handleBasketClick}
                    >
                        <FaShoppingBasket className={styles.icon} />
                        {totalQuantity > 0 && (
                                <span className={styles.cartCounter}>
                {toPersianNumber(totalQuantity)}
              </span>
                        )}

                        {isDropdownOpen && (
                            <div className={styles.cartDropdown}>
                                {!cartDetails?.items || cartDetails.items.length === 0 ? (
                                    <p className={styles.emptyCart}>سبد خرید شما خالی است</p>
                                ) : (
                                    cartDetails.items.map((item) => (
                                        <div key={item.product.id} className={styles.cartItem}>
                                            <div className={styles.cartItemContent}>
                                                {item.product.feature_image ? (
                                                    <Image src={item.product.feature_image} alt={item.product.title} width={50} height={40} />
                                                ) : (
                                                    <div className={styles.noImage} style={{ width: 50, height: 40 }}>بدون تصویر</div>
                                                )}
                                                <div className={styles.cartItemInfo}>
                                                    <p>{item.product.title}</p>
                                                    <span>
                            {toPersianNumber(item.product.price_in_toman.toLocaleString())} تومان x {toPersianNumber(item.quantity)}
                          </span>
                                                </div>
                                            </div>
                                            <button
                                                className={styles.removeButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFromCart(item.product.id);
                                                }}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))
                                )}

                                {cartDetails?.items && cartDetails.items.length > 0 && (
                                    <div className={styles.cartFooter}>
                                        <div className={styles.cartTotal}>
                                            <span>جمع کل:</span>
                                            <span>{toPersianNumber(cartDetails.total_amount.toLocaleString())} تومان</span>
                                        </div>
                                        <button className={styles.viewCartButton} onClick={handleBasketClick}>
                                            مشاهده سبد خرید
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};