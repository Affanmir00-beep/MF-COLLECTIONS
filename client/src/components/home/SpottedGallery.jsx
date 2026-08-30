import React from 'react';
import { Heart } from 'lucide-react';

const SpottedGallery = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="pt-8 pb-0 bg-white w-full overflow-hidden">

      {/* Tagline heading */}
      <div className="flex flex-col items-center justify-center mb-6 text-center px-4">
        <p className="font-serif italic text-[1.1rem] md:text-[1.4rem] text-black/70 tracking-wide leading-snug">
          Be Exclusive. Be Divine. Be Yourself.
        </p>
      </div>

      {/* Full-width image grid — no side padding, no gap-card variable, use gap-[2px] */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[2px] w-full">
        {data.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-[3/4] overflow-hidden group block"
          >
            <img
              src={item.image}
              alt="Gallery"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Heart strokeWidth={1.5} size={28} color="white" />
            </div>
          </a>
        ))}
      </div>

    </section>
  );
};

export default SpottedGallery;
