// src/app/shop/layout.tsx
import { ConditionalProviders } from '@/components/ConditionalProviders';

export default function ShopLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <ConditionalProviders>
            {children}
        </ConditionalProviders>
    );
}