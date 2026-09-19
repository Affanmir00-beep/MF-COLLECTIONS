import React from 'react';
import { Link } from 'react-router-dom';
import { optimizeImageUrl } from '../../utils/imageOptimizer';
import ProgressiveImage from '../common/ProgressiveImage';

// Skeleton for collections grid
const CollectionsGridSkeleton = () => (
  <div className="mf-container-bleed pt-2 md:pt-3">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="relative aspect-[4/5] bg-gray-100 animate-pulse overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
        </div>
      ))}
    </div>
  </div>
);


const CollectionsGrid = ({ data = [], loading = false }) => {
  if (loading) return <CollectionsGridSkeleton />;
  if (!data || data.length === 0) return null;

  return (
    <div className="mf-container-bleed pt-2 md:pt-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
        {data.map((col, idx) => (
          <Link
            key={idx}
            to={col.link}
            className="relative group overflow-hidden block aspect-[4/5] bg-gray-100"
          >
            <ProgressiveImage
              src={optimizeImageUrl(col.image, { width: 600, quality: 'auto:good' })}
              alt={col.title}
              priority={idx < 2}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 mf-overlay-dark pointer-events-none"></div>

            <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
              <span className="font-sans text-[0.8125rem] md:text-sm font-semibold tracking-[0.15em] uppercase text-white">
                {col.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionsGrid;
