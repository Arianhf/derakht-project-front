'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '@/services/userService';
import { toast } from 'react-hot-toast';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    default_address?: UserAddress;
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
    fetchUser: () => Promise<void>;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    updateAddress: (addressData: UserAddress) => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    const logout = () => {
        userService.logout();
        setUser(null);
        toast.success('با موفقیت خارج شدید');
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
                fetchUser,
                updateProfile,
                updateAddress,
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