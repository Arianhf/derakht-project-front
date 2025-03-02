'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaShoppingBasket, FaTrash } from 'react-icons/fa';
import styles from './Navbar.module.css';
import { StaticImageData } from 'next/image';
import { toPersianNumber } from '@/utils/convertToPersianNumber';

interface CartItem {
  id: number;
  title: string;
  price: number;
  imageSrc: string;
}

interface NavbarProps {
  logo?: string | StaticImageData;
  showSearch?: boolean;
  cartItems?: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, showSearch = true, cartItems = [], setCartItems }) => {
  const pathname = usePathname();
  const isShopPage = pathname === '/shop';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to remove an item from the cart
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
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

      {/* Navigation Links */}
      <div className={styles.navbarItems}>
        <Link href="/" className={styles.navbarLink}>صفحه اصلی</Link>
        <Link href="/shop" className={styles.navbarLink}>فروشگاه</Link>
        <Link href="/blog" className={styles.navbarLink}>بلاگ</Link>
        <Link href="/contact" className={styles.navbarLink}>تماس با ما</Link>
      </div>

      <div className={styles.rightSection}>
        {/* Search Bar */}
        {showSearch && (
          <div className={styles.searchBar}>
            <input type="text" placeholder="جستجو" className={styles.searchInput} />
            <FaSearch color="#555" />
          </div>
        )}

        {/* Cart Icon with Dropdown */}
        {isShopPage && (
          <div 
            className={styles.basketContainer}
            onMouseEnter={() => setIsDropdownOpen(true)}
            // onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <FaShoppingBasket className={styles.icon} />
            {cartItems.length > 0 && (
              <span className={styles.cartCounter}>
                {toPersianNumber(cartItems.length)}
              </span>
            )}

            {isDropdownOpen && (
              <div 
                className={styles.cartDropdown}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {cartItems.length === 0 ? (
                  <p className={styles.emptyCart}>سبد خرید شما خالی است</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.cartItemContent}>
                        <Image src={item.imageSrc} alt={item.title} width={50} height={40} />
                        <div className={styles.cartItemInfo}>
                          <p>{item.title}</p>
                          <span>{toPersianNumber(item.price.toLocaleString())} تومان</span>
                        </div>
                      </div>
                      <button 
                        className={styles.removeButton} 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
