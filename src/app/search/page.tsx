import { Suspense } from 'react';
import SearchResults from '@/components/search/SearchResults';
import LoadingSpinner from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Navbar } from '@/components/shared/Navbar/Navbar';
import logoImage from '@/assets/images/logo2.png';
import type { Metadata } from 'next';
import styles from './page.module.scss';

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
    <div className={styles.searchPageWrapper}>
      <Navbar logo={logoImage} />
      <main className={styles.mainContent}>
        <Suspense
          fallback={
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
              <LoadingSpinner />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}
