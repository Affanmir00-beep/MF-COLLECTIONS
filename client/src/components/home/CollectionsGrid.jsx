import React from 'react';
import { Link } from 'react-router-dom';

const CollectionsGrid = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="mf-container-bleed pt-2 md:pt-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
        {data.map((col, idx) => (
          <Link
            key={idx}
            to={col.link}
            className="relative group overflow-hidden block aspect-[4/5]"
          >
            <img
              src={col.image}
              alt={col.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark overlay for text legibility */}
            <div className="absolute inset-0 mf-overlay-dark"></div>

            <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
              <span className="font-sans text-[0.8125rem] md:text-sm font-semibold tracking-[0.15em] uppercase text-white">
                {col.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionsGrid;
