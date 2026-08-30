import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * HeroSlider — 16:9 Full-Bleed Widescreen Video Banner (Matching Vanya)
 * - Exact 16:9 ratio (aspect-video) matching Vanya's hero video banner
 * - Right & left sides take 100% full space (edge-to-edge)
 * - Top & bottom take 100% full space with zero black bars or letterboxing
 * - Infinite sequential loop across multiple videos
 */
const HeroSlider = ({ data = [] }) => {
  const [current, setCurrent] = useState(0);
  const activeVideoRef = useRef(null);

  // Keep slides that have videoUrl (or fallback to image if no video configured)
  const slides = (data || []).filter(s => s && (s.videoUrl || s.image));
  const total = slides.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) {
      if (activeVideoRef.current) {
        activeVideoRef.current.currentTime = 0;
        activeVideoRef.current.play().catch(() => {});
      }
      return;
    }
    setCurrent(prev => (prev + 1) % total);
  }, [total]);

  // When active slide changes, ensure the newly active video plays from start
  useEffect(() => {
    if (activeVideoRef.current) {
      activeVideoRef.current.currentTime = 0;
      const playPromise = activeVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [current]);

  // Fallback for image-only slides (auto-advance after 5s)
  useEffect(() => {
    if (!slides[current]?.videoUrl && total > 1) {
      const timer = setTimeout(() => {
        nextSlide();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [current, slides, total, nextSlide]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-black select-none">
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        const isVideo = Boolean(slide.videoUrl);

        return (
          <div
            key={slide._id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {isVideo ? (
              <video
                ref={isActive ? activeVideoRef : null}
                src={slide.videoUrl}
                poster={slide.image}
                muted
                playsInline
                autoPlay={isActive}
                loop={total === 1}
                preload={isActive ? 'auto' : 'metadata'}
                onEnded={nextSlide}
                onError={() => {
                  if (total > 1) nextSlide();
                }}
                className="w-full h-full object-cover block"
              />
            ) : (
              <img
                src={slide.image}
                alt={slide.title || 'Hero Slide'}
                className="w-full h-full object-cover block"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HeroSlider;
