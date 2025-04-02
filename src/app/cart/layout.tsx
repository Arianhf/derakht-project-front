'use client';

import React from 'react';
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";

export default function CartLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </UserProvider>
    );
}