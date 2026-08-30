import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, HeadphonesIcon, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full font-sans">
      {/* Tier 1: Feature Strip - 4 columns */}
      <div className="bg-[var(--color-background-alt)] py-10 border-b border-[#EAEAEA]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Truck strokeWidth={1} size={32} />
              <div>
                <h4 className="font-serif text-sm tracking-wide uppercase font-bold">Nationwide Shipping</h4>
                <p className="text-xs text-gray-500 mt-1">Leopard Courier & DHL</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3">
              <ShieldCheck strokeWidth={1} size={32} />
              <div>
                <h4 className="font-serif text-sm tracking-wide uppercase font-bold">Secure Payment</h4>
                <p className="text-xs text-gray-500 mt-1">Trusted payment partners</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3">
              <HeadphonesIcon strokeWidth={1} size={32} />
              <div>
                <h4 className="font-serif text-sm tracking-wide uppercase font-bold">Customer Care</h4>
                <p className="text-xs text-gray-500 mt-1">WhatsApp: 03117121215</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3">
              <Globe strokeWidth={1} size={32} />
              <div>
                <h4 className="font-serif text-sm tracking-wide uppercase font-bold">Worldwide Shipping</h4>
                <p className="text-xs text-gray-500 mt-1">International delivery available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Footer */}
      <div className="bg-[var(--color-background-alt)] text-[var(--color-text-main)] pt-16 pb-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            
            {/* Col 1: Brand Info */}
            <div>
              <h1 className="font-serif text-[34px] tracking-[0.15em] uppercase leading-none mb-4">MF DESIGNS</h1>
              <p className="text-xs text-gray-500 italic mb-6">Be Exclusive. Be Divine. Be Yourself.</p>
              <ul className="space-y-3 text-xs text-[var(--color-text-muted)]">
                <li className="flex gap-3 items-center">
                  📍 Multan, Pakistan
                </li>
                <li className="flex gap-3 items-center">
                  ✉️ mfdesignsofficialpk@gmail.com
                </li>
                <li className="flex gap-3 items-center">
                  📱 03117121215
                </li>
              </ul>
              <div className="flex gap-4 mt-6">
                <a href="https://www.instagram.com/mfdesigns_official" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://wa.me/923117121215" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </a>
              </div>
            </div>

            {/* Col 2: SHOP */}
            <div>
              <h3 className="font-sans text-sm font-semibold tracking-widest uppercase mb-6">Shop</h3>
              <ul className="space-y-3 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                <li><Link to="/collections/new-arrivals" className="hover:text-black transition-colors">New Arrivals</Link></li>
                <li><Link to="/collections/luxury-pret" className="hover:text-black transition-colors">Luxury Prêt</Link></li>
                <li><Link to="/collections/festive-edit" className="hover:text-black transition-colors">Festive Edit</Link></li>
                <li><Link to="/collections/wedding-edit" className="hover:text-black transition-colors">Wedding Edit</Link></li>
                <li><Link to="/collections/kaftans" className="hover:text-black transition-colors">Kaftans</Link></li>
                <li><Link to="/collections/sale" className="hover:text-black transition-colors">Sale</Link></li>
              </ul>
            </div>

            {/* Col 3: INFORMATION */}
            <div>
              <h3 className="font-sans text-sm font-semibold tracking-widest uppercase mb-6">Information</h3>
              <ul className="space-y-3 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
                <li><Link to="/size-guide" className="hover:text-black transition-colors">Size Guide</Link></li>
                <li><Link to="/faqs" className="hover:text-black transition-colors">FAQs</Link></li>
                <li><Link to="/shipping" className="hover:text-black transition-colors">Shipping & Delivery</Link></li>
                <li><Link to="/exchange" className="hover:text-black transition-colors">Exchange & Return Policy</Link></li>
                <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                <li><Link to="/custom-orders" className="hover:text-black transition-colors">Custom Orders</Link></li>
              </ul>
            </div>

            {/* Col 4: GET IN TOUCH */}
            <div>
              <h3 className="font-sans text-sm font-semibold tracking-widest uppercase mb-6">Get In Touch</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                Subscribe to our newsletter for exclusive offers and new collection launches!
              </p>
              <form className="flex border border-gray-300 rounded-full overflow-hidden p-1 bg-transparent mt-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-transparent border-none outline-none text-xs min-w-0 flex-1 text-black placeholder-gray-400 pl-3 pr-2 py-2"
                  required
                />
                <button type="submit" className="bg-black text-white px-5 py-2.5 rounded-full uppercase text-[10px] font-semibold tracking-widest hover:bg-gray-800 transition-colors shrink-0">
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Tier 3: Bottom Bar */}
      <div className="bg-[var(--color-background-alt)] text-black border-t border-gray-200 py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex gap-2 justify-center">
            {/* Payment icons */}
            <div className="w-10 h-6 flex items-center justify-center">
              <span className="text-[14px] font-bold text-[#1A1F71] italic">VISA</span>
            </div>
            <div className="w-10 h-6 flex items-center justify-center relative">
              <div className="w-4 h-4 bg-[#EB001B] rounded-full absolute left-1 opacity-80 mix-blend-multiply"></div>
              <div className="w-4 h-4 bg-[#F79E1B] rounded-full absolute right-1 opacity-80 mix-blend-multiply"></div>
            </div>
          </div>
          <p className="text-[10px] tracking-wider text-[var(--color-text-muted)] uppercase">
            Copyright &copy; {new Date().getFullYear()} MF Designs — Be Exclusive, Be Divine, Be Yourself
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
