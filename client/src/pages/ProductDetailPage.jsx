import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Heart, Share2, Ruler, Flame, X } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');
  const [openAccordion, setOpenAccordion] = useState('fabric'); 
  const [showSizeModal, setShowSizeModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = mockProducts.find(p => p.id === id);
    if (found) {
      setProduct(found);
    } else {
      navigate('/collection');
    }
  }, [id, navigate]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size to proceed');
      return;
    }
    setError('');
    addToCart(product, selectedSize, 1);
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-8">
      
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 hidden md:block">
        <p className="font-sans text-xs text-gray-500 uppercase tracking-widest">
          Home / {product.category} / <span className="text-black">{product.title}</span>
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Vertical Gallery Left */}
          <div className="w-full md:w-3/5 md:flex hidden flex-col gap-4">
            {product.images.map((img, idx) => (
              <div key={idx} className="w-full bg-gray-50">
                <img src={img} alt={`${product.title} view ${idx+1}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>

          {/* Mobile Swipe Gallery */}
          <div className="w-full md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {product.images.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center bg-gray-50">
                <img src={img} alt={`${product.title} view ${idx+1}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>

          {/* Details Right (Sticky) */}
          <div className="w-full md:w-2/5 md:sticky md:top-24 h-max">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-sans">VANYA</p>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-black"><Share2 size={20} strokeWidth={1} /></button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`${isWishlisted ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={1} />
                </button>
              </div>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl text-black mb-4 uppercase">{product.title}</h1>
            
            <div className="flex items-center gap-3 font-sans mb-6">
              {product.discount ? (
                <>
                  <span className="text-gray-400 line-through text-lg">Rs. {product.originalPrice?.toLocaleString()}</span>
                  <span className="text-red-700 font-normal text-xl">Rs. {product.price.toLocaleString()}</span>
                  <span className="bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1 ml-2">Sale</span>
                </>
              ) : (
                <span className="text-black font-normal text-xl">Rs. {product.price.toLocaleString()}</span>
              )}
            </div>

            {/* FOMO Tags */}
            <div className="flex items-center gap-2 mb-6 text-sm font-sans text-red-600 bg-red-50 p-3 border border-red-100">
              <Flame size={16} />
              <span>11 sold in last 20 hours</span>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-xs uppercase tracking-[0.2em]">Select Size</span>
                <button 
                  onClick={() => setShowSizeModal(true)}
                  className="text-xs text-gray-500 hover:text-black font-sans flex items-center gap-1 border-b border-gray-300 pb-0.5"
                >
                  <Ruler size={14} /> Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setError(''); }}
                    className={`w-12 h-12 flex items-center justify-center border font-sans text-sm transition-colors ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 text-black hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-600 text-xs mt-3 font-sans">{error}</p>}
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 font-sans text-sm uppercase tracking-widest hover:opacity-80 transition-opacity mb-6"
            >
              Add to Bag
            </button>

            {/* Promo Box */}
            <div className="border border-dashed border-black p-4 mb-8 text-center bg-gray-50">
              <p className="font-sans text-sm tracking-wider uppercase mb-1">Prepaid Orders</p>
              <p className="font-sans text-xs text-gray-500">Get 10% Off via Bank Transfer. Code: <span className="font-medium text-black">PREPAID10</span></p>
            </div>

            {/* Accordions */}
            <div className="border-t border-gray-200 font-sans">
              
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full py-4 flex justify-between items-center text-left text-xs uppercase tracking-[0.2em]"
                >
                  <span>Description & Details</span>
                  {openAccordion === 'fabric' ? <ChevronUp size={16} strokeWidth={1} /> : <ChevronDown size={16} strokeWidth={1} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'fabric' ? 'max-h-[500px] pb-4' : 'max-h-0'}`}>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{product.description}</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li><span className="font-medium">Fabric:</span> {product.fabric}</li>
                    <li><span className="font-medium">Pieces:</span> {product.pieceType}</li>
                    <li><span className="font-medium">SKU:</span> {product.sku}</li>
                  </ul>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <button 
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full py-4 flex justify-between items-center text-left text-xs uppercase tracking-[0.2em]"
                >
                  <span>Delivery Information</span>
                  {openAccordion === 'delivery' ? <ChevronUp size={16} strokeWidth={1} /> : <ChevronDown size={16} strokeWidth={1} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'delivery' ? 'max-h-[500px] pb-4' : 'max-h-0'}`}>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Nationwide delivery takes 3-5 business days. International delivery takes 7-10 business days depending on the destination.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSizeModal(false)}></div>
          <div className="bg-white w-full max-w-2xl relative z-10 p-6 md:p-10 shadow-2xl">
            <button 
              onClick={() => setShowSizeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={24} strokeWidth={1} />
            </button>
            <h2 className="font-serif text-2xl mb-6 text-black uppercase tracking-widest">Size Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 font-medium uppercase tracking-[0.2em]">Size</th>
                    <th className="py-3 font-medium uppercase tracking-[0.2em] text-center">Chest</th>
                    <th className="py-3 font-medium uppercase tracking-[0.2em] text-center">Waist</th>
                    <th className="py-3 font-medium uppercase tracking-[0.2em] text-center">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 font-medium">XS</td><td className="text-center text-gray-600">34</td><td className="text-center text-gray-600">28</td><td className="text-center text-gray-600">36</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 font-medium">S</td><td className="text-center text-gray-600">36</td><td className="text-center text-gray-600">30</td><td className="text-center text-gray-600">38</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 font-medium">M</td><td className="text-center text-gray-600">38</td><td className="text-center text-gray-600">32</td><td className="text-center text-gray-600">40</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
