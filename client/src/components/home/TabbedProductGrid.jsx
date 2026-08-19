import React, { useState } from 'react';
import ProductCard from '../product/ProductCard';
import QuickViewModal from '../product/QuickViewModal';
import { mockProducts } from '../../data/mockProducts';

const TabbedProductGrid = () => {
  const [activeTab, setActiveTab] = useState('New Arrivals');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const tabs = ['New Arrivals', 'Best Sellers', 'Sale'];

  let filteredProducts = [...mockProducts];
  if (activeTab === 'New Arrivals') {
    filteredProducts = filteredProducts.filter(p => p.isNew).slice(0, 4);
  } else if (activeTab === 'Best Sellers') {
    filteredProducts = filteredProducts.filter(p => p.isBestSeller).slice(0, 4);
  } else if (activeTab === 'Sale') {
    filteredProducts = filteredProducts.filter(p => p.discount).slice(0, 4);
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl tracking-widest text-black mb-8 uppercase">Curated For You</h2>
          <div className="flex gap-6 md:gap-12 w-full justify-center">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-sans text-xs tracking-[0.2em] uppercase transition-colors relative ${
                  activeTab === tab ? 'text-black font-medium border-b border-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TabbedProductGrid;
