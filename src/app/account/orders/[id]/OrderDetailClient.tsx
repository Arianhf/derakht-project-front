// app/account/orders/[id]/OrderDetailClient.tsx
'use client';

import React from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import OrderDetail from '@/components/account/OrderDetail';
import { UserProvider } from '@/contexts/UserContext';

interface OrderDetailClientProps {
    id: string;
}

const OrderDetailClient: React.FC<OrderDetailClientProps> = ({ id }) => {
    return (
        <UserProvider>
            <AccountLayout>
                <OrderDetail orderId={id} />
            </AccountLayout>
        </UserProvider>
    );
};

export default OrderDetailClient;