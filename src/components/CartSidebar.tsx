import React from 'react';
import { X, ShoppingBag, Plus, Minus, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, getCurrentPriceData } = useCart();
  const { allProducts } = useProducts();
  const { language, t } = useLanguage();

  const getMultiplier = (weight: string) => {
    if (weight.includes('kg')) return parseFloat(weight);
    if (weight.includes('g')) return parseFloat(weight) / 1000;
    return 1;
  };

  const handleWhatsAppOrder = () => {
    let message = language === 'romanUrdu'
      ? "Assalam o Alaikum! Main AgriConnect say yeh order karna chahta hoon:\n\n"
      : "Assalam o Alaikum! I want to order this from AgriConnect:\n\n";
    
    cartItems.forEach(item => {
      const priceData = getCurrentPriceData(item.name, item.price);
      const itemTotal = priceData.finalPrice * item.quantity * getMultiplier(item.selectedWeight);
      
      if (priceData.discount > 0) {
        message += `- ${item.name} (${priceData.discount}% OFF): Rs. ${priceData.originalPrice} -> Rs. ${priceData.finalPrice} x ${item.quantity} = Rs. ${itemTotal}\n`;
      } else {
        message += `- ${item.name} (${item.selectedWeight}): Rs. ${priceData.finalPrice} x ${item.quantity} = Rs. ${itemTotal}\n`;
      }
    });
    message += `\nTotal Amount: Rs. ${cartTotal}`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center bg-agri-green text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-xl font-bold">{t('cart.title')}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg">{t('cart.empty')}</p>
                  <button 
                    onClick={onClose}
                    className="text-agri-green font-bold hover:underline"
                  >
                    {t('cart.shopping.start')}
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedWeight}`} className="flex gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedWeight)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{t('wazan')}: {item.selectedWeight}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-white rounded-lg border px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedWeight, -1)}
                            className="p-1 hover:text-agri-green"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedWeight, 1)}
                            className="p-1 hover:text-agri-green"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          {(() => {
                            const priceData = getCurrentPriceData(item.name, item.price);
                            const itemTotal = priceData.finalPrice * item.quantity * getMultiplier(item.selectedWeight);
                            const originalItemTotal = priceData.originalPrice * item.quantity * getMultiplier(item.selectedWeight);

                            return (
                              <>
                                {priceData.discount > 0 && (
                                  <div className="flex items-center gap-1 mb-0.5">
                                    <span className="text-[8px] font-bold bg-green-100 text-green-700 px-1 rounded">
                                      {priceData.discount}% OFF
                                    </span>
                                    <span className="text-[10px] text-gray-400 line-through">
                                      Rs. {originalItemTotal}
                                    </span>
                                  </div>
                                )}
                                <span className={cn("font-bold text-sm", priceData.discount > 0 ? "text-green-600" : "text-agri-green")}>
                                  Rs. {itemTotal}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-gray-50 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>{t('cart.subtotal')}:</span>
                  <span className="text-agri-green">Rs. {cartTotal}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Link 
                    to="/cart" 
                    onClick={onClose}
                    className="w-full bg-agri-green text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-colors shadow-lg shadow-agri-green/20 text-center"
                  >
                    {t('cart.view')}
                  </Link>
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full border-2 border-agri-green text-agri-green py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-agri-green hover:text-white transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {t('cart.sidebar.order.whatsapp')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
