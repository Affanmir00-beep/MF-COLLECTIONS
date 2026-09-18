import React from 'react';
import { Link } from 'react-router-dom';
import { optimizeImageUrl } from '../../utils/imageOptimizer';
import ProgressiveImage from '../common/ProgressiveImage';

const ProductCard = ({ product, fillHeight = false }) => {
  const images = product.images?.length > 0 
    ? product.images 
    : ['/images/prod1.jpg'];
    
  const hasHoverImage = images.length > 1;

  const firstCollection = product.collectionHandles?.[0] || 'all';
  const productUrl = `/collections/${firstCollection}/products/${product.sku || product.id || product._id}`;

  const isSoldOut = product.badge === "Sold out";

  const availSizes = product.availableSizes?.length 
    ? product.availableSizes 
    : (product.variants?.filter(v => v.stock > 0).map(v => v.size) || product.sizes || ['XS', 'S', 'M', 'L']);
  
  const isFreeSize = availSizes.some(s => typeof s === 'string' && s.toLowerCase().includes('free'));
  const sizeLabel = isFreeSize ? 'FREE SIZE' : availSizes.join('  ');

  const rawImg1 = typeof images[0] === 'object' ? images[0].url : images[0];
  const rawImg2 = hasHoverImage ? (typeof images[1] === 'object' ? images[1].url : images[1]) : null;

  const optimizedImg1 = optimizeImageUrl(rawImg1, { width: 600, quality: 'auto:good' });
  const optimizedImg2 = rawImg2 ? optimizeImageUrl(rawImg2, { width: 600, quality: 'auto:good' }) : null;

  return (
    <div className={`group/card flex flex-col w-full relative ${isSoldOut ? 'opacity-70' : ''} ${fillHeight ? 'h-full' : ''}`}>
      {/* Image container — aspect-[3/4] by default, fills parent height when fillHeight=true */}
      <Link
        to={productUrl}
        className={`block relative overflow-hidden bg-gray-50 ${fillHeight ? 'flex-1 min-h-0' : 'aspect-[3/4]'}`}
      >
        <ProgressiveImage
          src={optimizedImg1} 
          alt={product.title || product.sku} 
          priority={false} // Adjust depending on where it's rendered, but usually false for grids
          className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 ${hasHoverImage ? 'group-hover/card:opacity-0' : ''}`}
        />
        {hasHoverImage && optimizedImg2 && (
          <ProgressiveImage
            src={optimizedImg2} 
            alt={`${product.title || product.sku} alternate`} 
            priority={false}
            className="w-full h-full object-cover transition-opacity duration-500 absolute inset-0 opacity-0 group-hover/card:opacity-100"
          />
        )}
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#111111] text-white mf-micro px-3 py-1.5 rounded-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Sizes overlay — ONLY visible on hover, bottom of image */}
        <div className="absolute bottom-0 inset-x-0 flex justify-center items-end pb-3 z-10 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          <span className="font-sans text-[10px] tracking-[0.2em] text-white uppercase font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-sm">
            {availSizes.join(', ')}
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col shrink-0 pt-2 pb-3 space-y-0.5 bg-white">
        <Link to={productUrl} className="font-sans text-[10px] tracking-widest text-gray-500 hover:text-black transition-colors uppercase">
          {product.sku}
        </Link>
        <span className="font-sans text-[9px] tracking-widest text-gray-400 uppercase">
          {sizeLabel}
        </span>
        <span className="font-sans text-[12px] text-black font-medium">
          {product.currency === 'PKR' ? 'Rs.' : ''}
          {product.price?.toLocaleString() || product.price}
          {product.currency === 'PKR' ? '.00' : ''}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
