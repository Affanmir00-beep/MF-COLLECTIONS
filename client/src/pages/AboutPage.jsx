import React, { useEffect } from 'react';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in text-[#111111]">
      <h1 className="font-serif text-4xl text-center mb-8 uppercase tracking-widest">About MF Designs</h1>
      
      <div className="space-y-6 font-sans text-gray-600 leading-relaxed text-center">
        <p>
          MF Designs is a Pakistani fashion label created for women who appreciate elegance, individuality and timeless craftsmanship.
        </p>
        <p>
          Our designs bring together contemporary silhouettes, beautiful fabrics and traditional handcrafted details to create pieces that feel both sophisticated and distinctive.
        </p>
        <p>
          From intricate dabka and zardozi work to delicate gota, pearls and sequin details, every design is thoughtfully created with an emphasis on craftsmanship and finishing.
        </p>
        <p>
          At MF Designs, we believe fashion should make you feel confident, elegant and uniquely yourself.
        </p>
        <p className="font-serif text-xl text-black mt-8 italic">
          Be Exclusive. Be Divine. Be Yourself.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
