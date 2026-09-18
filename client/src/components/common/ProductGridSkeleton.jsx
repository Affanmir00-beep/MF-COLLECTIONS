import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

/**
 * Product Grid Skeleton supporting responsive column mapping
 */
const ProductGridSkeleton = ({ count = 8, gridCols = 4 }) => {
  const gridClassMap = {
    1: 'grid-cols-1 gap-[var(--gap-card)]',
    2: 'grid-cols-2 gap-[var(--gap-card)]',
    3: 'grid-cols-2 md:grid-cols-3 gap-[var(--gap-card)]',
    4: 'grid-cols-2 md:grid-cols-4 gap-[var(--gap-card)]',
    5: 'grid-cols-2 md:grid-cols-5 gap-[var(--gap-card)]',
    6: 'grid-cols-2 md:grid-cols-6 gap-[var(--gap-card)]',
  };

  const gridClass = gridClassMap[gridCols] || gridClassMap[4];

  return (
    <div className={`grid ${gridClass} w-full`}>
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
