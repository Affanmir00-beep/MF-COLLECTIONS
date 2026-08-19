import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const reels = [
  { id: 1, image: '/images/hero.jpg', title: 'Summer Lawn' },
  { id: 2, image: '/images/prod1.jpg', title: 'Silk Festive' },
  { id: 3, image: '/images/prod2.jpg', title: 'Co-Ords' },
  { id: 4, image: '/images/prod5.jpg', title: 'Velvet' },
];

const WatchAndBuy = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl tracking-widest text-black mb-8 text-center uppercase">Watch & Buy</h2>
        
        {/* Horizontal Scroll Container */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {reels.map(reel => (
            <Link 
              key={reel.id} 
              to="/collection"
              className="relative w-64 md:w-72 aspect-[9/16] flex-shrink-0 snap-center group cursor-pointer"
            >
              <img 
                src={reel.image} 
                alt={reel.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <Play size={20} fill="white" className="text-white ml-1" />
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className="font-sans text-sm tracking-widest uppercase font-medium">{reel.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WatchAndBuy;
