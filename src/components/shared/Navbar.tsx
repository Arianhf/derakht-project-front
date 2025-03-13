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

interface CartItem {
  id: number;
  title: string;
  price: number;
  imageSrc: string | StaticImageData;
}

interface NavbarProps {
  logo?: string | StaticImageData;
  showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, showSearch = true }) => {
  const pathname = usePathname();
  const isShopPage = pathname === '/shop';
  const router = useRouter();
  const { cartItems, removeFromCart } = useCart();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
                {cartItems.length === 0 ? (
                  <p className={styles.emptyCart}>سبد خرید شما خالی است</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.cartItemContent}>
                        <Image src={item.imageSrc} alt={item.title} width={50} height={40} />
                        <div className={styles.cartItemInfo}>
                          <p>{item.title}</p>
                          <span>
                            {toPersianNumber(item.price.toLocaleString())} تومان x {toPersianNumber(item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button 
                        className={styles.removeButton} 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
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
