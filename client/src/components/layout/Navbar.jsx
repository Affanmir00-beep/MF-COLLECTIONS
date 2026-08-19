import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = ({ onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, openCart } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'bg-[var(--color-surface)] shadow-sm py-3' : 'bg-transparent py-5 absolute top-8'
      }`}
    >
      {/* Absolute positioning when not scrolled gives that transparent over-video look if needed, but we'll stick to a solid or semi-transparent bg depending on layout */}
      <div className={`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center ${!isScrolled ? 'text-[var(--color-primary)]' : 'text-[var(--color-primary)]'}`}>
        
        {/* Hamburger Menu & Search (Left) */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            className="p-2 -ml-2 hover:opacity-70 transition-opacity flex items-center gap-2"
            onClick={onOpenMobileMenu}
          >
            <Menu size={24} strokeWidth={1} />
          </button>
          <button className="hidden md:flex p-2 hover:opacity-70 transition-opacity">
            <Search size={20} strokeWidth={1} />
          </button>
        </div>

        {/* Logo (Center) */}
        <div className="flex-1 flex justify-center text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase">VANYA</h1>
          </Link>
        </div>

        {/* Icons (Right) */}
        <div className="flex items-center justify-end gap-3 md:gap-5 flex-1">
          <button className="hidden md:flex p-2 hover:opacity-70 transition-opacity">
            <User size={20} strokeWidth={1} />
          </button>
          
          <Link to="/wishlist" className="hidden md:flex p-2 hover:opacity-70 transition-opacity relative">
            <Heart size={20} strokeWidth={1} />
            {wishlistItems.length > 0 && (
              <span className="absolute top-1 right-0 bg-black text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-sans">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          
          <button 
            onClick={openCart}
            className="p-2 hover:opacity-70 transition-opacity relative"
          >
            <ShoppingBag size={20} strokeWidth={1} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0 bg-black text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-sans">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
