'use client';

import React from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import OrderHistory from '@/components/account/OrderHistory';
import { UserProvider } from '@/contexts/UserContext';

const OrdersPage: React.FC = () => {
    return (
        <UserProvider>
            <AccountLayout>
                <OrderHistory />
            </AccountLayout>
        </UserProvider>
    );
};

export default OrdersPage;