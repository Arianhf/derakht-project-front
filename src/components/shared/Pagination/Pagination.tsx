import React from 'react';
import { toPersianNumber } from '@/utils/convertToPersianNumber';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPagination = () => {
    const pages = [];

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        قبلی
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {toPersianNumber(i)}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        بعدی
      </button>
    );

    return pages;
  };

  return <div className={styles.pagination}>{renderPagination()}</div>;
};

export default Pagination;
