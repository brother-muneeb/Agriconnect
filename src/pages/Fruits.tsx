import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Star, ShoppingCart, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductModal from '../components/ProductModal';
import CartSidebar from '../components/CartSidebar';
import DiscountBanner from '../components/DiscountBanner';
import CountdownTimer from '../components/CountdownTimer';
import ShopDiscountBanner from '../components/shop/ShopDiscountBanner';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

import { useLanguage } from '../context/LanguageContext';

const Fruits = () => {
  const { allProducts } = useProducts();
  const { language, t } = useLanguage();
  const fruits = useMemo(() => allProducts.filter(p => p.category.includes('Phal') || ['Aam Phal', 'Khatti Meethi', 'Desi Phal', 'Khaas Phal'].includes(p.category)), [allProducts]);

  const [activeFilter, setActiveFilter] = useState('Sab');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart, isCartSidebarOpen, setIsCartSidebarOpen } = useCart();

  const filters = [
    { id: 'Sab', name: 'Sab', nameEnglish: 'All' },
    { id: 'Aam Phal', name: 'Aam Phal', nameEnglish: 'Common Fruits' },
    { id: 'Khatti Meethi', name: 'Khatti Meethi', nameEnglish: 'Citrus & Berries' },
    { id: 'Desi Phal', name: 'Desi Phal', nameEnglish: 'Local Fruits' },
    { id: 'Khaas Phal', name: 'Khaas Phal', nameEnglish: 'Special Fruits' }
  ];

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'Sab') return fruits;
    return fruits.filter(f => f.category === activeFilter);
  }, [activeFilter, fruits]);

  const handleAddToCart = (product: Product, quantity: number, weight: string) => {
    addToCart(product, quantity, weight);
    setSelectedProduct(null);
  };

  const handleWhatsAppSingle = (product: Product) => {
    const isDiscountActive = product.discountPercent && product.discountStart && product.discountEnd && 
      new Date() >= new Date(product.discountStart) && new Date() <= new Date(product.discountEnd);
    
    const finalPrice = isDiscountActive 
      ? Math.round(product.price * (1 - product.discountPercent! / 100)) 
      : product.price;

    const message = `Assalam o Alaikum! Main AgriConnect say yeh order karna chahta hoon: ${product.name} [1kg] [Price: Rs. ${finalPrice}]`;
    window.open(`https://wa.me/923019515764?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-[72px]">
      <DiscountBanner products={fruits} />
      {/* Page Header */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden ac-fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1920)' }}
        >
          <div className="absolute inset-0 bg-agri-green/80 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-4"
          >
            {language === 'romanUrdu' ? 'Taaza Phal' : 'Fresh Fruits'}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 font-medium"
          >
            {language === 'romanUrdu' ? 'Seedha Punjab Kay Baghon Say' : 'Directly From Punjab Orchards'}
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-40 bg-white border-b shadow-sm ac-slide-up ac-delay-1">
        <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 min-w-max">
            <div className="bg-agri-green/10 p-2 rounded-lg text-agri-green mr-2">
              <Filter className="w-5 h-5" />
            </div>
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap",
                  activeFilter === filter.id 
                    ? "bg-agri-green text-white shadow-lg shadow-agri-green/20" 
                    : "bg-gray-100 text-gray-600 hover:bg-agri-green/10 hover:text-agri-green"
                )}
              >
                {language === 'romanUrdu' ? filter.name : filter.nameEnglish}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => {
                const delayClass = `ac-delay-${(idx % 4) + 1}`;
                return (
                  <motion.div
                    layout
                    key={product.id}
                    data-product-name={product.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8 }}
                    className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col h-full relative ac-zoom-in ${delayClass}`}
                  >
                  {/* Discount Badge */}
                  <div 
                    data-type="badge"
                    className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-wider"
                    style={{ display: (product.discountPercent && product.discountStart && product.discountEnd && 
                      new Date() >= new Date(product.discountStart) && new Date() <= new Date(product.discountEnd)) ? 'block' : 'none' }}
                  >
                    {product.discountPercent}% OFF
                  </div>
                  
                  {/* Timer */}
                  <div className="absolute top-12 left-4 z-10">
                    <div data-type="timer">
                      <CountdownTimer endDate={product.discountEnd || ''} />
                    </div>
                  </div>

                  {/* Image Container */}
                  <div 
                    className="relative h-40 md:h-56 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img 
                      src={product.image} 
                      alt={language === 'romanUrdu' ? product.name : product.nameEnglish} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-agri-orange fill-agri-orange" />
                      <span className="text-[10px] md:text-xs font-bold text-gray-900">{product.rating}.0</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <h3 
                      className="text-lg md:text-xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-agri-green transition-colors"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {language === 'romanUrdu' ? product.name : product.nameEnglish}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{t('wazan')}: 500g / 1kg / 2kg</p>
                    
                    <div className="mt-auto">
                      <div className="flex flex-col mb-4">
                        <div className="flex items-baseline gap-2">
                          <span data-type="price" className="text-2xl font-black text-agri-green">
                            Rs. {product.discountPercent ? Math.round(product.price * (1 - product.discountPercent / 100)) : product.price}
                          </span>
                          <span 
                            data-type="strikethrough" 
                            className="text-sm text-gray-400 line-through font-bold"
                            style={{ display: product.discountPercent ? 'inline' : 'none' }}
                          >
                            Rs. {product.price}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button 
                          onClick={() => handleAddToCart(product, 1, '1kg')}
                          className="w-full bg-agri-green text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-md shadow-agri-green/10"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {t('cart.add')}
                        </button>
                        <button 
                          onClick={() => handleWhatsAppSingle(product)}
                          className="w-full border-2 border-agri-green text-agri-green py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-agri-green hover:text-white transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {t('whatsapp.order')}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )})}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Special Deal Section */}
      <section className="py-16 bg-white ac-slide-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-agri-orange rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                  <span className="w-4 h-4">✨</span>
                  {language === 'romanUrdu' ? 'Aaj Ki Deal' : 'Today\'s Deal'}
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                  {language === 'romanUrdu' ? 'Aam Par 25% Discount!' : '25% Discount on Mangoes!'}
                </h2>
                <p className="text-xl text-white/90 max-w-xl">
                  {language === 'romanUrdu' 
                    ? 'Multan ke mashhoor anwar ratol ab aur bhi saste. Sirf aaj ke liye!' 
                    : 'Multan\'s famous Anwar Ratol mangoes now even cheaper. For today only!'}
                </p>
                <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
                  <span className="bg-white text-agri-orange px-6 py-2 rounded-full font-black text-2xl">Rs. 150 / kg</span>
                  <span className="text-white/60 line-through text-xl font-bold">Rs. 200</span>
                </div>
              </div>
              <button className="bg-white text-agri-orange px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 hover:bg-agri-cream transition-all shadow-xl">
                {language === 'romanUrdu' ? 'Order Karein' : 'Order Now'} <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Discount Banner */}
      <ShopDiscountBanner products={fruits} category="Phal" />

      {/* Modals & Sidebars */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <CartSidebar 
        isOpen={isCartSidebarOpen}
        onClose={() => setIsCartSidebarOpen(false)}
      />
    </div>
  );
};

export default Fruits;
