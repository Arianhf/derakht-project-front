'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/contexts/CartContext';

interface ConditionalCartProviderProps {
    children: React.ReactNode;
}

export const ConditionalCartProvider: React.FC<ConditionalCartProviderProps> = ({ children }) => {
    const pathname = usePathname();

    // Only load CartProvider for shop and cart pages
    const needsCartProvider =
        pathname?.startsWith('/shop') ||
        pathname?.startsWith('/cart');

    // Return the children without the CartProvider wrapper if we don't need it
    if (!needsCartProvider) {
        return <>{children}</>;
    }

    // Otherwise, wrap the children with the CartProvider
    return <CartProvider>{children}</CartProvider>;
};