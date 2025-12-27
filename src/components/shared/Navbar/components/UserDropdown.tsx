import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FaUser, FaUserCircle, FaSignOutAlt, FaShoppingBag, FaUserShield } from 'react-icons/fa';
import { useUser } from '@/contexts/UserContext';
import ConfirmDialog from '@/components/shared/ConfirmDialog/ConfirmDialog';
import styles from '../Navbar.module.scss';

const UserDropdown: React.FC = () => {
    const { user, logout, isStaff } = useUser();
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isLoggedIn = !!user;

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsUserDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsUserDropdownOpen(false);
        }, 300); // 300ms delay before closing
    };

    const handleLogoutClick = () => {
        setIsUserDropdownOpen(false); // Close dropdown
        setShowLogoutConfirm(true); // Show confirmation dialog
    };

    const handleLogoutConfirm = () => {
        setShowLogoutConfirm(false);
        logout();
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <>
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                title="خروج از حساب کاربری"
                message="آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟"
                confirmText="بله، خارج شو"
                cancelText="انصراف"
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
            />

            <div
                className={styles.userContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={userDropdownRef}
            >
                <div className={styles.iconWrapper}>
                    <FaUserCircle className={styles.userIcon} />
                </div>

                {isUserDropdownOpen && (
                    <div className={styles.userDropdown} onClick={(e) => e.stopPropagation()}>
                        {isLoggedIn ? (
                            <>
                                <Link href="/account" className={styles.userDropdownItem}>
                                    <FaUser className={styles.dropdownIcon} />
                                    <span>حساب کاربری</span>
                                </Link>
                                <Link href="/account/orders" className={styles.userDropdownItem}>
                                    <FaShoppingBag className={styles.dropdownIcon} />
                                    <span>سفارش‌های من</span>
                                </Link>
                                {isStaff && (
                                    <Link href="/admin" className={styles.userDropdownItem}>
                                        <FaUserShield className={styles.dropdownIcon} />
                                        <span>پنل مدیریت</span>
                                    </Link>
                                )}
                                <div
                                    className={styles.userDropdownItem}
                                    onClick={handleLogoutClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FaSignOutAlt className={styles.dropdownIcon} />
                                    <span>خروج</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={styles.userDropdownItem}>
                                    <FaUser className={styles.dropdownIcon} />
                                    <span>ورود</span>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default UserDropdown;