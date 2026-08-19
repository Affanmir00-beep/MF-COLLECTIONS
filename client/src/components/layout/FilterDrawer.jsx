import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--color-border)]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 font-sans text-sm tracking-widest uppercase text-black hover:text-[var(--color-accent)] transition-colors"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 font-sans text-sm text-gray-600">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <div 
        className={`fixed top-0 left-0 h-full w-[85vw] sm:w-[400px] bg-white z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
          <h2 className="font-serif text-2xl tracking-widest text-black">FILTER</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-black hover:opacity-70 transition-opacity">
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          
          <FilterAccordion title="Availability" defaultOpen={true}>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 border border-black flex items-center justify-center group-hover:bg-gray-100 transition-colors"></div>
                <span>In stock (12)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group opacity-50">
                <div className="w-4 h-4 border border-black flex items-center justify-center"></div>
                <span>Out of stock (0)</span>
              </label>
            </div>
          </FilterAccordion>

          <FilterAccordion title="Price">
            <div className="pt-2">
              <div className="flex justify-between text-xs mb-2 text-gray-400">
                <span>Rs. 0</span>
                <span>Rs. 25,000</span>
              </div>
              <input type="range" className="w-full accent-black" min="0" max="25000" />
            </div>
          </FilterAccordion>

          <FilterAccordion title="Product Type">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 border border-black flex items-center justify-center group-hover:bg-gray-100 transition-colors"></div>
                <span>Unstitched</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 border border-black flex items-center justify-center group-hover:bg-gray-100 transition-colors"></div>
                <span>Pret</span>
              </label>
            </div>
          </FilterAccordion>

          <FilterAccordion title="Size">
            <div className="grid grid-cols-4 gap-2 mt-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button key={size} className="border border-[var(--color-border)] py-2 text-center text-xs hover:border-black transition-colors">
                  {size}
                </button>
              ))}
            </div>
          </FilterAccordion>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)] bg-white">
          <button 
            onClick={onClose}
            className="w-full bg-black text-white py-4 font-sans text-sm tracking-widest uppercase hover:bg-black/80 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
