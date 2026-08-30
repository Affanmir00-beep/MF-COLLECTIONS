import React, { useEffect } from 'react';

const ExchangePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in text-[#111111]">
      <h1 className="font-serif text-3xl mb-8 uppercase tracking-widest text-center">Exchange & Return Policy</h1>
      
      <div className="space-y-6 font-sans text-gray-600 leading-relaxed">
        <p className="text-lg text-black mb-8 text-center">
          At MF Designs, all orders are carefully checked before dispatch to ensure you receive your order in perfect condition.
        </p>

        <ul className="list-disc pl-5 space-y-3">
          <li>We do not offer refunds.</li>
          <li>We offer exchange only for eligible items.</li>
          <li>Exchange requests must be made within <strong>[3 days]</strong> of receiving the order.</li>
          <li>The item must be unused, unworn, unwashed and in its original condition, with all tags/packaging intact.</li>
          <li>Exchange is subject to product availability.</li>
          <li>Customised / made-to-measure orders are not eligible for exchange or return, unless the item has a manufacturing defect or an error was made by MF Designs.</li>
          <li>Sale/discounted items are non-exchangeable unless otherwise stated.</li>
          <li>Shipping charges for an exchange are <strong>[customer's responsibility]</strong>.</li>
          <li>No cash, bank or card refunds will be issued under any circumstances.</li>
        </ul>

        <div className="mt-8 p-4 bg-gray-50 border-l-4 border-[var(--color-primary)]">
          <p className="font-medium text-black">Please check your size and measurements carefully before placing an order.</p>
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;
