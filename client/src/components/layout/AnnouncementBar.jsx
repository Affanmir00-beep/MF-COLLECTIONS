import React from 'react';
import { motion } from 'framer-motion';

const AnnouncementBar = () => {
  return (
    <div className="bg-[var(--color-primary)] text-[var(--color-base)] text-xs md:text-sm py-2 overflow-hidden whitespace-nowrap relative flex items-center justify-center">
      <motion.div
        className="inline-block"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30
        }}
      >
        <span className="mx-4 uppercase tracking-wider font-sans">Nationwide Free Shipping Over Rs. 5,000</span>
        <span className="mx-4">|</span>
        <span className="mx-4 uppercase tracking-wider font-sans">Cash on Delivery (COD) Available Across Pakistan</span>
        <span className="mx-4">|</span>
        <span className="mx-4 uppercase tracking-wider font-sans">Nationwide Free Shipping Over Rs. 5,000</span>
        <span className="mx-4">|</span>
        <span className="mx-4 uppercase tracking-wider font-sans">Cash on Delivery (COD) Available Across Pakistan</span>
      </motion.div>
      
      {/* Absolute currency toggle - simplified for prototype */}
      <div className="absolute right-4 hidden md:flex items-center gap-2 text-xs font-sans">
        <span className="text-gray-300">PKR</span>
        <span className="text-gray-500 cursor-pointer hover:text-white transition-colors">USD</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
