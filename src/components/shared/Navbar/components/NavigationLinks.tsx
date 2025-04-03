import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './NavigationLinks.module.scss';

interface NavigationLinksProps {
    pathname?: string;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ pathname }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when changing routes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Close mobile menu when window is resized to desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <button
                className={styles.mobileMenuToggle}
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "بستن منو" : "باز کردن منو"}
                aria-expanded={isMobileMenuOpen}
            >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`${styles.navbarItems} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                <Link href="/" className={styles.navbarLink}>
                    <span className={pathname === '/' ? styles.active : ''}>صفحه اصلی</span>
                </Link>
                <Link href="/template" className={styles.navbarLink}>
                    <span className={pathname?.startsWith('/template') ? styles.active : ''}>قصه‌سازی</span>
                </Link>
                <Link href="/shop" className={styles.navbarLink}>
                    <span className={pathname?.startsWith('/shop') ? styles.active : ''}>فروشگاه</span>
                </Link>
                <Link href="/blog" className={styles.navbarLink}>
                    <span className={pathname?.startsWith('/blog') ? styles.active : ''}>بلاگ</span>
                </Link>
                <Link href="/contact" className={styles.navbarLink}>
                    <span className={pathname?.startsWith('/contact') ? styles.active : ''}>تماس با ما</span>
                </Link>
            </div>

            {/* Overlay for mobile menu background */}
            {isMobileMenuOpen && (
                <div
                    className={styles.mobileMenuOverlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default NavigationLinks;