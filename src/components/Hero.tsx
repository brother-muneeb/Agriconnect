import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920',
      tagline: language === 'romanUrdu' ? 'Punjab Kay Khetton Say Seedha Aapke Ghar Tak' : 'Fresh From Punjab Fields To Your Door',
      buttonText: language === 'romanUrdu' ? 'Abhi Shopping Karein' : 'Shop Now',
      buttonIcon: null,
      action: () => navigate('/sabziyaan')
    },
    {
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200',
      tagline: language === 'romanUrdu' ? '100% Asli Aur Taaza Products' : '100% Fresh & Natural Products',
      buttonText: language === 'romanUrdu' ? 'WhatsApp Par Order Karein' : 'Order on WhatsApp',
      buttonIcon: <MessageSquare className="w-5 h-5" />,
      action: () => {
        const msg = encodeURIComponent("Assalam o Alaikum! Main AgriConnect say order karna chahta hoon");
        window.open(`https://wa.me/923019515764?text=${msg}`, '_blank');
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1920',
      tagline: language === 'romanUrdu' ? 'Farm Fresh Phal Aapki Khidmat Mein' : 'Farm Fresh Fruits Delivered To You',
      buttonText: language === 'romanUrdu' ? 'Mazeed Dekhein' : 'Explore Now',
      buttonIcon: null,
      action: () => navigate('/kisan-tips')
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section id="hero-section" className="relative h-[85vh] w-full overflow-hidden mt-[72px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start">
            <motion.h1 
              key={`tagline-${current}-${language}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white max-w-2xl leading-tight ac-slide-up"
            >
              {slides[current].tagline}
            </motion.h1>
            
            <motion.button
              key={`btn-${current}-${language}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={slides[current].action}
              className="mt-8 bg-agri-green text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-agri-green/90 transition-colors shadow-lg shadow-agri-green/20 ac-slide-up ac-delay-3"
            >
              {slides[current].buttonIcon}
              {slides[current].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-10">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === idx ? 'bg-agri-green w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
