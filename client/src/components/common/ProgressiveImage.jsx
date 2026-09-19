import React, { useState, useEffect } from 'react';

/**
 * ProgressiveImage component handles lazy loading with an animated skeleton fallback.
 * It also supports prioritized loading for LCP elements.
 */
const ProgressiveImage = ({ 
  src, 
  alt, 
  className = '',
  containerClassName = '',
  priority = false, // Set to true for LCP images (above the fold)
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If priority is true, the image is likely already cached or loading fast
    // We can pre-emptively try to decode it, though native img tag handles it.
  }, [src, priority]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoaded(true); // Remove skeleton
    console.error('Image failed to load:', src);
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
      {/* Skeleton / Shimmer background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchpriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default ProgressiveImage;
