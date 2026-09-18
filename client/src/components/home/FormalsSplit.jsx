import React from 'react';
import { Link } from 'react-router-dom';
import { optimizeImageUrl } from '../../utils/imageOptimizer';

const FormalsSplit = ({ data }) => {
  if (!data) return null;

  return (
    <section className="pt-8 md:pt-12 pb-8 md:pb-10 bg-white">
      <div className="w-full border-t border-[#EAEAEA]">
        <div className="flex flex-col md:flex-row min-h-[50vh] md:min-h-[60vh]">
          {/* Left Text Block */}
          <div className="w-full md:w-1/2 bg-[var(--color-background-alt)] flex flex-col justify-center items-center text-center p-12 lg:p-20 order-2 md:order-1">
            <h2 className="mf-heading mb-6">
              {data.title}
            </h2>
            <p className="mf-body mb-10 max-w-md whitespace-pre-wrap">
              {data.description}
            </p>
            <Link 
              to={data.link}
              className="mf-btn-primary"
            >
              {data.buttonText}
            </Link>
          </div>
          
          {/* Right Image Block */}
          <div className="w-full md:w-1/2 relative h-[50vh] md:h-auto order-1 md:order-2 overflow-hidden group bg-gray-100">
            <img 
              src={optimizeImageUrl(data.image, { width: 1000, quality: 'auto:good' })} 
              alt={data.title} 
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormalsSplit;
