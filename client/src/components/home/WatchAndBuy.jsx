import React, { useState, useRef } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import VideoShoppingModal from './VideoShoppingModal';
import apiClient from '../../api/apiClient';
import { optimizeImageUrl } from '../../utils/imageOptimizer';

// Skeleton for Watch & Buy section
const WatchAndBuySkeleton = () => (
  <section className="bg-white py-6 md:py-8">
    <div className="text-center mb-5">
      <div className="h-3 w-28 bg-gray-200 animate-pulse rounded-sm mx-auto" />
    </div>
    <div className="flex gap-2 px-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="shrink-0 bg-gray-100 animate-pulse rounded-sm"
          style={{ width: 'clamp(140px, 22vw, 210px)', aspectRatio: '9/16' }}
        />
      ))}
    </div>
  </section>
);

/**
 * VideoCard — video always plays on loop (auto), no hover-to-play
 * Click opens modal
 */
const VideoCard = ({ item, onClick }) => {
  const isVideo = item.videoUrl && !item.videoUrl.includes('instagram.com');
  // Optimize poster image via Cloudinary transforms
  const optimizedPoster = item.coverImage
    ? optimizeImageUrl(item.coverImage, { width: 400, quality: 'auto:good' })
    : undefined;

  return (
    <div
      className="shrink-0 relative cursor-pointer overflow-hidden bg-black select-none"
      style={{ width: 'var(--wab-card-w)', aspectRatio: '9/16' }}
      onClick={onClick}
    >
      {isVideo ? (
        <video
          src={item.videoUrl}
          poster={optimizedPoster}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={optimizedPoster || item.coverImage}
          alt="thumbnail"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      )}

      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

      {/* views */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-white text-[10px] bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm z-10 pointer-events-none">
        <Eye strokeWidth={1.5} size={12} />
        <span className="font-sans font-medium">{item.views || '1.2K'}</span>
      </div>

      {/* sku thumbnail */}
      <div className="absolute bottom-3 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 bg-white/10">
          <img src={optimizedPoster || item.coverImage} alt="sku" className="w-full h-full object-cover" />
        </div>
        <span className="text-white text-[10px] font-sans font-medium drop-shadow-md">
          {item.productSku}
        </span>
      </div>
    </div>
  );
};

/**
 * WatchAndBuy
 * - Videos auto-play on loop (always)
 * - Prev / Next buttons scroll through cards
 */
const WatchAndBuy = ({ data = [], loading = false }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const trackRef = useRef(null);

  // card width px — kept in sync with CSS variable below
  const CARD_W = typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 210;
  const GAP = 8;

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const amount = (CARD_W + GAP) * 3; // jump 3 cards
    trackRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const handleOpenVideo = (item) => {
    setActiveVideo(item);
    if (item._id) {
      apiClient.post(`/content/watch-buy/${item._id}/view`).catch(() => {});
    }
  };

  if (loading) return <WatchAndBuySkeleton />;
  if (!data || data.length === 0) return null;

  return (
    <>
      <section id="watch-buy" className="bg-white py-6 md:py-8"
        style={{ '--wab-card-w': `${CARD_W}px` }}
      >
        {/* heading */}
        <div className="text-center mb-5">
          <h2 className="font-sans text-[11px] tracking-[0.3em] uppercase font-medium">Watch &amp; Buy</h2>
        </div>

        {/* track + arrows */}
        <div className="relative group">
          {/* scroll track */}
          <div
            ref={trackRef}
            className="flex gap-2 overflow-x-auto no-scrollbar px-4 scroll-smooth"
          >
            {data.map((item, idx) => (
              <VideoCard
                key={item._id || idx}
                item={item}
                onClick={() => handleOpenVideo(item)}
              />
            ))}
          </div>

          {/* left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/90 rounded-full shadow border border-gray-200 text-black hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft strokeWidth={1.5} size={18} />
          </button>

          {/* right arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/90 rounded-full shadow border border-gray-200 text-black hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            <ChevronRight strokeWidth={1.5} size={18} />
          </button>
        </div>
      </section>

      {activeVideo && (
        <VideoShoppingModal
          video={activeVideo}
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
};

export default WatchAndBuy;
