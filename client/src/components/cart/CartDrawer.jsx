import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useUIStore from '../../store/uiStore';
import FreeShippingBar from './FreeShippingBar';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = ({ onCheckoutClick }) => {
  const isCartOpen = useUIStore(state => state.isCartOpen);
  const closeCart = useUIStore(state => state.closeCart);
  
  const cartItems = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getCartTotal = useCartStore(state => state.getCartTotal);
  
  const cartTotal = getCartTotal();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    closeCart();
    if (onCheckoutClick) {
      onCheckoutClick();
    } else {
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
            className="fixed top-0 right-0 h-full w-[90vw] max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#EAEAEA]">
              <div className="flex items-center gap-2 text-[#111111]">
                <ShoppingBag size={20} />
                <span className="font-sans font-medium uppercase tracking-widest text-sm">Your Bag ({cartItems.length})</span>
              </div>
              <button onClick={closeCart} className="p-2 text-gray-400 hover:text-[#111111] transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Shipping Bar */}
            <div className="p-4 md:p-6 border-b border-[#EAEAEA] bg-[#FAFAFA]">
              <FreeShippingBar total={cartTotal} />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} className="opacity-20" />
                  <p className="font-sans uppercase tracking-widest text-sm">Your bag is empty</p>
                  <button 
                    onClick={closeCart}
                    className="border border-black px-8 py-3 font-sans uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors mt-4"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.product._id}-${item.size}`} className="flex gap-4">
                    <Link to={`/product/${item.product._id}`} onClick={closeCart}>
                      <img 
                        src={item.product.images[0]?.url || item.product.images[0]} 
                        alt={item.product.title} 
                        className="w-24 h-32 object-cover bg-gray-100"
                      />
                    </Link>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-sans mb-1">MF DESIGNS</p>
                          <Link to={`/product/${item.product._id}`} onClick={closeCart}>
                            <h4 className="font-serif text-sm uppercase">{item.product.title}</h4>
                          </Link>
                          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Size: {item.size}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.product._id, item.size)}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <X size={16} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-gray-200">
                          <button 
                            className="p-2 hover:bg-gray-50 transition-colors"
                            onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center font-sans text-sm">{item.quantity}</span>
                          <button 
                            className="p-2 hover:bg-gray-50 transition-colors"
                            onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                          >
                            <Plus size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                        <span className="font-sans text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-[#EAEAEA] p-4 md:p-6 bg-[#FAFAFA]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans uppercase tracking-widest text-sm text-gray-500">Subtotal</span>
                  <span className="font-sans text-lg">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4 text-center font-sans">Shipping & taxes calculated at checkout</p>
                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#111111] text-white py-4 font-sans uppercase tracking-widest text-sm hover:bg-black/80 transition-colors"
                >
                  Checkout
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
