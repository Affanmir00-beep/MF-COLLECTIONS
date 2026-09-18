import React from 'react';
import { Link } from 'react-router-dom';
import { optimizeImageUrl } from '../../utils/imageOptimizer';

const StoreLocator = ({ data }) => {
  return (
    <section className="py-2 bg-white">
      <Link to={data?.link || "/pages/store-locator"} className="block relative w-full h-[60vh] md:h-[70vh] group overflow-hidden bg-gray-100">
        <img 
          src={optimizeImageUrl(data?.image || "/images/banner2.jpg", { width: 1400, quality: 'auto:good' })} 
          alt={data?.title || "Store Interior"} 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h2 className="font-sans text-[28px] md:text-[40px] text-white tracking-[0.2em] uppercase mb-4 drop-shadow-md font-semibold">
            {data?.title || "STORE LOCATOR"}
          </h2>
          <p className="font-serif text-lg md:text-xl text-white italic drop-shadow-sm">
            {data?.subtitle || "Step Into The World Of VANYA"}
          </p>
        </div>
      </Link>
    </section>
  );
};

export default StoreLocator;
