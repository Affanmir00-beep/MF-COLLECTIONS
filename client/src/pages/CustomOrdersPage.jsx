import React, { useEffect } from 'react';

const CustomOrdersPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in text-[#111111]">
      <h1 className="font-serif text-3xl mb-2 uppercase tracking-widest text-center">Custom Orders</h1>
      <p className="text-center text-gray-500 text-sm mb-12">Made-to-measure, made for you</p>

      <div className="space-y-8 font-sans text-gray-600 leading-relaxed">
        <div className="text-center">
          <p className="text-lg text-black mb-4">
            At MF Designs, we understand that every woman is unique. That's why we offer custom-made outfits tailored to your exact measurements and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 border border-gray-100">
            <h3 className="font-serif text-lg text-black mb-3 uppercase tracking-widest">What We Offer</h3>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>Custom sizing to your measurements</li>
              <li>Choice of fabric and color</li>
              <li>Personalized embroidery details</li>
              <li>Custom length and silhouette adjustments</li>
              <li>Bridal and wedding wear customization</li>
            </ul>
          </div>

          <div className="p-6 bg-gray-50 border border-gray-100">
            <h3 className="font-serif text-lg text-black mb-3 uppercase tracking-widest">How It Works</h3>
            <ol className="space-y-2 list-decimal pl-5 text-sm">
              <li>Contact us via WhatsApp with your design idea</li>
              <li>Share your measurements and preferences</li>
              <li>Receive a quote and estimated timeline</li>
              <li>Confirm and make payment</li>
              <li>Receive your custom masterpiece!</li>
            </ol>
          </div>
        </div>

        <div className="text-center mt-8 p-8 bg-black text-white">
          <h3 className="font-serif text-xl mb-4 uppercase tracking-widest">Start Your Custom Order</h3>
          <p className="text-sm text-gray-300 mb-6">Message us on WhatsApp to discuss your dream outfit</p>
          <a 
            href="https://wa.me/923117121215?text=Hi%20MF%20Designs!%20I%20would%20like%20to%20inquire%20about%20a%20custom%20order." 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-[#25D366] text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-[#20BA5C] transition-colors"
          >
            💬 WhatsApp Us: 03117121215
          </a>
        </div>

        <div className="p-4 bg-[#FFF8D6] border border-[#FFE787] text-sm">
          <p className="font-medium text-black">⚠️ Please note: Custom orders typically take 2-4 weeks. Custom/made-to-measure orders are not eligible for exchange or return, unless there is a manufacturing defect.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomOrdersPage;
