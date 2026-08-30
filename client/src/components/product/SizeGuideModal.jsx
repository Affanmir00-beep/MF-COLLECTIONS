import React from 'react';
import { X } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white max-w-2xl w-full p-6 md:p-10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 hover:opacity-50 transition-opacity">
          <X size={24} strokeWidth={1} />
        </button>
        <h3 className="font-serif text-2xl uppercase mb-6 text-center">Measurement Guide</h3>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-black">
                <th className="py-3 font-medium">Size</th>
                <th className="py-3 font-medium">Chest</th>
                <th className="py-3 font-medium">Waist</th>
                <th className="py-3 font-medium">Hips</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#EAEAEA]"><td className="py-3">XS</td><td>32"</td><td>24"</td><td>35"</td></tr>
              <tr className="border-b border-[#EAEAEA]"><td className="py-3">S</td><td>34"</td><td>26"</td><td>37"</td></tr>
              <tr className="border-b border-[#EAEAEA]"><td className="py-3">M</td><td>36"</td><td>28"</td><td>39"</td></tr>
              <tr className="border-b border-[#EAEAEA]"><td className="py-3">L</td><td>38"</td><td>30"</td><td>41"</td></tr>
              <tr><td className="py-3">XL</td><td>40"</td><td>32"</td><td>43"</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
