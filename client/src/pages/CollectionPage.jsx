import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/product/QuickViewModal';
import FilterDrawer from '../components/layout/FilterDrawer';
import { SlidersHorizontal, Grid2X2, LayoutGrid, ChevronDown } from 'lucide-react';

const CollectionPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');

  const [products, setProducts] = useState(mockProducts);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All Collections');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4); // Default to 4 columns like Vanya

  useEffect(() => {
    window.scrollTo(0, 0);
    let filtered = [...mockProducts];
    
    if (categoryParam) {
      filtered = filtered.filter(p => p.category === categoryParam);
      setActiveCategory(categoryParam);
    } else if (filterParam === 'new') {
      filtered = filtered.filter(p => p.isNew);
      setActiveCategory('New Arrivals');
    } else if (filterParam === 'sale') {
      filtered = filtered.filter(p => p.discount);
      setActiveCategory('Sale');
    } else {
      setActiveCategory('All Collections');
    }
    
    setProducts(filtered);
  }, [categoryParam, filterParam]);

  return (
    <div className="bg-white min-h-screen pb-16">
      
      {/* Category Header */}
      <div className="text-center py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-5xl text-black tracking-widest uppercase mb-4">
          {activeCategory}
        </h1>
        <p className="font-sans text-gray-400 text-sm tracking-wider uppercase">
          {products.length} Products
        </p>
      </div>

      {/* Top Utility Bar (Vanya Layout) */}
      <div className="sticky top-[73px] z-20 bg-white border-y border-[var(--color-border)] py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center mb-8">
        
        {/* Left: Filter Toggle */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
        >
          <SlidersHorizontal size={16} strokeWidth={1.5} /> 
          <span className="hidden sm:inline">Filter</span>
        </button>

        {/* Center: Grid Controls (Desktop only) */}
        <div className="hidden md:flex items-center gap-4 text-gray-400">
          <button 
            onClick={() => setGridCols(2)} 
            className={`transition-colors ${gridCols === 2 ? 'text-black' : 'hover:text-black'}`}
          >
            <Grid2X2 size={20} strokeWidth={1} />
          </button>
          <button 
            onClick={() => setGridCols(4)} 
            className={`transition-colors ${gridCols === 4 ? 'text-black' : 'hover:text-black'}`}
          >
            <LayoutGrid size={20} strokeWidth={1} />
          </button>
        </div>

        {/* Right: Sort By */}
        <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-black cursor-pointer group">
          <span className="hidden sm:inline">Sort by</span>
          <span className="sm:hidden">Sort</span>
          <ChevronDown size={14} strokeWidth={1.5} className="group-hover:rotate-180 transition-transform duration-300" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Grid */}
        {products.length > 0 ? (
          <div className={`grid grid-cols-2 gap-x-2 gap-y-8 md:gap-x-4 md:gap-y-12 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-2 max-w-4xl mx-auto'}`}>
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setQuickViewProduct} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="font-sans text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* Quick View */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </div>
  );
};

export default CollectionPage;
