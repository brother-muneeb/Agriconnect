import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Clock } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

interface DiscountBannerProps {
  products: Product[];
  category: string;
}

const ShopDiscountBanner: React.FC<DiscountBannerProps> = ({ products, category }) => {
  const { language, t } = useLanguage();
  
  // Filter products that have an active discount
  const discountedProducts = products.filter(p => {
    if (!p.discountPercent || !p.discountEnd) return false;
    const now = new Date();
    const end = new Date(p.discountEnd);
    return end > now;
  });

  if (discountedProducts.length === 0) return null;

  const getEmoji = (cat: string) => {
    if (cat.includes('Sabziyaan')) return '🥔';
    if (cat.includes('Phal')) return '🍎';
    if (cat.includes('Dry Fruits')) return '🥜';
    if (cat.includes('Anaaj')) return '🌾';
    return '🏷️';
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                  <Tag className="w-4 h-4" />
                  {language === 'romanUrdu' ? 'Khaas Offers' : 'Special Offers'}
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
                  {language === 'romanUrdu' ? '🔥 KHAAS DISCOUNT OFFERS! 🔥' : '🔥 SPECIAL DISCOUNT OFFERS! 🔥'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {discountedProducts.map((product) => (
                <DiscountCard key={product.id} product={product} emoji={getEmoji(category)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DiscountCard = ({ product, emoji }: { product: Product; emoji: string }) => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const end = new Date(product.discountEnd!);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(hours < 1);
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [product.discountEnd]);

  const salePrice = Math.round(product.price * (1 - (product.discountPercent || 0) / 100));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 hover:bg-white/20 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="text-4xl">{emoji}</div>
        <div className="bg-white text-red-600 px-3 py-1 rounded-full font-black text-sm shadow-lg">
          {product.discountPercent}% OFF
        </div>
      </div>

      <h3 className="text-xl font-black mb-4">
        {product.name} ({product.nameEnglish})
      </h3>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm opacity-80">
          <span>{language === 'romanUrdu' ? 'Asli Qeemat:' : 'Original Price:'}</span>
          <span className="line-through">Rs. {product.price}/{product.unit}</span>
        </div>
        <div className="flex justify-between text-xl font-black">
          <span>{language === 'romanUrdu' ? 'Sale Qeemat:' : 'Sale Price:'}</span>
          <span className="text-yellow-300">Rs. {salePrice}/{product.unit}</span>
        </div>
      </div>

      <div className={cn(
        "flex items-center gap-2 py-3 px-4 rounded-xl font-mono font-bold text-center justify-center",
        isUrgent ? "bg-red-500 text-white animate-pulse" : "bg-black/20 text-white"
      )}>
        <Clock className="w-4 h-4" />
        <span>{language === 'romanUrdu' ? 'Baqi Waqt:' : 'Remaining:'} {timeLeft}</span>
      </div>
    </motion.div>
  );
};

export default ShopDiscountBanner;
