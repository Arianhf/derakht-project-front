'use client';

import React, { Suspense } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';
import { Loading } from '@/components/shared/Loading';

// Create a client component that will use the useSearchParams hook
const PaymentFailedClient = React.lazy(() =>
    import('@/components/checkout/PaymentFailedPage')
);


export default function PaymentFailedRoute() {
    return (
        <UserProvider>
            <CartProvider>
                <Suspense fallback={<Loading />}>
                    <PaymentFailedClient />
                </Suspense>
            </CartProvider>
        </UserProvider>
    );
}