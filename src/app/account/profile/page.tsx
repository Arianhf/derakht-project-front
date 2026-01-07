'use client';

import React from 'react';
import { AccountLayout, ProfileManagement } from '@/components/account';
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