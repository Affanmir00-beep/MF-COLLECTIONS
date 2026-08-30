import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'SUMMER SKY', image: '/images/prod1.jpg' },
  { name: 'POSTCARDS FROM JULY', image: '/images/prod2.jpg' },
  { name: 'VIRSA', image: '/images/prod5.jpg' },
  { name: 'DASTAAN', image: '/images/banner1.jpg' },
  { name: 'CO-ORDS', image: '/images/banner2.jpg' },
  { name: 'SILK ELEGANCE', image: '/images/prod1.jpg' },
  { name: 'RENÉ', image: '/images/prod2.jpg' },
  { name: 'SOLANA', image: '/images/prod5.jpg' },
  { name: 'MINI CLUB', image: '/images/banner1.jpg' },
];

const CategoryBanners = () => {
  return (
    <section className="py-2 mb-10 w-full px-2 sm:px-4">
      {/* 3x3 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--gap-card)]">
        {categories.map((cat, idx) => (
          <Link 
            key={idx} 
            to={`/collection?category=${encodeURIComponent(cat.name)}`} 
            className="relative group block aspect-square overflow-hidden"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle overlay for text readability */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            
            {/* Centered text and button like the live site */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h3 className="text-white font-sans text-xl md:text-2xl tracking-[0.2em] uppercase mb-4 text-center px-4">
                {cat.name}
              </h3>
              <span className="text-white font-sans text-[10px] tracking-widest border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors duration-300 uppercase">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryBanners;
