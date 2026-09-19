import React from 'react';
import { Link } from 'react-router-dom';
import { optimizeImageUrl, generateSrcSet } from '../../utils/imageOptimizer';

const PromoGrid = ({ data = [] }) => {
  if (!data || data.length < 3) return null;

  const [leftPromo, topRightPromo, bottomRightPromo] = data;

  return (
    <div className="mf-container-bleed">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
        
        {/* Left Large Promo */}
        <div className="relative group overflow-hidden block h-[50vh] md:h-[70vh] bg-gray-100">
          <Link 
            to={leftPromo.link}
            className="w-full h-full block"
          >
            <img 
              src={optimizeImageUrl(leftPromo.image, { width: 1000, quality: 'auto:good' })} 
              srcSet={generateSrcSet(leftPromo.image)}
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={leftPromo.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 mf-gradient-bottom"></div>
            
            <div className="absolute bottom-10 left-10">
              <h3 className="mf-label text-white mb-3 opacity-90">{leftPromo.subtitle}</h3>
              <h2 className="mf-heading text-white mb-6">{leftPromo.title}</h2>
              <span className="mf-link-underline text-white">{leftPromo.linkText}</span>
            </div>
          </Link>
        </div>

        {/* Right Stacked Promos */}
        <div className="grid grid-rows-2 gap-[2px] h-[50vh] md:h-[70vh]">
          <Link 
              to={topRightPromo.link}
              className="relative group overflow-hidden block w-full h-full bg-gray-100"
            >
              <img 
                src={optimizeImageUrl(topRightPromo.image, { width: 800, quality: 'auto:good' })} 
                srcSet={generateSrcSet(topRightPromo.image)}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={topRightPromo.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 mf-overlay-dark"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <h2 className="mf-subheading text-white mb-5">{topRightPromo.title}</h2>
                <span className="mf-btn-primary bg-white text-[#111111] hover:bg-black hover:text-white border-none">{topRightPromo.linkText}</span>
              </div>
          </Link>

          <Link 
              to={bottomRightPromo.link}
              className="relative group overflow-hidden block w-full h-full bg-gray-100"
            >
              <img 
                src={optimizeImageUrl(bottomRightPromo.image, { width: 800, quality: 'auto:good' })} 
                srcSet={generateSrcSet(bottomRightPromo.image)}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={bottomRightPromo.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 mf-overlay-dark"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="mf-subheading text-white">
                  {bottomRightPromo.title}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default PromoGrid;
