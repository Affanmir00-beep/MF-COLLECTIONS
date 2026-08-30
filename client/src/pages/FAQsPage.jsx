import React, { useEffect } from 'react';

const FAQsPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const faqs = [
    { q: 'How do I place an order?', a: 'Browse our collections, select your size, add to bag and proceed to checkout. You can pay via card, bank transfer, or cash on delivery.' },
    { q: 'What sizes do you offer?', a: 'We offer sizes from XS to XL. Please refer to our Size Guide page for detailed measurements. For custom sizing, please reach out via WhatsApp.' },
    { q: 'Can I customize an outfit?', a: 'Yes! We offer custom orders. Visit our Custom Orders page or message us on WhatsApp at 03117121215 with your requirements.' },
    { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, bank transfer, EasyPaisa, JazzCash and Cash on Delivery (Pakistan only).' },
    { q: 'How long does delivery take?', a: 'Delivery timelines depend on the product and any customization. Standard ready-to-wear items are dispatched within 3-5 business days. Custom orders may take 2-4 weeks.' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide via DHL. International shipping charges are calculated based on destination and parcel weight.' },
    { q: 'What is your exchange policy?', a: 'We offer exchange within 3 days of receiving the order. The item must be unused, unworn, with tags intact. See our Exchange & Return page for full details.' },
    { q: 'Do you offer refunds?', a: 'We do not offer refunds. Exchange only for eligible items. Sale items and custom orders are non-exchangeable.' },
    { q: 'How do I contact customer support?', a: 'WhatsApp us at 03117121215 or email mfdesignsofficialpk@gmail.com. We typically respond within a few hours.' },
    { q: 'Are your outfits true to size?', a: 'Our outfits are designed to fit standard Pakistani sizing. We recommend checking our Size Guide and measuring yourself before ordering.' },
  ];

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in text-[#111111]">
      <h1 className="font-serif text-3xl mb-2 uppercase tracking-widest text-center">Frequently Asked Questions</h1>
      <p className="text-center text-gray-500 text-sm mb-12">Everything you need to know about MF Designs</p>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <details key={i} className="group border border-gray-200 rounded-none">
            <summary className="cursor-pointer p-5 font-sans text-sm font-medium tracking-wide flex justify-between items-center hover:bg-gray-50 transition-colors">
              {faq.q}
              <span className="ml-4 text-gray-400 group-open:rotate-45 transition-transform text-lg">+</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQsPage;
