import { Metadata } from 'next';
import ShopPageClient from './ShopPageClient';
import { shopService } from '@/services/shopService';

export const metadata: Metadata = {
  title: 'فروشگاه درخت | محصولات',
  description: 'محصولات آموزشی و سرگرمی درخت برای کودکان و نوجوانان',
};

export default async function Page() {
  // Fetch initial products on server
  const data = await shopService.getProducts({ sort: 'newest' });
  const initialProducts = data.results || [];

  return <ShopPageClient initialProducts={initialProducts} />;
}