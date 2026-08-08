import React, { useState } from 'react';
import { MessageSquare, Sparkles, X, Copy, CheckCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Deals = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('PUNJAB20');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Assalam o Alaikum! Main PUNJAB20 discount code use karke order karna chahta hoon");
    window.open(`https://wa.me/923019515764?text=${msg}`, '_blank');
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-agri-orange rounded-[2rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl ac-zoom-in">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left ac-slide-left ac-delay-2">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                {language === 'romanUrdu' ? 'Aaj Ki Special Deal' : "Today's Special Deal"}
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                {language === 'romanUrdu' ? 'Tamam Phaloon Par 20% Discount Paayein' : 'Get 20% Off on All Seasonal Fruits'}
              </h2>
              <p className="text-xl text-white/90 max-w-xl">
                {language === 'romanUrdu' 
                  ? 'Sargodha kay baghaat say taaza kinnow aur amrood. Sirf aaj kay liye!'
                  : 'Freshly picked Kinnows and Guavas from Sargodha orchards. Valid for today only!'}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsPopupOpen(true)}
                className="bg-white text-agri-orange px-8 py-8 rounded-full flex flex-col items-center justify-center shadow-xl transform rotate-12 hover:rotate-0 transition-transform cursor-pointer group"
              >
                <span className="text-sm font-bold uppercase tracking-widest group-hover:text-agri-green transition-colors">
                  {language === 'romanUrdu' ? 'Code Use Karein' : 'Use Code'}
                </span>
                <span className="text-3xl font-black">PUNJAB20</span>
              </motion.div>
              
              <button 
                onClick={handleWhatsApp}
                className="bg-agri-green text-white px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-green-900 transition-all shadow-lg ac-slide-right ac-delay-3"
              >
                <MessageSquare className="w-5 h-5" />
                {language === 'romanUrdu' ? 'WhatsApp Par Order Karein' : 'Order Now on WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Discount Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-8 text-center"
            >
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="bg-agri-orange/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-agri-orange" />
              </div>

              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                {language === 'romanUrdu' ? '20% Discount Paayein!' : 'Get 20% Discount!'}
              </h3>
              <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                {language === 'romanUrdu' 
                  ? 'PUNJAB20 Code Use Karke Apne Pehle Order Par 20% Discount Paayein'
                  : 'Use code PUNJAB20 on your first order to get 20% discount'}
              </p>

              <div className="relative mb-8">
                <div className="bg-gray-100 p-6 rounded-2xl border-2 border-dashed border-agri-orange flex items-center justify-between">
                  <span className="text-2xl font-black text-agri-orange tracking-widest">PUNJAB20</span>
                  <button 
                    onClick={handleCopy}
                    className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-agri-orange"
                  >
                    {isCopied ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
                {isCopied && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-green-600"
                  >
                    {language === 'romanUrdu' ? 'Code Copy Ho Gaya!' : 'Code Copied!'}
                  </motion.span>
                )}
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setIsPopupOpen(false);
                    navigate('/sabziyaan');
                  }}
                  className="w-full bg-agri-green text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-lg shadow-agri-green/20"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {language === 'romanUrdu' ? 'Abhi Shopping Karein' : 'Start Shopping Now'}
                </button>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  {language === 'romanUrdu' ? '*Sirf Pehle Order Par Valid' : '*Valid on first order only'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Deals;
