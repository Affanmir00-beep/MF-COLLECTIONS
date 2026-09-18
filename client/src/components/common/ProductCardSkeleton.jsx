import React from 'react';

/**
 * Product Card Skeleton with luxury pulsing shimmer effect
 */
const ProductCardSkeleton = ({ fillHeight = false }) => {
  return (
    <div className={`flex flex-col w-full animate-pulse ${fillHeight ? 'h-full' : ''}`}>
      {/* Image Placeholder with exact 3/4 aspect ratio */}
      <div className={`relative overflow-hidden bg-gray-100 ${fillHeight ? 'flex-1 min-h-0' : 'aspect-[3/4]'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Info Placeholder */}
      <div className="flex flex-col shrink-0 pt-3 pb-3 space-y-2 bg-white">
        {/* SKU / Title bar */}
        <div className="h-3 w-24 bg-gray-200 rounded-xs" />
        {/* Sizing bar */}
        <div className="h-2.5 w-16 bg-gray-150 rounded-xs" />
        {/* Price bar */}
        <div className="h-3 w-20 bg-gray-200 rounded-xs" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
