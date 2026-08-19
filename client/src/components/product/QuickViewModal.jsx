import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
    setError('');
    addToCart(product, selectedSize, 1);
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-surface)] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col md:flex-row relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-[var(--color-primary)] z-10 bg-white md:bg-transparent rounded-full p-1"
              >
                <X size={24} />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-[40vh] md:h-auto bg-gray-100">
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
              </div>

              {/* Details Side */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-sans mb-2">{product.category}</p>
                <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-primary)] mb-4">{product.title}</h2>
                
                <div className="flex items-center gap-3 font-sans mb-6">
                  {product.discount ? (
                    <>
                      <span className="text-gray-400 line-through text-sm">Rs. {product.originalPrice?.toLocaleString()}</span>
                      <span className="text-[var(--color-sale)] font-medium text-lg">Rs. {product.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-[var(--color-primary)] font-medium text-lg">Rs. {product.price.toLocaleString()}</span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-sans text-sm uppercase tracking-widest">Select Size</span>
                    <button className="text-xs text-gray-500 underline font-sans">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(size); setError(''); }}
                        className={`w-12 h-12 flex items-center justify-center border font-sans text-sm transition-colors ${
                          selectedSize === size 
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                            : 'border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {error && <p className="text-red-500 text-xs mt-2 font-sans">{error}</p>}
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-[var(--color-primary)] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors mt-auto"
                >
                  Add to Bag
                </button>
                
                <div className="mt-8 text-sm font-sans text-gray-600 leading-relaxed border-t border-[var(--color-border)] pt-6">
                  <p>{product.description}</p>
                  <ul className="mt-4 space-y-2 list-disc list-inside text-gray-500">
                    <li>Fabric: {product.fabric}</li>
                    <li>SKU: {product.sku}</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
