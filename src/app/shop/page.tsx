// src/app/shop/page.tsx
import { Metadata } from 'next';
import ShopPage from './ShopPage';

export const metadata: Metadata = {
  title: 'فروشگاه درخت | محصولات',
  description: 'محصولات آموزشی و سرگرمی درخت برای کودکان و نوجوانان',
};

export default function Page() {
  return <ShopPage />;
}