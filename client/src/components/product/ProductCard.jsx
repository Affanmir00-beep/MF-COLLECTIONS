import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  // Optional wishlist functionality can be added back if needed, but keeping it minimal for now

  return (
    <div 
      className="group flex flex-col w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.discount && (
          <span className="bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1 font-sans">
            Sale
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] bg-gray-100 overflow-hidden block">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'}`}
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.title} alternative`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </Link>

      {/* Product Info - Exact styling as Vanya */}
      <div className="pt-4 flex flex-col items-center text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-sans mb-1">VANYA</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-base text-black mb-2 hover:opacity-70 transition-opacity uppercase">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-1 flex items-center justify-center gap-2 font-sans">
          {product.discount ? (
            <>
              <span className="text-gray-400 line-through text-xs">Rs. {product.originalPrice?.toLocaleString()}</span>
              <span className="text-red-700 font-normal text-sm">Rs. {product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-black font-normal text-sm">Rs. {product.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
