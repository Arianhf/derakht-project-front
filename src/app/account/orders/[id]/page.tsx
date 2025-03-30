// src/app/account/orders/[id]/page.tsx
import { Metadata } from 'next';
import OrderDetailClient from './OrderDetailClient';

export const metadata: Metadata = {
    title: 'جزئیات سفارش | درخت',
    description: 'مشاهده جزئیات سفارش',
};

export type OrderParams = Promise<{ id: string }>;

export default async function OrderDetailPage({ params }: { params: OrderParams }) {
    const { id } = await params;
    return <OrderDetailClient id={id} />;
}