import React from 'react';
import { Truck, BadgeCheck, MessageSquare, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Truck className="w-8 h-8 text-agri-green" />,
    title: 'Free Delivery',
    description: 'On orders above Rs. 2000',
  },
  {
    icon: <BadgeCheck className="w-8 h-8 text-agri-green" />,
    title: 'Farm Fresh',
    description: 'Directly from Punjab fields',
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-agri-green" />,
    title: 'WhatsApp Order',
    description: 'Easy ordering via WhatsApp',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-agri-green" />,
    title: 'Secure Payment',
    description: '100% safe transactions',
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow bg-agri-cream/30 ac-slide-up ac-delay-${idx + 1}`}
            >
              <div className="mb-4 p-3 bg-white rounded-xl shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
