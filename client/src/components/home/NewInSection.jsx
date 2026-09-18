import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockApi } from '../../data/mockApi';
import { optimizeImageUrl } from '../../utils/imageOptimizer';

/* ─── Individual product card — uses named group/card so hover is isolated ─── */
const NewInCard = ({ product }) => {
  const images = product.images?.length > 0
    ? product.images.map(img => typeof img === 'object' ? img.url : img)
    : ['/images/prod1.jpg'];

  const hasHover = images.length > 1;
  const firstCollection = product.collectionHandles?.[0] || 'all';
  const productUrl = `/collections/${firstCollection}/products/${product.sku || product.id}`;

  const availSizes = product.availableSizes?.length
    ? product.availableSizes
    : (product.variants?.filter(v => v.stock > 0).map(v => v.size) || product.sizes || ['Free Size']);
  const isFreeSize = availSizes.some(s => typeof s === 'string' && s.toLowerCase().includes('free'));
  const sizeLabel = isFreeSize ? 'FREE SIZE' : availSizes.join('  ');

  const img1 = optimizeImageUrl(images[0], { width: 600, quality: 'auto:good' });
  const img2 = hasHover ? optimizeImageUrl(images[1], { width: 600, quality: 'auto:good' }) : null;

  return (
    /* group/card — named group so hover ONLY affects THIS card */
    <div className="group/card flex flex-col h-full w-full shrink-0 bg-white">
      {/* Image area — fills available height */}
      <Link to={productUrl} className="relative flex-1 min-h-0 block overflow-hidden bg-gray-50">
        {/* Primary image */}
        <img
          src={img1}
          alt={product.title || product.sku}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500
            ${hasHover ? 'group-hover/card:opacity-0' : ''}`}
        />
        {/* Hover image — only shows on THIS card's hover */}
        {hasHover && img2 && (
          <img
            src={img2}
            alt={`${product.title || product.sku} alt`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
          />
        )}
        {/* Size overlay bottom */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
          <span className="font-sans text-[9px] tracking-[0.25em] text-white/90 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {sizeLabel}
          </span>
        </div>
      </Link>

      {/* Product info — fixed below image */}
      <div className="shrink-0 pt-2 pb-3 px-1 bg-white">
        <Link to={productUrl} className="font-sans text-[10px] tracking-widest text-gray-500 hover:text-black uppercase block">
          {product.sku}
        </Link>
        <span className="font-sans text-[9px] tracking-widest text-gray-400 uppercase block">
          {sizeLabel}
        </span>
        <span className="font-sans text-[12px] text-black font-medium block mt-0.5">
          Rs.{product.price?.toLocaleString()}.00
        </span>
      </div>
    </div>
  );
};

/* ─── NewInSection ─── */
const NewInSection = ({ data }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    mockApi.getCollectionProducts('new-in', { limit: 8 })
      .then(res => { setProducts(res.items); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const cardEl = trackRef.current.querySelector('[data-card]');
    const cardW = cardEl ? cardEl.offsetWidth + 2 : 252;
    trackRef.current.scrollBy({ left: dir === 'right' ? cardW : -cardW, behavior: 'smooth' });
  };

  if (loading || !products.length) return null;

  const COVER_W = 'clamp(180px, 23%, 290px)';
  const SECTION_H = 'clamp(440px, 70vh, 760px)';

  return (
    <section className="bg-white w-full">

      {/* ── Header row: NEW IN label + View All, aligned to product area start ── */}
      <div
        className="flex items-center justify-between pt-8 pb-3"
        style={{ paddingLeft: `calc(${COVER_W} + 10px)`, paddingRight: '16px' }}
      >
        <h2 className="font-sans text-[10px] tracking-[0.35em] uppercase font-semibold text-black">New In</h2>
        <Link
          to={data?.link || '/collections/new-arrivals'}
          className="font-sans text-[9px] tracking-[0.25em] uppercase text-gray-400 hover:text-black transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* ── Main row ── */}
      {/* Use group/section for the section-level hover (arrows), NOT group */}
      <div className="relative w-full group/section" style={{ height: SECTION_H }}>

        {/* Cover Image */}
        <Link
          to={data?.link || '/collections/new-arrivals'}
          className="absolute left-0 top-0 bottom-0 block overflow-hidden z-10"
          style={{ width: COVER_W }}
        >
          <img
            src={optimizeImageUrl(data?.image || '/images/prod5.jpg', { width: 600, quality: 'auto:good' })}
            alt={data?.title || 'New In'}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 px-4">
            <span className="font-serif italic text-white text-[0.9rem] leading-snug text-center opacity-90">
              {data?.subtitle || '"Fresh arrivals that redefine everyday elegance."'}
            </span>
            <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/75 border-b border-white/40 pb-0.5">
              Explore Now
            </span>
          </div>
        </Link>

        {/* Product carousel — starts 10px after cover */}
        <div
          ref={trackRef}
          className="absolute top-0 bottom-0 right-0 flex overflow-x-auto no-scrollbar"
          style={{ left: `calc(${COVER_W} + 10px)`, gap: '2px' }}
        >
          {products.map((product, i) => (
            <div
              data-card
              key={product.id || i}
              className="shrink-0 h-full"
              style={{ width: 'clamp(190px, 22vw, 270px)' }}
            >
              <NewInCard product={product} />
            </div>
          ))}
        </div>

        {/* Arrows — use group/section so they don't conflict with card hover */}
        <button
          onClick={() => scroll('left')}
          className="absolute z-20 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow border border-gray-200 text-black hover:bg-black hover:text-white transition-all opacity-0 group-hover/section:opacity-100"
          style={{ left: `calc(${COVER_W} + 16px)` }}
          aria-label="Previous"
        >
          <ChevronLeft strokeWidth={1} size={16} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-3 z-20 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow border border-gray-200 text-black hover:bg-black hover:text-white transition-all opacity-0 group-hover/section:opacity-100"
          aria-label="Next"
        >
          <ChevronRight strokeWidth={1} size={16} />
        </button>

      </div>
    </section>
  );
};

export default NewInSection;
