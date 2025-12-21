'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import { FaHome, FaFileAlt, FaFlag, FaSignOutAlt } from 'react-icons/fa';
import { useUser } from '@/contexts/UserContext';
import { Toaster } from 'react-hot-toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog/ConfirmDialog';
import styles from './AdminLayout.module.scss';
import logo from '@/assets/images/logo2.png';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, loading, logout, isStaff } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = () => {
        setShowLogoutConfirm(false);
        logout();
        router.push('/login');
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirm(false);
    };

    // Check if user is authenticated and is staff
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login?redirect=/admin');
            } else if (!isStaff) {
                console.log('Admin access denied. User data:', user);
                console.log('isStaff value:', isStaff);
                console.log('user.is_staff value:', user?.is_staff);
                router.push('/');
            }
        }
    }, [user, loading, isStaff, router]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>در حال بارگذاری...</p>
            </div>
        );
    }

    if (!user || !isStaff) {
        return null;
    }

    const menuItems = [
        { path: '/admin', label: 'داشبورد', icon: <FaHome /> },
        { path: '/admin/templates', label: 'مدیریت قالب‌ها', icon: <FaFileAlt /> },
        { path: '/admin/feature-flags', label: 'مدیریت ویژگی‌ها', icon: <FaFlag /> },
    ];

    return (
        <div className={styles.adminContainer}>
            <Navbar logo={logo} />
            <Toaster position="top-center" />

            <ConfirmDialog
                isOpen={showLogoutConfirm}
                title="خروج از حساب کاربری"
                message="آیا مطمئن هستید که می‌خواهید از پنل مدیریت خارج شوید؟"
                confirmText="بله، خارج شو"
                cancelText="انصراف"
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />

            <div className={styles.contentContainer}>
                <div className={styles.sidebar}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatar}>
                                {user.profile_image ? (
                                    <Image
                                        src={user.profile_image}
                                        alt={`${user.first_name} ${user.last_name}`}
                                        width={80}
                                        height={80}
                                    />
                                ) : (
                                    user.first_name?.charAt(0) || (user.email && user.email.charAt(0).toUpperCase()) || 'A'
                                )}
                            </div>
                        </div>
                        <div className={styles.userDetails}>
                            <h3>{user.first_name} {user.last_name}</h3>
                            <p>{user.email}</p>
                            <span className={styles.staffBadge}>مدیر سیستم</span>
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
                                <button onClick={handleLogoutClick} className={styles.logoutButton}>
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

export default AdminLayout;
