import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaShoppingBasket } from 'react-icons/fa';
import { NAVBAR_ITEMS } from '../../constants';
import styles from './Navbar.module.css';
import { StaticImageData } from 'next/image';

interface NavbarProps {
  logo?: string | StaticImageData;
  showSearch?: boolean;
  basketCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, showSearch = true, basketCount = 0 }) => {
  const pathname = usePathname();
  const isShopPage = pathname === '/shop';

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
        {NAVBAR_ITEMS.map((item, index) => (
          <Link key={index} href="#" className={styles.navbarLink}>
            {item}
          </Link>
        ))}
      </div>

      <div className={styles.rightSection}>
        {showSearch && (
          <div className={styles.searchBar}>
            <input type="text" placeholder="جستجو" className={styles.searchInput} />
            <FaSearch color="#555" />
          </div>
        )}
        {isShopPage && (
          <div className={styles.basketIcon}>
            <FaShoppingBasket className={styles.icon} />
            {basketCount > 0 && <span className={styles.cartCounter}>{basketCount}</span>}
          </div>
        )}
      </div>
    </nav>
  );
};
