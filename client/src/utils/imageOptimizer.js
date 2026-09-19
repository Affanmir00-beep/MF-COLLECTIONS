/**
 * Cloudinary & Image URL Optimization Utility
 * 
 * Automatically applies:
 * - f_auto (Modern format: WebP / AVIF)
 * - q_auto:good (Smart lossless perceptual compression)
 * - Responsive sizing (w_...)
 * - Progressive loading (fl_progressive)
 */

export const optimizeImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return url;

  // If local static image, return as is
  if (url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }

  const {
    width = null,
    height = null,
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
    progressive = true,
  } = options;

  // Check if it is a Cloudinary URL
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Avoid double transforming
    if (url.includes('/f_auto') || url.includes('/q_auto')) {
      return url;
    }

    const isVideo = url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov|ogg|m4v)($|\?)/i);
    if (isVideo) {
      return url; // Videos should not receive image transformations
    }

    const transformations = [];

    // Format & Quality
    if (format) transformations.push(`f_${format}`);
    if (quality) transformations.push(`q_${quality}`);
    
    // fl_progressive is strictly for images. Cloudinary rejects it for videos.
    if (progressive && !isVideo) transformations.push('fl_progressive');

    // Dimensions
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop && (width || height)) transformations.push(`c_${crop}`);
    // Removed dpr_auto to prevent 400 errors on free Cloudinary accounts

    const transformStr = transformations.join(',');

    // Insert transformation after '/upload/'
    return url.replace('/upload/', `/upload/${transformStr}/`);
  }

  return url;
};

/**
 * Generate a responsive srcSet string for Cloudinary images
 */
export const generateSrcSet = (url, widths = [360, 640, 900, 1200]) => {
  if (!url || !url.includes('res.cloudinary.com')) return undefined;

  return widths
    .map((w) => `${optimizeImageUrl(url, { width: w })} ${w}w`)
    .join(', ');
};
