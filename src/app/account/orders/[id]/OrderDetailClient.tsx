// app/account/orders/[id]/OrderDetailClient.tsx
'use client';

import React from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import OrderDetail from '@/components/account/OrderDetail';
import { UserProvider } from '@/contexts/UserContext';
import { Order } from '@/types/shop';

interface OrderDetailClientProps {
    order: Order;
}

const OrderDetailClient: React.FC<OrderDetailClientProps> = ({ order }) => {
    return (
        <UserProvider>
            <AccountLayout>
                <OrderDetail order={order} />
            </AccountLayout>
        </UserProvider>
    );
};

export default OrderDetailClient;
