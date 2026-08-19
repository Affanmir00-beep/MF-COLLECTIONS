import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-primary)] text-white pt-16 pb-8 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Brand Story */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-2xl tracking-widest mb-6 text-[var(--color-base)]">VANYA</h2>
            <p className="text-gray-400 text-sm leading-relaxed font-sans mb-6">
              Redefining Pakistani luxury prêt. Our collections blend timeless elegance with contemporary silhouettes, crafted for the modern woman who appreciates fine details.
            </p>
            <div className="flex gap-4 font-sans text-xs tracking-widest">
              <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">INSTAGRAM</a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">FACEBOOK</a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors">YOUTUBE</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-sans uppercase tracking-widest text-sm mb-6 text-[var(--color-base)] font-medium">Quick Links</h3>
            <ul className="space-y-4 text-sm font-sans text-gray-400">
              <li><Link to="/collection" className="hover:text-white transition-colors">All Collections</Link></li>
              <li><Link to="/collection?filter=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/collection?filter=sale" className="hover:text-[var(--color-sale)] transition-colors">Sale</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-sans uppercase tracking-widest text-sm mb-6 text-[var(--color-base)] font-medium">Customer Care</h3>
            <ul className="space-y-4 text-sm font-sans text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Exchange Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-sans uppercase tracking-widest text-sm mb-6 text-[var(--color-base)] font-medium">The Vanya Edit</h3>
            <p className="text-gray-400 text-sm mb-4 font-sans">
              Subscribe to receive updates on new arrivals, exclusive offers, and editorial features.
            </p>
            <form className="flex border-b border-gray-600 pb-2 relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent border-none outline-none text-sm font-sans flex-1 text-white placeholder-gray-500 tracking-wider"
                required
              />
              <button type="submit" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-gray-500 tracking-wider">
          <p>&copy; {new Date().getFullYear()} VANYA.PK. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <Link to="#" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
