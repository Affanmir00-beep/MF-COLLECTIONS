import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Details, 2: Success
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    address: '',
    city: 'Lahore',
  });

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Multan', 'Faisalabad', 'Peshawar', 'Quetta', 'Rawalpindi'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate mock order ID
    const generatedId = `#VN-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedId);
    setStep(2);
    clearCart();
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ fullName: '', whatsapp: '', address: '', city: 'Lahore' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-surface)] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto flex flex-col md:flex-row"
            >
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-[var(--color-primary)] z-10 bg-white md:bg-transparent rounded-full p-1"
              >
                <X size={24} />
              </button>

              {step === 1 ? (
                <>
                  {/* Left Form Side */}
                  <div className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r border-[var(--color-border)]">
                    <h2 className="font-serif text-2xl text-[var(--color-primary)] mb-6">Checkout</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-sans text-sm tracking-widest uppercase text-gray-500 mb-2">Contact Information</h3>
                        <div>
                          <input 
                            type="text" 
                            required
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full border border-[var(--color-border)] p-3 font-sans text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                          />
                        </div>
                        <div>
                          <input 
                            type="text" 
                            required
                            placeholder="WhatsApp Number (e.g. 03XX-XXXXXXX)"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                            className="w-full border border-[var(--color-border)] p-3 font-sans text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-sans text-sm tracking-widest uppercase text-gray-500 mb-2 mt-8">Shipping Address</h3>
                        <div>
                          <input 
                            type="text" 
                            required
                            placeholder="Complete Address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full border border-[var(--color-border)] p-3 font-sans text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                          />
                        </div>
                        <div>
                          <select 
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full border border-[var(--color-border)] p-3 font-sans text-sm outline-none focus:border-[var(--color-primary)] transition-colors bg-white cursor-pointer"
                          >
                            {cities.map(city => <option key={city} value={city}>{city}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-sans text-sm tracking-widest uppercase text-gray-500 mb-2 mt-8">Payment Method</h3>
                        <div className="border border-[var(--color-primary)] p-4 flex items-center justify-between bg-[var(--color-base)]">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full border-[5px] border-[var(--color-primary)]"></div>
                            <span className="font-sans text-sm font-medium">Cash on Delivery (COD)</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={cartItems.length === 0}
                        className="w-full bg-[var(--color-primary)] text-white py-4 font-sans text-sm uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Complete Order
                      </button>
                    </form>
                  </div>

                  {/* Right Summary Side */}
                  <div className="md:w-80 p-6 md:p-10 bg-[var(--color-base)]">
                    <h3 className="font-sans text-sm tracking-widest uppercase text-gray-500 mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <div className="w-16 h-20 bg-gray-100 flex-shrink-0 relative">
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                            <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-sans">{item.quantity}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-sans text-xs font-medium text-[var(--color-primary)] line-clamp-1">{item.title}</p>
                            <p className="text-[10px] text-gray-500 mt-1 font-sans">Size: {item.size}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-sans text-xs font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[var(--color-border)] pt-4 space-y-3 font-sans text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>Rs. {cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span>{cartTotal >= 5000 ? 'Free' : 'Rs. 250'}</span>
                      </div>
                      <div className="flex justify-between font-medium text-[var(--color-primary)] pt-3 border-t border-[var(--color-border)] text-base">
                        <span>Total</span>
                        <span>Rs. {(cartTotal + (cartTotal >= 5000 ? 0 : 250)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full p-10 flex flex-col items-center justify-center text-center py-20">
                  <CheckCircle size={64} className="text-[var(--color-accent)] mb-6" strokeWidth={1} />
                  <h2 className="font-serif text-3xl text-[var(--color-primary)] mb-2">Order Confirmed</h2>
                  <p className="font-sans text-gray-500 mb-8">Thank you for shopping with Vanya.</p>
                  
                  <div className="bg-[var(--color-base)] p-6 w-full max-w-sm mb-8 border border-[var(--color-border)]">
                    <p className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-1">Order Number</p>
                    <p className="font-sans font-medium text-lg">{orderId}</p>
                    <div className="h-px bg-[var(--color-border)] w-full my-4"></div>
                    <p className="font-sans text-xs text-gray-500 leading-relaxed">
                      We have received your order and will contact you shortly on your WhatsApp number to confirm delivery details.
                    </p>
                  </div>

                  <button 
                    onClick={handleClose}
                    className="bg-[var(--color-primary)] text-white px-8 py-4 font-sans text-sm uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
