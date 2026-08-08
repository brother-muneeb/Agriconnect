import React, { useState } from 'react';
import { X, Plus, Minus, MessageSquare, ShoppingCart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, weight: string) => void;
  weightOptions?: string[];
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose, 
  onAddToCart,
  weightOptions = ['500g', '1kg', '2kg']
}) => {
  const { language, t } = useLanguage();
  const { getCurrentPriceData } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0]);

  if (!product) return null;

  const priceData = getCurrentPriceData(product.name, product.price);

  const weights = weightOptions;
  const multiplier = selectedWeight.includes('kg') 
    ? parseFloat(selectedWeight) 
    : parseFloat(selectedWeight) / 1000;
  const totalPrice = priceData.finalPrice * quantity * multiplier;
  const originalTotalPrice = priceData.originalPrice * quantity * multiplier;

  const handleWhatsApp = () => {
    const productName = language === 'romanUrdu' ? product.name : product.nameEnglish;
    const message = `Assalam o Alaikum! Main AgriConnect say yeh order karna chahta hoon: ${productName} [${selectedWeight}] [Qty: ${quantity}] [Price: Rs. ${totalPrice}]`;
    window.open(`https://wa.me/923019515764?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white z-[90] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-900 hover:bg-agri-green hover:text-white transition-all z-10 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <img 
                src={product.image} 
                alt={language === 'romanUrdu' ? product.name : product.nameEnglish} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="bg-agri-green text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {t('farm.fresh')}
                </div>
                {priceData.discount > 0 && (
                  <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-lg uppercase tracking-wider">
                    {priceData.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'text-agri-orange fill-agri-orange' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(4.8/5 {t('reviews')})</span>
              </div>

              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                {language === 'romanUrdu' ? product.name : product.nameEnglish}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {product.description}
              </p>

              <div className="space-y-8">
                {/* Weight Selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">{t('weight.select')}</label>
                  <div className="flex gap-3">
                    {weights.map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={cn(
                          "px-6 py-3 rounded-xl font-bold transition-all border-2",
                          selectedWeight === w 
                            ? "bg-agri-green border-agri-green text-white shadow-lg shadow-agri-green/20" 
                            : "bg-white border-gray-100 text-gray-600 hover:border-agri-green/30"
                        )}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">{t('quantity.label')}</label>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 border border-gray-100">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-600 hover:bg-agri-green hover:text-white transition-all shadow-sm"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-600 hover:bg-agri-green hover:text-white transition-all shadow-sm"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">{t('total.price')}</p>
                      <div className="flex flex-col items-end">
                        <p className="text-3xl font-black text-agri-green">Rs. {totalPrice}</p>
                        {priceData.discount > 0 && (
                          <p className="text-sm text-gray-400 line-through font-bold">
                            Rs. {Math.round(originalTotalPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <button 
                    onClick={() => onAddToCart(product, quantity, selectedWeight)}
                    className="w-full bg-agri-green text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {t('cart.add')}
                  </button>
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full border-2 border-agri-green text-agri-green py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-agri-green hover:text-white transition-all"
                  >
                    <MessageSquare className="w-6 h-6" />
                    {t('whatsapp.order')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
