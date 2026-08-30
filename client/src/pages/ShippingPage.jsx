import React, { useEffect } from 'react';

const ShippingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in text-[#111111]">
      <h1 className="font-serif text-3xl mb-8 uppercase tracking-widest text-center">Shipping & Delivery</h1>
      
      <div className="space-y-8 font-sans text-gray-600 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-black mb-4 uppercase tracking-widest">Pakistan and Overall World</h2>
          <p className="mb-2"><strong>Courier:</strong> Leopard Courier Service and DHL</p>
          <p><strong>Estimated delivery:</strong> To be confirmed according to product/customisation.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-black mb-4 uppercase tracking-widest">International</h2>
          <p className="mb-2">International shipping can be offered where available.</p>
          <p><strong>International shipping charges:</strong> To be confirmed based on destination and parcel weight.</p>
        </section>

        <section className="bg-gray-50 p-6 border border-gray-100">
          <h2 className="font-serif text-xl text-black mb-4 uppercase tracking-widest">Important</h2>
          <p className="mb-2">Customised orders may require additional processing time.</p>
          <p>Exact delivery charges and delivery timelines will be confirmed before website launch.</p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPage;
