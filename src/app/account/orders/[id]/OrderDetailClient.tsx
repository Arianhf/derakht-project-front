// app/account/orders/[id]/OrderDetailClient.tsx
'use client';

import React from 'react';
import { AccountLayout, OrderDetail } from '@/components/account';
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
