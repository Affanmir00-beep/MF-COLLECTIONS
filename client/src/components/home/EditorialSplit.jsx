import React from 'react';
import { Link } from 'react-router-dom';

const EditorialSplit = () => {
  return (
    <section className="py-20 bg-[var(--color-base)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch gap-0 md:h-[600px] border border-[var(--color-border)]">
          
          {/* Image Side */}
          <div className="w-full md:w-1/2 h-[400px] md:h-full relative overflow-hidden">
            <img 
              src="/images/banner1.jpg" 
              alt="Brand Philosophy" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center text-center p-12 lg:p-20">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">Our Philosophy</span>
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--color-text)] mb-8 leading-tight">
              Elegance in Every Thread
            </h2>
            <p className="font-sans text-gray-500 leading-relaxed mb-10 max-w-md">
              At MF Designs, we believe in the timeless beauty of Pakistani craftsmanship. Our designs bring together contemporary silhouettes, beautiful fabrics and traditional handcrafted details to create pieces that feel both sophisticated and distinctive.
            </p>
            <Link 
              to="/about"
              className="font-sans text-sm uppercase tracking-widest text-[var(--color-text)] pb-2 border-b border-[var(--color-primary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
            >
              Discover Our Story
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EditorialSplit;
