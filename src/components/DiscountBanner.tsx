import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import CountdownTimer from './CountdownTimer';

interface DiscountBannerProps {
  products: Product[];
}

const DiscountBanner: React.FC<DiscountBannerProps> = ({ products }) => {
  const { language } = useLanguage();
  
  const activeDiscounts = products.filter(p => {
    if (!p.discountPercent || !p.discountStart || !p.discountEnd) return false;
    const now = new Date();
    const start = new Date(p.discountStart);
    const end = new Date(p.discountEnd);
    return now >= start && now <= end;
  });

  if (activeDiscounts.length === 0) return null;

  // Show the first active discount for now
  const deal = activeDiscounts[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-600 text-white py-3 px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          <span className="font-black uppercase tracking-wider text-sm">
            {language === 'romanUrdu' ? 'Dhamaka Deal!' : 'Mega Deal!'}
          </span>
        </div>
        <p className="font-bold text-sm md:text-base">
          {language === 'romanUrdu' 
            ? `${deal.name} par ${deal.discountPercent}% OFF! Jaldi karein, waqt khatam ho raha hai.`
            : `${deal.nameEnglish} at ${deal.discountPercent}% OFF! Hurry up, time is running out.`}
        </p>
        <div className="flex items-center gap-3">
          <CountdownTimer endDate={deal.discountEnd!} />
          <button className="bg-white text-red-600 px-4 py-1 rounded-full text-xs font-black flex items-center gap-1 hover:bg-gray-100 transition-all">
            {language === 'romanUrdu' ? 'Abhi Khareedein' : 'Shop Now'} <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscountBanner;
