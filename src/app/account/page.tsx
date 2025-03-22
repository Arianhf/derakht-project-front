'use client';

import React from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import AccountDashboard from '@/components/account/AccountDashboard';
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