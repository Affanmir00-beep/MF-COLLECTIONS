import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useUIStore from '../../store/uiStore';
import useAuthStore from '../../store/authStore';

const Navbar = ({ onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  const cartItems = useCartStore(state => state.items);
  const openCart = useUIStore(state => state.openCart);
  const userInfo = useAuthStore(state => state.userInfo);
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      setIsSearchOpen(false);
      navigate(`/collection?keyword=${encodeURIComponent(searchKeyword)}`);
      setSearchKeyword('');
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-[#111111] text-white border-b border-black/10 ${
        isScrolled ? 'shadow-md py-2 md:py-2.5' : 'py-3 md:py-3.5'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Hamburger Menu (Left) */}
        <div className="flex items-center flex-1">
          <button 
            className="p-1.5 -ml-1.5 hover:opacity-70 transition-opacity flex items-center"
            onClick={onOpenMobileMenu}
            aria-label="Open Navigation Menu"
          >
            <Menu strokeWidth={1.2} size={24} />
          </button>
        </div>

        {/* Logo (Center) */}
        <div className="flex-1 flex justify-center text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-[1.35rem] md:text-[1.7rem] tracking-[0.2em] uppercase leading-none font-medium">MF DESIGNS</h1>
          </Link>
        </div>

        {/* Icons (Right) */}
        <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hidden md:flex p-2 hover:opacity-70 transition-opacity"
          >
            {isSearchOpen ? <X strokeWidth={1} size={22} /> : <Search strokeWidth={1} size={22} />}
          </button>

          <Link to={userInfo ? "/profile" : "/login"} className="hidden md:flex p-2 hover:opacity-70 transition-opacity">
            <User strokeWidth={1} size={22} />
          </Link>
          
          <button 
            className="p-2 -mr-2 hover:opacity-70 transition-opacity relative flex items-center"
            onClick={openCart}
          >
            <ShoppingBag strokeWidth={1} size={22} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0 bg-white text-black text-[9px] font-bold w-[16px] h-[16px] flex items-center justify-center rounded-full font-sans leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md p-6 border-t border-[#EAEAEA] animate-fade-in text-black">
          <form onSubmit={handleSearchSubmit} className="max-w-[800px] mx-auto flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              autoFocus
              className="w-full border-b border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black font-sans bg-transparent"
            />
            <button type="submit" className="mf-btn-primary rounded-none py-2.5 px-6">
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
