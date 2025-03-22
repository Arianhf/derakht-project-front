'use client';

import React from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import OrderDetail from '@/components/account/OrderDetail';
import { UserProvider } from '@/contexts/UserContext';

interface OrderDetailPageProps {
    params: {
        id: string;
    };
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ params }) => {
    return (
        <UserProvider>
            <AccountLayout>
                <OrderDetail orderId={params.id} />
            </AccountLayout>
        </UserProvider>
    );
};

export default OrderDetailPage;