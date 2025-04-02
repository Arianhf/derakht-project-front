// app/shop/[slug]/page.tsx

import ProductDetailsPage from './ProductDetailsPage';

export default function Page() {
  return <ProductDetailsPage />;
}

export const metadata = {
  title: 'جزئیات محصول | فروشگاه درخت',
  description: 'مشاهده جزئیات محصول و خرید آنلاین از فروشگاه درخت',
};
