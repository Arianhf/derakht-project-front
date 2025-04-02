'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import styles from './Navbar.module.scss';

import NavigationLinks from './components/NavigationLinks';
import SearchBar from './components/SearchBar';
import CartDropdown from './components/CartDropdown';
import UserDropdown from './components/UserDropdown';

interface NavbarProps {
    logo?: string | StaticImageData;
    showSearch?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, showSearch = true }) => {
    const pathname = usePathname();
    const isShopPage = pathname?.startsWith("/shop");

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
                        priority
                    />
                )}
            </div>

            <NavigationLinks pathname={pathname} />

            <div className={styles.rightSection}>
                {showSearch && <SearchBar />}
                {isShopPage && <CartDropdown />}
                <UserDropdown />
            </div>
        </nav>
    );
};