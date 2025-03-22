'use client';

import React from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import ProfileManagement from '@/components/account/ProfileManagement';
import { UserProvider } from '@/contexts/UserContext';

const ProfilePage: React.FC = () => {
    return (
        <UserProvider>
            <AccountLayout>
                <ProfileManagement />
            </AccountLayout>
        </UserProvider>
    );
};

export default ProfilePage;