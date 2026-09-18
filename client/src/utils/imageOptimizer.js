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

    const transformations = [];

    // Format & Quality
    if (format) transformations.push(`f_${format}`);
    if (quality) transformations.push(`q_${quality}`);
    if (progressive) transformations.push('fl_progressive');

    // Dimensions
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop && (width || height)) transformations.push(`c_${crop}`);
    transformations.push('dpr_auto');

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
