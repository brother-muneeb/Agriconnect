import React, { useState } from 'react';
import { Table, X, Printer, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

const MandiRates = () => {
  const { language } = useLanguage();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sabzi');

  const mandiData = [
    { item: language === 'romanUrdu' ? 'Aalu (Potato)' : 'Potato (Aalu)', rate: 'Rs. 45 - 55', unit: 'Per Kg' },
    { item: language === 'romanUrdu' ? 'Pyaz (Onion)' : 'Onion (Pyaz)', rate: 'Rs. 80 - 95', unit: 'Per Kg' },
    { item: language === 'romanUrdu' ? 'Tamatar (Tomato)' : 'Tomato (Tamatar)', rate: 'Rs. 120 - 140', unit: 'Per Kg' },
    { item: language === 'romanUrdu' ? 'Aam (Mango)' : 'Mango (Aam)', rate: 'Rs. 250 - 300', unit: 'Per Kg' },
    { item: language === 'romanUrdu' ? 'Wheat (Gandum)' : 'Wheat (Gandum)', rate: 'Rs. 3900 - 4100', unit: 'Per 40Kg' },
    { item: language === 'romanUrdu' ? 'Rice (Basmati)' : 'Rice (Basmati)', rate: 'Rs. 7500 - 8200', unit: 'Per 40Kg' },
  ];

  const fullRateList = {
    sabzi: [
      { item: 'Aalu (Potato)', rate: '45-55', unit: 'Kg' },
      { item: 'Pyaz (Onion)', rate: '80-95', unit: 'Kg' },
      { item: 'Tamatar (Tomato)', rate: '120-140', unit: 'Kg' },
      { item: 'Adrak (Ginger)', rate: '400-450', unit: 'Kg' },
      { item: 'Lehsan (Garlic)', rate: '300-350', unit: 'Kg' },
      { item: 'Shimla Mirch', rate: '150-180', unit: 'Kg' },
      { item: 'Gobi (Cauliflower)', rate: '60-80', unit: 'Kg' },
      { item: 'Matar (Peas)', rate: '200-220', unit: 'Kg' },
    ],
    phal: [
      { item: 'Aam (Mango)', rate: '250-300', unit: 'Kg' },
      { item: 'Kela (Banana)', rate: '150-200', unit: 'Dozen' },
      { item: 'Saib (Apple)', rate: '200-350', unit: 'Kg' },
      { item: 'Angoor (Grapes)', rate: '300-400', unit: 'Kg' },
      { item: 'Tarbooz (Watermelon)', rate: '40-60', unit: 'Kg' },
    ],
    dry: [
      { item: 'Badam (Almond)', rate: '1200-1500', unit: 'Kg' },
      { item: 'Akhrot (Walnut)', rate: '800-1000', unit: 'Kg' },
      { item: 'Kaju (Cashew)', rate: '2000-2500', unit: 'Kg' },
      { item: 'Pista (Pistachio)', rate: '2500-3000', unit: 'Kg' },
    ],
    anaaj: [
      { item: 'Gandum (Wheat)', rate: '3900-4100', unit: '40Kg' },
      { item: 'Chawal (Rice)', rate: '7500-8200', unit: '40Kg' },
      { item: 'Makai (Corn)', rate: '2200-2500', unit: '40Kg' },
      { item: 'Bajra', rate: '2800-3200', unit: '40Kg' },
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8 ac-slide-left">
          <div className="bg-agri-green p-2 rounded-lg">
            <Table className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              {language === 'romanUrdu' ? 'Aaj Ki Punjab Mandi Rate List' : "Today's Punjab Mandi Rates"}
            </h2>
            <p className="text-gray-600">
              {language === 'romanUrdu' ? 'Punjab Ki Bari Mandiyoon Say Live Updates' : 'Live updates from major markets across Punjab'}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white ac-slide-up ac-delay-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-agri-green text-white">
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  {language === 'romanUrdu' ? 'Cheez' : 'Commodity'}
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  {language === 'romanUrdu' ? 'Rate Range' : 'Rate Range'}
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  {language === 'romanUrdu' ? 'Unit' : 'Unit'}
                </th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">
                  {language === 'romanUrdu' ? 'Halat' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mandiData.map((row, idx) => (
                <tr key={idx} className="hover:bg-agri-cream/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.item}</td>
                  <td className="px-6 py-4 text-agri-green font-bold">{row.rate}</td>
                  <td className="px-6 py-4 text-gray-600">{row.unit}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {language === 'romanUrdu' ? 'Mustahkam' : 'Stable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button 
            onClick={() => {
              localStorage.setItem('goto_rates', '1');
              window.location.href = '/kisan-tips';
            }}
            className="text-agri-green font-bold hover:underline ac-fade-in ac-delay-3"
          >
            {language === 'romanUrdu' ? 'Poori Rate List Dekhein →' : 'View All Markets →'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MandiRates;
