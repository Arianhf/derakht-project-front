import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { NAVBAR_ITEMS } from '../../constants';
import styles from './Navbar.module.css';
import { StaticImageData } from 'next/image';

interface NavbarProps {
  logo?: string | StaticImageData; 
  showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, showSearch = true }) => {
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

      {showSearch && (
        <div className={styles.searchBar}>
          <input type="text" placeholder="جستجو" className={styles.searchInput} />
          <FaSearch color="#555" />
        </div>
      )}
    </nav>
  );
};