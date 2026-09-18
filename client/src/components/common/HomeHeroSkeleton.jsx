import React from 'react';

/**
 * Luxury Home Page Skeleton with shimmer placeholders for hero banner and collection grids
 */
const HomeHeroSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="w-full h-[65vh] md:h-[85vh] bg-gray-150 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-[shimmer_2s_infinite]" />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="h-8 w-64 md:w-96 bg-gray-200 rounded-xs" />
          <div className="h-4 w-40 bg-gray-200 rounded-xs" />
          <div className="h-10 w-36 bg-gray-200 rounded-xs mt-4" />
        </div>
      </div>

      {/* Collections Row Skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex flex-col space-y-2">
            <div className="aspect-[3/4] bg-gray-100 rounded-xs" />
            <div className="h-3 w-24 bg-gray-150 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeHeroSkeleton;
