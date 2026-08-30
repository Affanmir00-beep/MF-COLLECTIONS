import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Phone, Mail, MapPin } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import apiClient from '../../api/apiClient';

const NavDrawer = ({ isOpen, onClose }) => {
  const userInfo = useAuthStore(state => state.userInfo);
  const [expanded, setExpanded] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiClient.get('/categories')
      .then(res => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const toggleExpand = (category) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const navLinks = [
    { label: 'NEW ARRIVALS', to: '/collections/new-arrivals' },
    { 
      label: 'CATEGORIES', 
      subLinks: [
        { label: 'All Products (Shop All)', to: '/collections/all' },
        ...categories.map(c => ({
          label: c.name,
          to: `/collections/${c.slug}`
        }))
      ]
    },
    { label: 'LUXURY PRÊT', to: '/collections/luxury-pret' },
    { 
      label: 'COLLECTIONS', 
      subLinks: [
        { label: 'Festive Edit', to: '/collections/festive-edit' },
        { label: 'Wedding Edit', to: '/collections/wedding-edit' },
        { label: 'Kaftans', to: '/collections/kaftans' },
        { label: 'Farshi Shalwar', to: '/collections/farshi-shalwar' },
        { label: 'Pishwas', to: '/collections/pishwas' },
      ]
    },
    { label: 'SHOP ALL', to: '/collections/all' },
    { label: 'SALE', to: '/collections/sale', color: 'text-red-600 font-bold' },
    { label: 'CUSTOM ORDERS', to: '/custom-orders' },
    { 
      label: 'HELP', 
      subLinks: [
        { label: 'Size Guide', to: '/size-guide' },
        { label: 'FAQs', to: '/faqs' },
        { label: 'Shipping & Delivery', to: '/shipping' },
        { label: 'Exchange & Return', to: '/exchange' },
        { label: 'Contact Us', to: '/contact' },
      ]
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[85%] sm:w-[400px] bg-white z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <span className="font-serif text-[1.25rem] tracking-[0.15em] uppercase font-medium">MF DESIGNS</span>
          <button onClick={onClose} className="p-2 hover:opacity-50 text-black">
            <X strokeWidth={1} size={24} />
          </button>
        </div>

        <div className="py-6 px-6 overflow-y-auto h-[calc(100vh-70px)] text-black">
          <ul className="space-y-5">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                {link.subLinks ? (
                  <div>
                    <button 
                      onClick={() => toggleExpand(link.label)}
                      className={`w-full flex justify-between items-center font-sans text-[0.8125rem] font-medium tracking-[0.1em] uppercase ${link.color || ''}`}
                    >
                      {link.label}
                      <span className="text-lg transition-transform duration-300">
                        {expanded[link.label] ? <Minus strokeWidth={1} size={18} /> : <Plus strokeWidth={1} size={18} />}
                      </span>
                    </button>
                    {expanded[link.label] && (
                      <ul className="pl-4 mt-3 space-y-3">
                        {link.subLinks.map((sub, sIdx) => (
                          <li key={sIdx}>
                            <Link 
                              to={sub.to} 
                              onClick={onClose}
                              className="block font-sans text-[0.8125rem] text-gray-500 hover:text-black transition-colors"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link 
                    to={link.to} 
                    onClick={onClose}
                    className={`block font-sans text-[0.8125rem] font-medium tracking-[0.1em] uppercase hover:opacity-70 transition-opacity ${link.color || ''}`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}

            {/* My Account */}
            <li>
              <button 
                onClick={() => toggleExpand('My account')}
                className="w-full flex justify-between items-center font-sans text-[0.8125rem] font-medium tracking-[0.1em] uppercase"
              >
                My account
                <span className="text-lg transition-transform duration-300">
                  {expanded['My account'] ? <Minus strokeWidth={1} size={18} /> : <Plus strokeWidth={1} size={18} />}
                </span>
              </button>
              {expanded['My account'] && (
                <ul className="pl-4 mt-3 space-y-3">
                  <li>
                    <Link to={userInfo ? "/profile" : "/login"} onClick={onClose} className="block font-sans text-[0.8125rem] text-gray-500 hover:text-black">
                      {userInfo ? "Profile" : "Log In / Sign Up"}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="font-serif text-[1.5rem] mb-6 tracking-wide">Talk to MF Designs!</h3>
            <ul className="space-y-4 font-sans text-[0.8125rem] text-gray-500">
              <li>
                <a href="https://wa.me/923117121215" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-black transition-colors">
                  <Phone strokeWidth={1} size={20} />
                  03117121215
                </a>
              </li>
              <li>
                <a href="mailto:mfdesignsofficialpk@gmail.com" className="flex items-center gap-3 hover:text-black transition-colors">
                  <Mail strokeWidth={1} size={20} />
                  mfdesignsofficialpk@gmail.com
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3">
                  <MapPin strokeWidth={1} size={20} />
                  Multan, Pakistan
                </span>
              </li>
            </ul>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/mfdesigns_official" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-6 inline-flex items-center gap-2 border border-black px-5 py-2.5 uppercase tracking-widest text-[10px] font-bold hover:bg-black hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              @mfdesigns_official
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavDrawer;
