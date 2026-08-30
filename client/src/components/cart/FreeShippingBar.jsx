import React from 'react';
import { motion } from 'framer-motion';

const FreeShippingBar = ({ total }) => {
  const threshold = 5000;
  const progress = Math.min((total / threshold) * 100, 100);
  const remaining = threshold - total;
  const isFreeShipping = total >= threshold;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <p className="text-xs font-sans text-[var(--color-text)]">
          {isFreeShipping ? (
            <span className="font-medium text-[var(--color-accent)]">🎉 You've unlocked Free Shipping!</span>
          ) : (
            <>Add <span className="font-medium text-[var(--color-accent)]">Rs. {remaining.toLocaleString()}</span> more to claim Free Nationwide Delivery</>
          )}
        </p>
      </div>
      
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${isFreeShipping ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-primary)]'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default FreeShippingBar;
