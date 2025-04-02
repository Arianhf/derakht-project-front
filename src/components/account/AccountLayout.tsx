'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import { FaUser, FaShoppingBag, FaSignOutAlt, FaHome, FaSpinner } from 'react-icons/fa';
import { useUser } from '@/contexts/UserContext';
import { Toaster } from 'react-hot-toast';
import styles from './AccountLayout.module.scss';
import logo from '@/assets/images/logo2.png';

interface AccountLayoutProps {
    children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
    const { user, loading, logout } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>در حال بارگذاری...</p>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    const menuItems = [
        { path: '/account', label: 'داشبورد', icon: <FaHome /> },
        { path: '/account/profile', label: 'پروفایل من', icon: <FaUser /> },
        { path: '/account/orders', label: 'سفارش‌های من', icon: <FaShoppingBag /> },
    ];

    return (
        <div className={styles.accountContainer}>
            <Navbar logo={logo} />
            <Toaster position="top-center" />

            <div className={styles.contentContainer}>
                <div className={styles.sidebar}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatar}>
                                {user.first_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className={styles.userDetails}>
                            <h3>{user.first_name} {user.last_name}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>

                    <nav className={styles.navigation}>
                        <ul>
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
                                    >
                                        <span className={styles.navIcon}>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button onClick={handleLogout} className={styles.logoutButton}>
                                    <span className={styles.navIcon}><FaSignOutAlt /></span>
                                    <span>خروج</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className={styles.mainContent}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccountLayout;