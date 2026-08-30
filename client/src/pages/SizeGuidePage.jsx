import React, { useEffect } from 'react';

const SizeGuidePage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in text-[#111111]">
      <h1 className="font-serif text-3xl mb-2 uppercase tracking-widest text-center">Size Guide</h1>
      <p className="text-center text-gray-500 text-sm mb-12">Find your perfect fit with MF Designs</p>

      <div className="overflow-x-auto mb-12">
        <table className="w-full border-collapse text-sm font-sans">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-4 text-left uppercase tracking-widest text-[11px]">Size</th>
              <th className="p-4 text-center uppercase tracking-widest text-[11px]">Bust (in)</th>
              <th className="p-4 text-center uppercase tracking-widest text-[11px]">Waist (in)</th>
              <th className="p-4 text-center uppercase tracking-widest text-[11px]">Hip (in)</th>
              <th className="p-4 text-center uppercase tracking-widest text-[11px]">Shirt Length (in)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['XS', '32', '26', '35', '40'],
              ['S', '34', '28', '37', '41'],
              ['M', '36', '30', '39', '42'],
              ['L', '38', '32', '41', '43'],
              ['XL', '40', '34', '43', '44'],
            ].map(([size, bust, waist, hip, length], idx) => (
              <tr key={size} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-4 font-bold">{size}</td>
                <td className="p-4 text-center">{bust}</td>
                <td className="p-4 text-center">{waist}</td>
                <td className="p-4 text-center">{hip}</td>
                <td className="p-4 text-center">{length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <div className="p-6 bg-gray-50 border border-gray-100">
          <h3 className="font-serif text-lg text-black mb-3 uppercase tracking-widest">How to Measure</h3>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Bust:</strong> Measure around the fullest part of your bust, keeping the tape parallel to the ground.</li>
            <li><strong>Waist:</strong> Measure around the narrowest part of your natural waist.</li>
            <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
            <li><strong>Shirt Length:</strong> Measure from the shoulder point to the desired hemline.</li>
          </ul>
        </div>

        <div className="p-4 bg-[#FFF8D6] border border-[#FFE787]">
          <p className="font-medium text-black">💡 Tip: If you're between sizes, we recommend going up one size for a more comfortable fit. For custom sizing, contact us on WhatsApp at 03117121215.</p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
