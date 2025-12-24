import React from 'react';
import AccountLayout from '@/components/account/AccountLayout';
import OrderHistory from '@/components/account/OrderHistory';
import { UserProvider } from '@/contexts/UserContext';
import { userService } from '@/services/userService';

export const metadata = {
    title: 'سفارش‌های من | درخت',
    description: 'مشاهده و مدیریت سفارش‌ها',
};

const OrdersPage = async () => {
    // Fetch initial orders on server (first page)
    const ordersResponse = await userService.getOrders(1);

    return (
        <UserProvider>
            <AccountLayout>
                <OrderHistory
                    initialOrders={ordersResponse.results}
                    initialTotalItems={ordersResponse.count}
                />
            </AccountLayout>
        </UserProvider>
    );
};

export default OrdersPage;
