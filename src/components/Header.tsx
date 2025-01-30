import React from 'react';
import styles from './Header.module.css'; // New CSS module
import headerImage from '../assets/images/header.jpg';
import logoImage from '../assets/images/logo.svg';
import { FaUserCircle, FaSearch } from 'react-icons/fa'; 
import { IconContext } from 'react-icons/lib';

const Header: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <div className={styles.navbar}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <img src={logoImage} alt="لوگو" className={styles.logo} />
        </div>

        {/* Navbar Items */}
        <div className={styles.navbarItems}>
          {['خانه', 'درباره ما', 'وبلاگ', 'داستان'].map((item, index) => (
            <a key={index} href="/" className={styles.navbarLink}>
              {item}
            </a>
          ))}
        </div>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input type="text" placeholder="جستجو" className={styles.searchInput} />
          <FaSearch color="#555" />
        </div>
      </div>

      {/* Header Content */}
      <div className={styles.header}>
        <img src={headerImage} alt="image header" className={styles.headerImage} />
        <div className={styles.overlay}>
          <div>
            <div className={styles.headerTags}>
              <div className={styles.tag}>خلاقیت</div>
              <div className={styles.tag}>فعالیت</div>
              <div className={styles.tag}>نقاشی</div>
            </div>
            <h1 className={styles.headerTitle}>بازی و نقاشی برای تفریح های خلاقانه</h1>
            <p className={styles.headerSubtitle}>بازی و نقاشی برای کودکان یا کودکان درون</p>
          </div>
          <div className={styles.authorInfo}>
            <div className={styles.authorDetails}>
              <IconContext.Provider value={{ className: styles.authorIcon }}>
                <FaUserCircle size={30} />
              </IconContext.Provider>
              <span>علی کلاته</span>
            </div>
            <div className={styles.authorMeta}>
              <span>۱ آذر ۱۴۰۳</span>-<span>۱۰ دقیقه مطالعه</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
