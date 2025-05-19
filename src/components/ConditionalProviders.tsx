// src/components/ConditionalProviders.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/contexts/CartContext';
import { UserProvider } from '@/contexts/UserContext';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';

interface ConditionalProvidersProps {
    children: React.ReactNode;
}

export const ConditionalProviders: React.FC<ConditionalProvidersProps> = ({ children }) => {
    const pathname = usePathname();

    // Determine which providers are needed based on the current path
    const needsCartProvider =
        pathname?.startsWith('/shop') ||
        pathname?.startsWith('/cart') ||
        pathname?.startsWith('/checkout');

    const needsUserProvider =
        pathname?.startsWith('/account') ||
        pathname?.startsWith('/shop') ||
        pathname?.startsWith('/cart') ||
        pathname?.startsWith('/checkout');

    // Start with the children wrapped in FeatureFlagProvider (always needed)
    let content = <FeatureFlagProvider>{children}</FeatureFlagProvider>;

    // Wrap with CartProvider if needed
    if (needsCartProvider) {
        content = <CartProvider>{content}</CartProvider>;
    }

    // Wrap with UserProvider if needed
    if (needsUserProvider) {
        content = <UserProvider>{content}</UserProvider>;
    }

    return content;
};