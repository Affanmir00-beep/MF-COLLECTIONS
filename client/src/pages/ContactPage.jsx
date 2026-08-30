import React, { useEffect } from 'react';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto animate-fade-in text-[#111111]">
      <h1 className="font-serif text-3xl mb-8 uppercase tracking-widest text-center">Contact Details</h1>
      
      <div className="space-y-8 font-sans text-gray-600 leading-relaxed text-center">
        <div>
          <h2 className="font-sans font-bold text-black uppercase tracking-widest text-sm mb-2">WhatsApp</h2>
          <p>03117121215</p>
        </div>

        <div>
          <h2 className="font-sans font-bold text-black uppercase tracking-widest text-sm mb-2">Email</h2>
          <p><a href="mailto:mfdesignsofficialpk@gmail.com" className="hover:text-black transition-colors">mfdesignsofficialpk@gmail.com</a></p>
        </div>

        <div>
          <h2 className="font-sans font-bold text-black uppercase tracking-widest text-sm mb-2">Business Address</h2>
          <p>Multan</p>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <h2 className="font-sans font-bold text-black uppercase tracking-widest text-sm mb-4">Follow Us</h2>
          <a href="https://www.instagram.com/mfdesigns_official?igsh=MTN0OXY5bnhyeWEyOQ==" target="_blank" rel="noopener noreferrer" className="inline-block border border-black px-6 py-3 uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors">
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
