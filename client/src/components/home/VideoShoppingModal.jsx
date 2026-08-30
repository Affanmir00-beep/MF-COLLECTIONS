import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Volume2, VolumeX, Heart, Share2, ShoppingBag, ExternalLink } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useUIStore from '../../store/uiStore';
import { mockApi } from '../../data/mockApi';

const VideoShoppingModal = ({ video, isOpen, onClose, onBuyNow }) => {
  const addItem = useCartStore(state => state.addItem);
  const openCart = useUIStore(state => state.openCart);

  const [isMuted, setIsMuted] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [productDetails, setProductDetails] = useState(null);
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (video?.productSku) {
      mockApi.getProduct(video.productSku)
        .then(p => setProductDetails(p))
        .catch(() => {
          // Fallback demo product if SKU lookup fails
          setProductDetails({
            id: 'demo-1',
            title: video.productSku || 'CO-102',
            price: video.productPrice || 14500,
            images: [video.coverImage],
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            availableSizes: ['XS', 'S', 'M', 'L', 'XL']
          });
        });
    }
  }, [video]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !video) return null;

  // Extract Instagram Reel embed code if URL is provided
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('instagram.com/reel/') || url.includes('instagram.com/p/')) {
      const parts = url.split('/reel/')[1] || url.split('/p/')[1];
      if (parts) {
        const code = parts.split('/')[0].split('?')[0];
        return `https://www.instagram.com/reel/${code}/embed/captioned/`;
      }
    }
    return null;
  };

  const embedUrl = getEmbedUrl(video.videoUrl);

  const handleAddToCart = () => {
    if (!productDetails) return;
    addItem({
      _id: productDetails.id || productDetails._id,
      title: productDetails.title,
      price: productDetails.price,
      images: productDetails.images
    }, selectedSize);
    openCart();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (onBuyNow) onBuyNow();
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: productDetails?.title || 'MF Designs', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-fade-in font-sans"
      onClick={onClose}
    >
      
      {/* Container Frame - 9:16 Aspect Ratio Reels Container */}
      <div 
        className="relative w-full max-w-[420px] h-[92vh] max-h-[840px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Overlay Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-center bg-gradient-to-b from-black/70 via-black/30 to-transparent">
          <span className="font-serif text-white text-base tracking-[0.2em] font-medium uppercase drop-shadow">
            MF DESIGNS
          </span>
          <div className="flex items-center gap-3">
            {/* Mute/Unmute Toggle */}
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
              aria-label="Toggle Mute"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            {/* Close Modal X Button */}
            <button 
              onClick={onClose} 
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video / Player Area */}
        <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
          {embedUrl ? (
            <iframe 
              src={`${embedUrl}?autoplay=1&muted=${isMuted ? 1 : 0}`} 
              className="w-full h-full border-0 pointer-events-auto"
              title="Instagram Reel Video"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : video.videoUrl ? (
            <video 
              src={video.videoUrl} 
              autoPlay 
              loop 
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
              poster={video.coverImage}
            />
          ) : (
            <div className="relative w-full h-full">
              <img 
                src={video.coverImage} 
                alt="Reel Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>
          )}
        </div>

        {/* Floating Right-Side Action Controls */}
        <div className="absolute right-3 bottom-36 z-30 flex flex-col items-center gap-4 text-white">
          {/* WhatsApp Action */}
          <a 
            href="https://wa.me/923117121215" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-[#25D366] rounded-full shadow-lg hover:scale-110 transition-transform"
            title="Chat on WhatsApp"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" />
          </a>

          {/* Like Heart */}
          <button 
            onClick={() => setLiked(!liked)} 
            className={`p-3 rounded-full backdrop-blur-md transition-transform active:scale-125 ${liked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} />
          </button>

          {/* Share Button */}
          <button 
            onClick={handleShare} 
            className="p-3 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Bottom Product Overlay Card (Matching Screenshot 2) */}
        <div className="absolute bottom-3 left-3 right-3 z-30">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 transition-all duration-300">
            
            {/* Header: Thumbnail + Title + Price */}
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={
                  typeof productDetails?.images?.[0] === 'object'
                    ? productDetails.images[0].url
                    : productDetails?.images?.[0] || video.coverImage
                } 
                alt="Product Preview" 
                className="w-14 h-16 object-cover rounded-md border border-gray-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-black truncate">
                    {productDetails?.title || video.productSku || 'Exclusive Outfit'}
                  </h4>
                  <a 
                    href={`/collections/all/products/${productDetails?.sku || productDetails?.id || ''}`} 
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <p className="font-sans text-sm font-semibold text-black mt-0.5">
                  Rs. {(productDetails?.price || video.productPrice || 14500).toLocaleString()}
                </p>
                <button 
                  onClick={() => setIsProductExpanded(!isProductExpanded)}
                  className="text-[10px] text-gray-500 uppercase tracking-widest underline hover:text-black mt-0.5"
                >
                  {isProductExpanded ? 'Hide Options' : 'Select Size'}
                </button>
              </div>
            </div>

            {/* Size Options (Expandable / Visible) */}
            <div className={`transition-all duration-300 overflow-hidden ${isProductExpanded ? 'max-h-20 mb-3 opacity-100' : 'max-h-0 opacity-0'}`}>
              <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-medium">Size</span>
              <div className="flex gap-1.5">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-8 h-8 rounded-full font-sans text-xs font-bold transition-all ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleAddToCart}
                className="bg-[#111111] text-white py-3 rounded-lg text-[10px] uppercase font-bold tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>

              <button 
                onClick={handleBuyNow}
                className="bg-white text-black border border-black py-3 rounded-lg text-[10px] uppercase font-bold tracking-widest hover:bg-gray-50 transition-colors shadow-sm"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>,
    document.body
  );
};

export default VideoShoppingModal;
