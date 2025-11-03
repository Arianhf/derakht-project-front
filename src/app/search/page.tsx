import { Suspense } from 'react';
import SearchResults from '@/components/search/SearchResults';
import LoadingSpinner from '@/components/shared/LoadingSpinner/LoadingSpinner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'جستجو | درخت',
  description: 'جستجو در مقالات و محصولات درخت',
};

/**
 * Search Page
 * Displays global search results for blogs and products
 */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <LoadingSpinner />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
