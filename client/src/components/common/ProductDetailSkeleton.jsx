import React from 'react';

/**
 * Luxury Product Detail Page Skeleton loader
 */
const ProductDetailSkeleton = () => {
  return (
    <div className="w-full min-h-screen pt-4 pb-20 px-4 md:px-12 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* Gallery Skeletons */}
        <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="aspect-[3/4] bg-gray-100 rounded-xs" />
          <div className="aspect-[3/4] bg-gray-100 rounded-xs" />
          <div className="aspect-[3/4] bg-gray-100 rounded-xs hidden md:block" />
          <div className="aspect-[3/4] bg-gray-100 rounded-xs hidden md:block" />
        </div>

        {/* Product Details Sidebar Skeletons */}
        <div className="w-full lg:w-2/5 flex flex-col space-y-6 pt-4">
          {/* Title & SKU */}
          <div className="space-y-2">
            <div className="h-6 w-3/4 bg-gray-200 rounded-xs" />
            <div className="h-4 w-1/3 bg-gray-100 rounded-xs" />
          </div>

          {/* Price */}
          <div className="h-7 w-32 bg-gray-200 rounded-xs" />

          {/* Divider */}
          <div className="h-px bg-gray-100 w-full my-4" />

          {/* Size options */}
          <div className="space-y-3">
            <div className="h-3 w-20 bg-gray-150 rounded-xs" />
            <div className="flex gap-2">
              <div className="h-10 w-14 bg-gray-100 rounded-xs" />
              <div className="h-10 w-14 bg-gray-100 rounded-xs" />
              <div className="h-10 w-14 bg-gray-100 rounded-xs" />
              <div className="h-10 w-14 bg-gray-100 rounded-xs" />
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-4">
            <div className="h-12 w-full bg-gray-200 rounded-xs" />
            <div className="h-12 w-full bg-gray-100 rounded-xs" />
          </div>

          {/* Details Accordions */}
          <div className="space-y-3 pt-6">
            <div className="h-10 w-full bg-gray-50 rounded-xs border border-gray-100" />
            <div className="h-10 w-full bg-gray-50 rounded-xs border border-gray-100" />
            <div className="h-10 w-full bg-gray-50 rounded-xs border border-gray-100" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
