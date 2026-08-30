import React from 'react';
import { Link } from 'react-router-dom';

const CoOrdsPromo = ({ data }) => {
  return (
    <section className="pt-8 md:pt-10 pb-0 bg-white">
      <div className="w-full">
        <Link to={data?.link || "/collections/co-ords"} className="relative block w-full h-[60vh] md:h-[70vh] group overflow-hidden">
          <img 
            src={data?.image || "/images/prod1.jpg"} 
            alt={data?.title || "Co-Ords"} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          
          {/* Circular Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[320px] md:h-[320px] bg-[#EAE3CB]/95 rounded-full flex flex-col items-center justify-center text-center shadow-lg transform group-hover:scale-105 transition-transform duration-500">
            <h3 className="font-serif text-[2.5rem] md:text-[3rem] text-black uppercase tracking-[0.15em] mb-4 drop-shadow-sm leading-none">{data?.title || "CO-ORDS"}</h3>
            <p className="mf-label text-black drop-shadow-sm opacity-80">{data?.subtitle || "PERFECTLY PUT TOGETHER"}</p>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default CoOrdsPromo;
