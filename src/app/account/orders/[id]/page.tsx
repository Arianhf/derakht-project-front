// src/app/account/orders/[id]/page.tsx
import { Metadata } from 'next';
import OrderDetailClient from './OrderDetailClient';
import { userService } from '@/services/userService';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'جزئیات سفارش | درخت',
    description: 'مشاهده جزئیات سفارش',
};

export type OrderParams = Promise<{ id: string }>;

export default async function OrderDetailPage({ params }: { params: OrderParams }) {
    const { id } = await params;

    try {
        // Fetch order details on server
        const order = await userService.getOrderDetails(id);

        if (!order) {
            notFound();
        }

        return <OrderDetailClient order={order} />;
    } catch (error) {
        notFound();
    }
}
