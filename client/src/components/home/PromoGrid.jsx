import React from 'react';
import { Link } from 'react-router-dom';

const PromoGrid = ({ data = [] }) => {
  if (!data || data.length < 3) return null;

  const [leftPromo, topRightPromo, bottomRightPromo] = data;

  return (
    <div className="mf-container-bleed">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
        
        {/* Left Large Promo */}
        <div className="relative group overflow-hidden block h-[50vh] md:h-[70vh]">
          <Link 
            to={leftPromo.link}
            className="w-full h-full block"
          >
            <img 
              src={leftPromo.image} 
              alt={leftPromo.title}
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
              className="relative group overflow-hidden block w-full h-full"
            >
              <img 
                src={topRightPromo.image} 
                alt={topRightPromo.title}
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
              className="relative group overflow-hidden block w-full h-full"
            >
              <img 
                src={bottomRightPromo.image} 
                alt={bottomRightPromo.title}
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
