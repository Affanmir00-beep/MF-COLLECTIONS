import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import ProductCard from '../product/ProductCard';
import QuickViewModal from '../product/QuickViewModal';

const TabbedProductGrid = () => {
  const [activeTab, setActiveTab] = useState('New Arrivals');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const tabs = ['New Arrivals', 'Best Sellers', 'Sale'];

  const { data: newArrivalsData, isLoading: isLoadingNew } = useQuery({
    queryKey: ['products', 'newArrivals'],
    queryFn: async () => {
      const response = await apiClient.get('/products?pageSize=4&isNewArrival=true');
      return response.data;
    }
  });

  const { data: bestSellersData, isLoading: isLoadingBest } = useQuery({
    queryKey: ['products', 'bestSellers'],
    queryFn: async () => {
      const response = await apiClient.get('/products?pageSize=4&isBestSeller=true');
      return response.data;
    }
  });

  const { data: saleData, isLoading: isLoadingSale } = useQuery({
    queryKey: ['products', 'sale'],
    queryFn: async () => {
      const response = await apiClient.get('/products?pageSize=4&isSale=true');
      return response.data;
    }
  });

  let filteredProducts = [];
  let isLoading = false;
  
  if (activeTab === 'New Arrivals') {
    filteredProducts = newArrivalsData?.products || [];
    isLoading = isLoadingNew;
  } else if (activeTab === 'Best Sellers') {
    filteredProducts = bestSellersData?.products || [];
    isLoading = isLoadingBest;
  } else if (activeTab === 'Sale') {
    filteredProducts = saleData?.products || [];
    isLoading = isLoadingSale;
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
        {isLoading ? (
          <div className="text-center py-12 text-sm uppercase tracking-widest text-gray-500">Loading products...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--gap-card)]">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-gray-500">No products found for this section. Admin needs to add some!</div>
        )}

      </div>

      {/* Quick View */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </section>
  );
};

export default TabbedProductGrid;
