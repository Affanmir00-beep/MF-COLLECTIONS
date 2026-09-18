import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Flame, Eye, Ruler, Heart, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import useCartStore from '../store/cartStore';
import ProductCard from '../components/product/ProductCard';
import ProductDetailSkeleton from '../components/common/ProductDetailSkeleton';
import SizeGuideModal from '../components/product/SizeGuideModal';
import { mockApi } from '../data/mockApi';
import useUIStore from '../store/uiStore';
import { optimizeImageUrl } from '../utils/imageOptimizer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedSize, setSelectedSize] = useState('');
  const [validationError, setValidationError] = useState('');
  const [openAccordion, setOpenAccordion] = useState('description'); 
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [related, setRelated] = useState([]);
  const [liveViewers, setLiveViewers] = useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveViewers(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.max(12, Math.min(32, next));
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    mockApi.getProduct(id)
      .then(res => {
        setProduct(res);
        return mockApi.getCollectionProducts(res.collectionHandles?.[0] || 'all', { limit: 5 });
      })
      .then(relatedRes => {
        setRelated(relatedRes.items.filter(p => p.id !== id).slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        setError('Product Not Found');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center font-sans tracking-widest uppercase text-red-500 text-sm">Product Not Found</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setValidationError('Please select a size to proceed');
      return;
    }
    setValidationError('');
    const cartItem = {
      _id: product.id,
      title: product.title,
      price: product.price,
      images: product.images
    };
    addItem(cartItem, selectedSize);
    useUIStore.getState().openCart();
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const images = product.images || ['/images/hero.jpg'];
  const collectionHandle = product.collectionHandles?.[0] || 'all';
  const collectionName = collectionHandle.replace(/-/g, ' ');

  return (
    <div className="bg-white min-h-screen pb-20 pt-4 md:pt-8 text-black">
      
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 hidden md:block">
        <div className="flex items-center gap-2 font-sans text-[10px] text-gray-500 uppercase tracking-[0.15em]">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/collections/${collectionHandle}`} className="hover:text-black transition-colors">{collectionName}</Link>
          <span>/</span>
          <span className="text-black truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-0 md:px-6 lg:px-8 mt-2">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Gallery Left - Mobile Swipe, Desktop Thumbnails */}
          <div className="w-full md:w-3/5 flex flex-col-reverse md:flex-row gap-4 px-4 md:px-0">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col gap-3 overflow-y-auto w-24 shrink-0 no-scrollbar max-h-[80vh]">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-full aspect-[3/4] shrink-0 overflow-hidden transition-all ${activeImage === idx ? 'border border-black p-0.5' : 'border border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img 
                    src={optimizeImageUrl(img, { width: 160, quality: 'auto:good' })} 
                    alt={`Thumbnail ${idx}`} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="w-full relative overflow-hidden group">
              {/* Mobile Swipe Container */}
              <div className="flex overflow-x-auto snap-x-mandatory md:block md:overflow-visible no-scrollbar">
                {images.map((img, idx) => (
                  <div key={idx} className={`w-full shrink-0 snap-center md:h-auto ${idx !== activeImage ? 'md:hidden' : ''}`}>
                     <img 
                      src={optimizeImageUrl(img, { width: 1200, quality: 'auto:good' })} 
                      alt={product.title} 
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full aspect-[3/4] md:h-[80vh] md:aspect-auto object-cover transition-transform duration-700 ease-out md:group-hover:scale-105 origin-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Right */}
          <div className="w-full md:w-2/5 flex flex-col pt-6 md:pt-0 px-4 md:px-0 sticky top-24 self-start max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar pb-10">
            <h1 className="font-serif text-[1.75rem] md:text-[2.25rem] uppercase mb-2 tracking-[0.12em] leading-tight text-[#111111]">{product.title}</h1>
            <p className="mf-label text-gray-500 mb-4">{product.sku}</p>
            <p className="font-sans text-[1.125rem] font-medium mb-6 text-[#111111]">
              Rs.{product.price?.toLocaleString()}
              {product.originalPrice && (
                <span className="text-gray-400 line-through ml-3 text-sm">Rs.{product.originalPrice.toLocaleString()}</span>
              )}
            </p>
            
            {/* Urgency & Social Proof */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-[#C42031] font-sans text-xs tracking-wider font-semibold">
                <Flame strokeWidth={2} size={16} />
                <span>{product.soldRecently} sold in {product.soldTimeframe}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-sans text-[11px] tracking-widest uppercase bg-gray-50 p-2.5 rounded border border-gray-100">
                <Eye strokeWidth={1.5} size={16} className="text-black" />
                <span className="font-medium text-black">{liveViewers} people are viewing this right now</span>
              </div>
            </div>

            {/* Promo block */}
            <div className="bg-[#FFF8D6] border border-[#FFE787] p-3 flex items-center justify-between mb-8 shadow-sm">
              <div>
                <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-black">Pay via Card / Bank Transfer</p>
                <p className="font-sans text-[10px] text-gray-700 uppercase tracking-widest mt-1">Avail Additional 10% OFF</p>
              </div>
              <div className="bg-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest border border-dashed border-[#FFE787]">
                PREPAID ORDER
              </div>
            </div>

            {/* Size Matrix */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="mf-label text-gray-500">Size</span>
                <button 
                  onClick={() => setShowSizeModal(true)}
                  className="flex items-center gap-1 mf-label text-gray-500 hover:text-black transition-colors"
                >
                  <Ruler strokeWidth={1.5} size={14} /> Size Guide
                </button>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                {(product.variants?.length > 0 ? product.variants : product.sizes?.map(s => ({ size: s, stock: product.availableSizes?.includes(s) ? 10 : 0 })) || []).map((v) => {
                  const isAvailable = v.stock > 0;
                  const isLowStock = v.stock > 0 && v.stock <= 3;
                  return (
                    <button
                      key={v.size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(v.size)}
                      className={`
                        py-3 border mf-label transition-all relative flex flex-col items-center gap-0.5
                        ${selectedSize === v.size ? 'border-[#111111] bg-[#111111] text-white shadow-md' : 'border-[#EAEAEA] text-[#111111] hover:border-gray-400'}
                        ${!isAvailable ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400' : 'cursor-pointer'}
                      `}
                    >
                      <span>{v.size}</span>
                      {isAvailable && isLowStock && (
                        <span className={`text-[8px] font-mono ${selectedSize === v.size ? 'text-red-300' : 'text-red-500'}`}>
                          Only {v.stock} left
                        </span>
                      )}
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                          <div className="w-[120%] h-px bg-gray-300 rotate-45 transform origin-center"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {validationError && <p className="text-red-500 text-[10px] mt-2 font-sans tracking-widest uppercase">{validationError}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-10">
              <button 
                onClick={handleAddToCart}
                className="flex-1 mf-btn-primary py-4"
              >
                Add to Bag
              </button>
              <button className="w-14 border border-[#111111] flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors text-[#111111]">
                <Heart strokeWidth={1} size={20} />
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#EAEAEA]">
              <div className="border-b border-[#EAEAEA]">
                <button 
                  onClick={() => toggleAccordion('description')}
                  className="w-full py-5 flex justify-between items-center text-left"
                >
                  <span className="mf-label text-[#111111]">Description</span>
                  {openAccordion === 'description' ? <Minus strokeWidth={1} size={18} /> : <Plus strokeWidth={1} size={18} />}
                </button>
                {openAccordion === 'description' && (
                  <div className="pb-5 font-sans text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>
              
              <div className="border-b border-[#EAEAEA]">
                <button 
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-5 flex justify-between items-center text-left"
                >
                  <span className="mf-label text-[#111111]">Fabric & Care</span>
                  {openAccordion === 'care' ? <Minus strokeWidth={1} size={18} /> : <Plus strokeWidth={1} size={18} />}
                </button>
                {openAccordion === 'care' && (
                  <div className="pb-5 font-sans text-sm text-gray-600 leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                      {product.care?.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Extra Custom Fields / Specifications */}
              {product.extraFields && product.extraFields.length > 0 && (
                <div className="border-b border-[#EAEAEA]">
                  <button 
                    onClick={() => toggleAccordion('details')}
                    className="w-full py-5 flex justify-between items-center text-left"
                  >
                    <span className="mf-label text-[#111111]">Product Details & Specs</span>
                    {openAccordion === 'details' ? <Minus strokeWidth={1} size={18} /> : <Plus strokeWidth={1} size={18} />}
                  </button>
                  {openAccordion === 'details' && (
                    <div className="pb-5 font-sans text-sm text-gray-600 space-y-2">
                      {product.extraFields.map((field, idx) => (
                        <div key={idx} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0 text-xs">
                          <span className="font-semibold uppercase tracking-wider text-black">{field.label}</span>
                          <span className="text-gray-700 text-right">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={showSizeModal} onClose={() => setShowSizeModal(false)} />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-24 mf-container border-t border-[#EAEAEA] pt-16">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="mf-heading">You May Also Like</h2>
          </div>
          
          <div className="relative group">
            <div className="flex overflow-x-auto gap-[var(--gap-card)] snap-x-mandatory no-scrollbar pb-8">
              {related.map(p => (
                <div key={p.id} className="w-[200px] md:w-1/4 shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            {related.length > 4 && (
              <>
                <button className="hidden md:flex absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-100 text-black hover:bg-gray-50 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft strokeWidth={1} size={24} />
                </button>
                <button className="hidden md:flex absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-100 text-black hover:bg-gray-50 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight strokeWidth={1} size={24} />
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
