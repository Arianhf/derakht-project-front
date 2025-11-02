// src/components/ConditionalProviders.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/contexts/CartContext';
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

    // Start with the children wrapped in FeatureFlagProvider (always needed)
    let content = <FeatureFlagProvider>{children}</FeatureFlagProvider>;

    // Wrap with CartProvider if needed
    if (needsCartProvider) {
        content = <CartProvider>{content}</CartProvider>;
    }

    // UserProvider is already provided at the root level in layout.tsx
    // No need to wrap it again here to avoid double provider wrapping

    return content;
};