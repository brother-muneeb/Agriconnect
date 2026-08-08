import React, { useState } from 'react';
import { X, Save, Calendar, Clock, Tag, ChevronRight, Search, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { allProducts, updateProductDiscount, updateProductPrice, loading } = useProducts();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Sabziyaan');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = ['Sabziyaan', 'Phal', 'Dry Fruits', 'Anaaj'];
  const tabNames: Record<string, { romanUrdu: string, english: string }> = {
    'Sabziyaan': { romanUrdu: 'Sabziyaan', english: 'Vegetables' },
    'Phal': { romanUrdu: 'Phal', english: 'Fruits' },
    'Dry Fruits': { romanUrdu: 'Dry Fruits', english: 'Dry Fruits' },
    'Anaaj': { romanUrdu: 'Anaaj', english: 'Grains' },
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = p.category.includes(activeTab) || 
      (activeTab === 'Sabziyaan' && ['Rozmarra Wali', 'Patti Wali', 'Aam Sabziyaan', 'Khaas Sabziyaan'].includes(p.category)) ||
      (activeTab === 'Phal' && ['Aam Phal', 'Khatti Meethi', 'Desi Phal', 'Khaas Phal'].includes(p.category)) ||
      (activeTab === 'Dry Fruits' && ['Aam Dry Fruits', 'Seeds Walay', 'Meethy Dry Fruits', 'Khaas Dry Fruits'].includes(p.category)) ||
      (activeTab === 'Anaaj' && ['Aam Anaaj', 'Daliyan', 'Chawal Ki Kismein', 'Khaas Anaaj'].includes(p.category));
    
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleSaveDiscount = () => {
    if (editingProduct) {
      updateProductDiscount(editingProduct.id, {
        percent: discountPercent,
        start: startDate,
        end: endDate
      });
      setEditingProduct(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleRemoveDiscount = (id: number) => {
    updateProductDiscount(id, null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-[110] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-agri-green text-white">
              <div>
                <h2 className="text-2xl font-bold">Admin Edit</h2>
                <p className="text-white/80 text-sm">Manage product rates and discounts</p>
              </div>
              <button 
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-xl transition-colors text-sm font-bold"
              >
                <X className="w-5 h-5" />
                <span>{language === 'romanUrdu' ? 'Band Karein' : 'Close'}</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b overflow-x-auto no-scrollbar bg-gray-50">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
                    activeTab === cat 
                      ? "border-agri-green text-agri-green bg-white" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  {language === 'romanUrdu' ? tabNames[cat].romanUrdu : tabNames[cat].english}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'romanUrdu' ? "Product dhundein..." : "Search product..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-agri-green border-2 rounded-xl outline-none transition-all"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-green"></div>
                  <p className="text-gray-500 font-medium">Products loading...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-medium">No products found</div>
              ) : (
                filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white border rounded-2xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{language === 'romanUrdu' ? product.name : product.nameEnglish}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-agri-green font-bold">Rs. {product.price}</span>
                          {product.discountPercent && (
                            <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                              {product.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setDiscountPercent(product.discountPercent || 0);
                          setStartDate(product.discountStart || '');
                          setEndDate(product.discountEnd || '');
                        }}
                        className="p-2 text-gray-400 hover:text-agri-green hover:bg-agri-green/5 rounded-lg transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Success Toast */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-agri-green text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[120]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold">{t('admin.success')}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
              {editingProduct && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setEditingProduct(null)}
                    className="fixed inset-0 bg-black/40 z-[120] backdrop-blur-[2px]"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[130] rounded-3xl shadow-2xl p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {language === 'romanUrdu' ? 'Discount Edit Karein' : 'Edit Discount'}
                      </h3>
                      <button 
                        onClick={() => setEditingProduct(null)}
                        className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                        <span>{language === 'romanUrdu' ? 'Band Karein' : 'Close'}</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Discount %</label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={isNaN(discountPercent) ? '' : discountPercent}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setDiscountPercent(val);
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-agri-green outline-none transition-all font-bold"
                            placeholder="e.g. 20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {language === 'romanUrdu' ? 'Timer Set Karein' : 'Set Timer'}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[11px] font-medium text-gray-400 mb-1">
                              {language === 'romanUrdu' ? 'Shuru' : 'Start'}
                            </div>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-9 pr-2 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-agri-green outline-none transition-all text-xs font-bold"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-gray-400 mb-1">
                              {language === 'romanUrdu' ? 'Khatam' : 'End'}
                            </div>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-9 pr-2 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-agri-green outline-none transition-all text-xs font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => handleRemoveDiscount(editingProduct.id)}
                          className="flex-1 py-4 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                        >
                          {t('admin.remove')}
                        </button>
                        <button
                          onClick={handleSaveDiscount}
                          className="flex-[2] bg-agri-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-lg shadow-agri-green/20"
                        >
                          <Save className="w-5 h-5" />
                          {language === 'romanUrdu' ? 'Changes Save Karein' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
