import React from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';

const NavDrawer = ({ isOpen, onClose }) => {
  const categories = ['New In', 'Unstitched', 'Pret', 'Formals', 'Sale'];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-full sm:w-[400px] bg-white z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <button onClick={onClose} className="p-2 hover:opacity-50">
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <div className="py-6 px-6 overflow-y-auto h-[calc(100vh-70px)]">
          <ul className="space-y-6">
            {categories.map((cat, idx) => (
              <li key={idx}>
                <Link 
                  to={`/collection?category=${cat}`} 
                  onClick={onClose}
                  className="flex justify-between items-center group font-sans text-sm tracking-[0.2em] uppercase"
                >
                  <span className="group-hover:text-gray-500 transition-colors">{cat}</span>
                  <ChevronRight size={16} strokeWidth={1} className="text-gray-300 group-hover:text-gray-500" />
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
            <ul className="space-y-4 font-sans text-xs tracking-widest text-gray-500 uppercase">
              <li><Link to="/about" onClick={onClose} className="hover:text-black">About Us</Link></li>
              <li><Link to="/contact" onClick={onClose} className="hover:text-black">Contact</Link></li>
              <li><Link to="/shipping" onClick={onClose} className="hover:text-black">Shipping & Returns</Link></li>
              <li><Link to="/faq" onClick={onClose} className="hover:text-black">FAQ</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavDrawer;
