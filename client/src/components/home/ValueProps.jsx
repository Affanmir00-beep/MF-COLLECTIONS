import React from 'react';
import { Truck, RefreshCw, PhoneCall, ShieldCheck } from 'lucide-react';

const ValueProps = () => {
  const props = [
    {
      icon: <Truck size={32} strokeWidth={1} />,
      title: 'Nationwide Delivery',
      desc: 'Free shipping on orders over Rs. 5,000'
    },
    {
      icon: <RefreshCw size={32} strokeWidth={1} />,
      title: '7-Day Exchange',
      desc: 'Hassle-free exchanges within 7 days'
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1} />,
      title: 'Cash on Delivery',
      desc: 'Pay at your doorstep across Pakistan'
    },
    {
      icon: <PhoneCall size={32} strokeWidth={1} />,
      title: 'Premium Support',
      desc: 'Dedicated assistance via WhatsApp'
    }
  ];

  return (
    <section className="py-16 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map((prop, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6">
              <div className="text-[var(--color-accent)] mb-4">
                {prop.icon}
              </div>
              <h3 className="font-serif text-lg text-[var(--color-text)] tracking-wider mb-2">{prop.title}</h3>
              <p className="font-sans text-sm text-gray-500">{prop.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
