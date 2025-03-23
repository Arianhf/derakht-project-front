'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaShoppingBasket, FaTrash, FaUser, FaSignOutAlt, FaShoppingBag, FaUserCircle } from 'react-icons/fa';
import styles from './Navbar.module.css';
import { StaticImageData } from 'next/image';
import { toPersianNumber } from '@/utils/convertToPersianNumber';

interface NavbarProps {
    logo?: string | StaticImageData;
    showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, showSearch = true }) => {
    const pathname = usePathname();
    const isShopPage = pathname?.startsWith("/shop");
    const router = useRouter();
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const userDropdownRef = React.useRef<HTMLDivElement>(null);
    const cartDropdownRef = React.useRef<HTMLDivElement>(null);
    const userDropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const cartDropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check if user is logged in based on localStorage
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, []);

    // Function to handle user dropdown hover
    const handleUserDropdownMouseEnter = () => {
        if (userDropdownTimeoutRef.current) {
            clearTimeout(userDropdownTimeoutRef.current);
            userDropdownTimeoutRef.current = null;
        }
        setIsUserDropdownOpen(true);
    };

    const handleUserDropdownMouseLeave = () => {
        userDropdownTimeoutRef.current = setTimeout(() => {
            setIsUserDropdownOpen(false);
        }, 300); // 300ms delay before closing
    };

    // Function to handle cart dropdown hover
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

    // Only import and use cart context if we're on a shop page
    let cartDetails = null;
    let removeFromCart = (product_id: any) => {};
    let totalQuantity = 0;

    // Dynamically import cart-related functionality only when needed
    if (isShopPage) {
        // Using require to conditionally import
        try {
            const { useCart } = require('@/contexts/CartContext');
            const cartContext = useCart();
            cartDetails = cartContext.cartDetails;
            removeFromCart = cartContext.removeFromCart;
            totalQuantity = cartDetails?.items_count || 0;
        } catch (error) {
            console.error('Error loading cart context:', error);
        }
    }

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
                        onMouseEnter={handleCartDropdownMouseEnter}
                        onMouseLeave={handleCartDropdownMouseLeave}
                        ref={cartDropdownRef}
                    >
                        <FaShoppingBasket className={styles.icon} />
                        {totalQuantity > 0 && (
                            <span className={styles.cartCounter}>
                                {toPersianNumber(totalQuantity)}
                            </span>
                        )}

                        {isCartDropdownOpen && cartDetails && (
                            <div className={styles.cartDropdown} onClick={(e) => e.stopPropagation()}>
                                {!cartDetails?.items || cartDetails.items.length === 0 ? (
                                    <p className={styles.emptyCart}>سبد خرید شما خالی است</p>
                                ) : (
                                    cartDetails.items.map((item:any) => (
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

                <div
                    className={styles.userContainer}
                    onMouseEnter={handleUserDropdownMouseEnter}
                    onMouseLeave={handleUserDropdownMouseLeave}
                    ref={userDropdownRef}
                >
                    <div className={styles.userIconContainer}>
                        <FaUserCircle className={styles.userIcon} />
                    </div>

                    {isUserDropdownOpen && (
                        <div className={styles.userDropdown} onClick={(e) => e.stopPropagation()}>
                            {isLoggedIn ? (
                                <>
                                    <Link href="/account" className={styles.userDropdownItem}>
                                        <FaUser className={styles.dropdownIcon} />
                                        <span>حساب کاربری</span>
                                    </Link>
                                    <Link href="/account/orders" className={styles.userDropdownItem}>
                                        <FaShoppingBag className={styles.dropdownIcon} />
                                        <span>سفارش‌های من</span>
                                    </Link>
                                    <div
                                        className={styles.userDropdownItem}
                                        onClick={() => {
                                            localStorage.removeItem('access_token');
                                            localStorage.removeItem('refresh_token');
                                            localStorage.removeItem('user');
                                            setIsLoggedIn(false);
                                            router.push('/login');
                                        }}
                                    >
                                        <FaSignOutAlt className={styles.dropdownIcon} />
                                        <span>خروج</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className={styles.userDropdownItem}>
                                        <FaUser className={styles.dropdownIcon} />
                                        <span>ورود</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};