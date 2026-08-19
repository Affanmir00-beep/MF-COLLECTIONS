import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import FreeShippingBar from './FreeShippingBar';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = ({ onCheckoutClick }) => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    closeCart();
    if (onCheckoutClick) {
      onCheckoutClick();
    } else {
      // Fallback
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-[90vw] max-w-md bg-[var(--color-surface)] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2 text-[var(--color-primary)]">
                <ShoppingBag size={20} />
                <span className="font-sans font-medium uppercase tracking-widest text-sm">Your Bag ({cartItems.length})</span>
              </div>
              <button onClick={closeCart} className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Shipping Bar */}
            <div className="p-4 md:p-6 border-b border-[var(--color-border)] bg-[var(--color-base)]">
              <FreeShippingBar total={cartTotal} />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-sans text-sm tracking-wider uppercase">Your bag is currently empty.</p>
                  <button 
                    onClick={closeCart}
                    className="mt-4 px-8 py-3 bg-[var(--color-primary)] text-white font-sans text-sm uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-[var(--color-border)] pb-6 last:border-0 last:pb-0">
                    <div className="w-24 h-32 flex-shrink-0 bg-gray-100 relative">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/product/${item.id}`} onClick={closeCart} className="font-sans text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
                            {item.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1 font-sans">Size: {item.size}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="mt-auto flex justify-between items-end">
                        <div className="flex items-center border border-[var(--color-border)]">
                          <button 
                            className="p-2 text-gray-500 hover:text-[var(--color-primary)]"
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-sans">{item.quantity}</span>
                          <button 
                            className="p-2 text-gray-500 hover:text-[var(--color-primary)]"
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          {item.discount ? (
                            <>
                              <p className="text-xs text-gray-400 line-through font-sans">Rs. {item.originalPrice.toLocaleString()}</p>
                              <p className="text-sm font-medium text-[var(--color-sale)] font-sans">Rs. {item.price.toLocaleString()}</p>
                            </>
                          ) : (
                            <p className="text-sm font-medium text-[var(--color-primary)] font-sans">Rs. {item.price.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-4 md:p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-sm tracking-wider uppercase text-gray-500">Subtotal</span>
                  <span className="font-sans font-medium text-lg text-[var(--color-primary)]">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4 font-sans text-center">Taxes and shipping calculated at checkout</p>
                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[var(--color-primary)] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors flex justify-center items-center gap-2"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
