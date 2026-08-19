import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  return (
    <div className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-10 bg-black/20"></div> {/* Subtle overlay */}
      
      {/* Background Image / Video Placeholder */}
      <img 
        src="/images/banner2.jpg" 
        alt="Vanya Campaign" 
        className="w-full h-full object-cover object-center"
      />
      
      {/* Content overlay - styled exactly like Vanya */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24 md:pb-32 px-4 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="text-white font-serif text-5xl md:text-7xl lg:text-[80px] leading-none uppercase">
            Nouveau<br/>Romance
          </h2>
          <Link 
            to="/collection"
            className="bg-white text-black px-12 py-3.5 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSlider;
