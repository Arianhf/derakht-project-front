'use client';

import React from 'react';
import { AccountLayout, AccountDashboard } from '@/components/account';
import { UserProvider } from '@/contexts/UserContext';

const AccountPage: React.FC = () => {
    return (
        <UserProvider>
            <AccountLayout>
                <AccountDashboard />
            </AccountLayout>
        </UserProvider>
    );
};

export default AccountPage;