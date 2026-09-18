import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import ProductGridSkeleton from '../components/common/ProductGridSkeleton';
import FilterDrawer from '../components/layout/FilterDrawer';
import { mockApi } from '../data/mockApi';
import { useCursorPagination } from '../hooks/useCursorPagination';

const gridOptions = [1, 2, 3, 4, 5, 6];

const CollectionPage = () => {
  const { handle } = useParams();
  const categoryParam = handle || 'all';

  const [gridCols, setGridCols] = useState(4); // default 4 on desktop
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Featured');
  
  const sentinelRef = useRef(null);

  // Use the reusable cursor pagination hook
  const {
    items: products,
    hasMore,
    isLoading,
    loadMore,
    resetAndLoad
  } = useCursorPagination(
    (options) => mockApi.getCollectionProducts(categoryParam, options),
    10
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    resetAndLoad({ sort: sortOption });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam, sortOption]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, { rootMargin: "300px" });
    
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef.current, hasMore, loadMore]);

  // Map gridCols state to Tailwind classes
  const gridClassMap = {
    1: 'grid-cols-1 gap-[var(--gap-card)]',
    2: 'grid-cols-2 gap-[var(--gap-card)]',
    3: 'grid-cols-2 md:grid-cols-3 gap-[var(--gap-card)]',
    4: 'grid-cols-2 md:grid-cols-4 gap-[var(--gap-card)]',
    5: 'grid-cols-2 md:grid-cols-5 gap-[var(--gap-card)]',
    6: 'grid-cols-2 md:grid-cols-6 gap-[var(--gap-card)]'
  };

  return (
    <div className="bg-white min-h-screen pb-[120px] w-full text-black">
      
      {/* Header & Title */}
      <div className="text-center mb-10 px-4 mf-section-sm pb-0">
        <h1 className="mf-display">
          {categoryParam === 'all' ? 'All Collections' : categoryParam.replace(/-/g, ' ')}
        </h1>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[88px] md:top-[92px] z-30 bg-white border-y border-[#EAEAEA] py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm font-sans mb-8">
        
        {/* Left: Filter */}
        <div className="flex-1 flex justify-start">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity mf-label"
          >
            <SlidersHorizontal strokeWidth={1} size={18} />
            Filter
          </button>
        </div>

        {/* Center: Vanya-style grid density switcher — vertical bar icons */}
        <div className="flex-1 hidden md:flex items-center justify-center gap-1">
          {[
            { cols: 2, bars: 2 },
            { cols: 3, bars: 3 },
            { cols: 4, bars: 4 },
            { cols: 5, bars: 5 },
            { cols: 6, bars: 6 },
          ].map(({ cols, bars }) => (
            <button
              key={cols}
              onClick={() => setGridCols(cols)}
              title={`${cols} columns`}
              className={`flex items-end justify-center gap-[2px] px-2 py-1.5 transition-all ${
                gridCols === cols
                  ? 'opacity-100'
                  : 'opacity-30 hover:opacity-70'
              }`}
              aria-label={`${cols} columns per row`}
            >
              {Array.from({ length: bars }).map((_, i) => (
                <span
                  key={i}
                  className={`block bg-black rounded-[1px] ${
                    bars <= 2 ? 'w-[5px] h-[16px]' :
                    bars === 3 ? 'w-[4px] h-[16px]' :
                    bars === 4 ? 'w-[3px] h-[14px]' :
                    bars === 5 ? 'w-[2.5px] h-[13px]' :
                    'w-[2px] h-[12px]'
                  }`}
                />
              ))}
            </button>
          ))}
        </div>

        {/* Right: Sort Dropdown */}
        <div className="flex-1 flex justify-end">
          <div className="relative group cursor-pointer flex items-center gap-2 uppercase tracking-widest text-[11px] font-medium">
            <span>{sortOption}</span>
            <ChevronDown strokeWidth={1} size={16} />
            
            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40 text-left">
              {['Featured', 'Best selling', 'Date, new to old', 'Price, low to high', 'Price, high to low'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => setSortOption(opt)}
                  className={`block w-full text-left px-4 py-3 hover:bg-gray-50 ${sortOption === opt ? 'font-bold' : ''}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grid — full width, no side padding */}
      <div className="w-full">
        {products.length > 0 ? (
          <>
            <div className={`grid ${gridClassMap[gridCols]}`}>
              {products.map((product) => (
                <ProductCard key={product.id || product.sku} product={product} />
              ))}
            </div>

            {/* Pagination trigger / button */}
            <div className="mt-16 flex flex-col items-center justify-center">
              {hasMore && (
                <button 
                  onClick={() => loadMore()}
                  disabled={isLoading}
                  className="mf-btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Loading More...' : 'Load More'}
                </button>
              )}
              {/* Invisible sentinel element to trigger IntersectionObserver */}
              <div ref={sentinelRef} className="h-10 w-full mt-4"></div>
            </div>
          </>
        ) : isLoading ? (
          <div className="w-full py-6">
            <ProductGridSkeleton count={8} gridCols={gridCols} />
          </div>
        ) : (
          <div className="text-center py-32 font-sans tracking-widest uppercase text-sm">
            No products found.
          </div>
        )}
      </div>

      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default CollectionPage;
