// app/shop/[slug]/page.tsx

import ProductDetailsPageClient from './ProductDetailsPageClient';
import { shopService } from '@/services/shopService';
import { Breadcrumb, CommentsResponse } from '@/types/shop';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'جزئیات محصول | فروشگاه درخت',
  description: 'مشاهده جزئیات محصول و خرید آنلاین از فروشگاه درخت',
};

export default async function Page({ params }: { params: { slug: string } }) {
  // Fetch product and comments on server
  try {
    const [product, commentsResponse] = await Promise.all([
      shopService.getProductBySlug(params.slug),
      shopService.getProductComments(params.slug).catch(() => ({ items: [] } as CommentsResponse))
    ]);

    if (!product) {
      notFound();
    }

    // Build breadcrumbs
    const breadcrumbs: Breadcrumb[] = [
      { label: 'فروشگاه', href: '/shop' }
    ];

    if (product.category) {
      breadcrumbs.push({
        label: product.category.name,
        href: `/shop/category/${product.category.slug}`
      });
    }

    breadcrumbs.push({
      label: product.title,
      href: `/shop/${product.slug}`
    });

    return (
      <ProductDetailsPageClient
        product={product}
        initialComments={commentsResponse.items || []}
        breadcrumbs={breadcrumbs}
      />
    );
  } catch (error) {
    notFound();
  }
}
