'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { userService } from '@/services/userService';
import { toast } from 'react-hot-toast';
import { getPostLogoutRedirect } from '@/utils/routeUtils';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    profile_image?: string | null;
    default_address?: UserAddress;
    is_staff?: boolean;
}

export interface UserAddress {
    id?: string;
    recipient_name: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    phone_number: string;
    is_default?: boolean;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    isStaff: boolean;
    fetchUser: () => Promise<void>;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    updateAddress: (addressData: UserAddress) => Promise<void>;
    updateProfileImage: (imageFile: File) => Promise<void>;
    deleteProfileImage: () => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = async () => {
        try {
            setLoading(true);
            const userData = await userService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            // Error fetching user - silently handle in production
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (userData: Partial<User>) => {
        try {
            setLoading(true);
            const updatedUser = await userService.updateProfile(userData);
            setUser(updatedUser);
            toast.success('اطلاعات پروفایل با موفقیت به‌روزرسانی شد');
        } catch (error) {
            toast.error('خطا در به‌روزرسانی اطلاعات');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateAddress = async (addressData: UserAddress) => {
        try {
            setLoading(true);
            if (addressData.id) {
                await userService.updateAddress(addressData.id, addressData);
            } else {
                await userService.addAddress(addressData);
            }

            await fetchUser(); // Refresh user data
            toast.success('آدرس با موفقیت ذخیره شد');
        } catch (error) {
            toast.error('خطا در ذخیره آدرس');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfileImage = async (imageFile: File) => {
        try {
            setLoading(true);
            const updatedUser = await userService.uploadProfileImage(imageFile);
            setUser(updatedUser);
            toast.success('تصویر پروفایل با موفقیت به‌روزرسانی شد');
        } catch (error) {
            toast.error('خطا در آپلود تصویر پروفایل');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteProfileImage = async () => {
        try {
            setLoading(true);
            const updatedUser = await userService.deleteProfileImage();
            setUser(updatedUser);
            toast.success('تصویر پروفایل با موفقیت حذف شد');
        } catch (error) {
            toast.error('خطا در حذف تصویر پروفایل');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        userService.logout();
        setUser(null);
        toast.success('با موفقیت خارج شدید');

        // Determine where to redirect after logout
        const redirectPath = getPostLogoutRedirect(pathname);
        router.push(redirectPath);
    };

    useEffect(() => {
        const checkUser = async () => {
            if (userService.isAuthenticated()) {
                await fetchUser();
            } else {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                isStaff: user?.is_staff || false,
                fetchUser,
                updateProfile,
                updateAddress,
                updateProfileImage,
                deleteProfileImage,
                logout
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};