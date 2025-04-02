import React from 'react';
import Link from 'next/link';
import styles from '../Navbar.module.scss';

interface NavigationLinksProps {
    pathname?: string;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ pathname }) => {
    return (
        <div className={styles.navbarItems}>
            <Link href="/" className={styles.navbarLink}>
                <span className={pathname === '/' ? styles.active : ''}>صفحه اصلی</span>
            </Link>
            <Link href="/shop" className={styles.navbarLink}>
                <span className={pathname?.startsWith('/shop') ? styles.active : ''}>فروشگاه</span>
            </Link>
            <Link href="/template" className={styles.navbarLink}>
                <span className={pathname?.startsWith('/template') ? styles.active : ''}>قصه‌سازی</span>
            </Link>
            <Link href="/blog" className={styles.navbarLink}>
                <span className={pathname?.startsWith('/blog') ? styles.active : ''}>بلاگ</span>
            </Link>
            <Link href="/contact" className={styles.navbarLink}>
                <span className={pathname?.startsWith('/contact') ? styles.active : ''}>تماس با ما</span>
            </Link>
        </div>
    );
};

export default NavigationLinks;