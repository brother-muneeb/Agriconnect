import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CloudSun, BarChart3, Calendar, Clock, Printer, Search, Edit2, Check, X, Leaf, Droplets, Sprout, Bug, Scissors, Thermometer, Wind, Umbrella, Sun, CloudRain, Cloud, MapPin, Lock, Tag, RefreshCw, ArrowRight, Lightbulb, Info, MapPinned } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { cn } from '../lib/utils';
import { useSearchParams } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import PasswordModal from '../components/PasswordModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { kisanArticles, Article } from '../data/kisanTipsData';
import ArticleDetailModal from '../components/kisan/ArticleDetailModal';
import SeasonalTipsSlider from '../components/kisan/SeasonalTipsSlider';
import { Product } from '../types';

const DiscountCell = ({ product, isAdmin, onEdit }: { product: Product, isAdmin: boolean, onEdit: (id: number, percent: number, end: string) => void }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { updateProductDiscount } = useProducts();

  useEffect(() => {
    if (!product.discountEnd) {
      setTimeLeft('');
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      const end = new Date(product.discountEnd!);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        // Auto reset to 0% if expired
        updateProductDiscount(product.id, null);
        setTimeLeft('');
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (h > 0) {
        setTimeLeft(`${h}h ${m}m`);
      } else {
        setTimeLeft(`${m}m`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [product.discountEnd, product.id, updateProductDiscount]);

  const handleRemoveTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateProductDiscount(product.id, {
      percent: product.discountPercent || 0,
      start: product.discountStart || new Date().toISOString(),
      end: ''
    });
  };

  const displayPercent = product.discountPercent || 0;

  return (
    <div 
      data-product-name={product.name}
      onClick={() => isAdmin && onEdit(product.id, displayPercent, product.discountEnd || '')}
      className={cn(
        "p-2 rounded-xl transition-all inline-block min-w-[100px] group relative text-center mx-auto",
        isAdmin ? "cursor-pointer hover:bg-orange-50 border border-transparent hover:border-orange-200" : ""
      )}
    >
      <div 
        data-type="discount-column"
        className={cn(
          "text-lg flex items-center justify-center gap-1",
          displayPercent > 0 ? "text-red-600 font-bold" : "text-gray-400 font-normal"
        )}
        style={{
          color: displayPercent > 0 ? '#ef4444' : '#9ca3af',
          fontWeight: displayPercent > 0 ? 'bold' : 'normal',
          fontSize: '18px'
        }}
      >
        {displayPercent}%
        {isAdmin && <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />}
      </div>
      {(timeLeft || product.discountEnd) && (
        <div 
          data-type="timer"
          className="text-[10px] text-orange-400 font-bold flex items-center gap-1 mt-0.5 bg-orange-50 px-2 py-0.5 rounded-full"
          style={{ display: timeLeft ? 'flex' : 'none' }}
        >
          <Clock className="w-3 h-3" /> {timeLeft}
          {isAdmin && (
            <button 
              onClick={handleRemoveTimer}
              className="ml-1 hover:text-red-500 transition-colors"
              title="Remove Timer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const WeatherTabContent = () => {
  useEffect(() => {
    if ((window as any).wInit) {
      (window as any).wInit();
    }
  }, []);

  return (
    <motion.div
      key="weather"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Step 6 - Weather Tab Content */}
      <div id="ac-full-weather"></div>
    </motion.div>
  );
};

const KisanTips = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'advice';
  const [rateListTab, setRateListTab] = useState('Sabziyaan');
  const { allProducts, updateProductPrice, updateProductDiscount, lastUpdated } = useProducts();
  const { isAdmin: isAuthAdmin } = useAuth();
  const { language, t } = useLanguage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  const [editingDiscountId, setEditingDiscountId] = useState<number | null>(null);
  const [editDiscountPercent, setEditDiscountPercent] = useState<string>('0');
  const [editDiscountEnd, setEditDiscountEnd] = useState<string>('');

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'panel' | 'edit' | 'edit-discount' | null>(null);
  const [isPasswordAuthenticated, setIsPasswordAuthenticated] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  useEffect(() => {
    // Step 8 - Kisan Tips Page On Load
    if (localStorage.getItem('goto_wx') === '1') {
      localStorage.removeItem('goto_wx');
      setSearchParams({ tab: 'weather' });
      // We also need to make sure the weather is initialized if we directly switch
      setTimeout(() => {
        if ((window as any).wInit) (window as any).wInit();
      }, 100);
    }

    if (localStorage.getItem('goto_rates') === '1') {
      localStorage.removeItem('goto_rates');
      setSearchParams({ tab: 'rates' });
      
      // Scroll to rate list section
      setTimeout(function() {
        var rateSection = document.getElementById('rate-list-section');
        if (rateSection) {
          rateSection.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [setSearchParams]);

  const today = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' });

  const tabs = [
    { 
      id: 'advice', 
      name: language === 'romanUrdu' ? 'Farming Advice' : 'Farming Advice', 
      icon: <BookOpen className="w-4 h-4" /> 
    },
    { 
      id: 'seasonal', 
      name: language === 'romanUrdu' ? 'Seasonal Tips' : 'Seasonal Tips', 
      icon: <CloudSun className="w-4 h-4" /> 
    },
    { 
      id: 'rates', 
      name: language === 'romanUrdu' ? "Today's Rate List" : "Today's Rate List", 
      icon: <BarChart3 className="w-4 h-4" /> 
    },
    { 
      id: 'weather', 
      name: language === 'romanUrdu' ? 'Weather Updates' : 'Weather Updates', 
      icon: <CloudRain className="w-4 h-4" /> 
    },
  ];

  // Wait, the user said:
  // Tab 1 button: "Farming Advice" (EN) / "Kheti Baari Mashwaray" (RU - I'll use this)
  // Tab 2 button: "Seasonal Tips" (EN)
  // Tab 3 button: "Today's Rate List" (EN)
  // Tab 4 button: "Weather Updates" (EN)

  const getTabName = (id: string) => {
    if (language === 'english') {
      if (id === 'advice') return 'Farming Advice';
      if (id === 'seasonal') return 'Seasonal Tips';
      if (id === 'rates') return "Today's Rate List";
      if (id === 'weather') return 'Weather Updates';
    } else {
      if (id === 'advice') return 'Kheti Baari Mashwaray';
      if (id === 'seasonal') return 'Mausami Mashwaray';
      if (id === 'rates') return 'Aaj Ki Rate List';
      if (id === 'weather') return 'Mausam Ki Surat-e-Hal';
    }
    return '';
  };

  const handleOpenArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleEdit = (id: number, currentPrice: number) => {
    setPendingAction('edit');
    setPendingEditData({ id, price: currentPrice });
    setIsPasswordModalOpen(true);
  };

  const handleEditDiscount = (id: number, currentPercent: number, currentEnd: string) => {
    setPendingAction('edit-discount');
    setPendingDiscountData({ id, percent: currentPercent, end: currentEnd });
    setIsPasswordModalOpen(true);
  };

  const [pendingDiscountData, setPendingDiscountData] = useState<{ id: number, percent: number, end: string } | null>(null);
  const [pendingEditData, setPendingEditData] = useState<{ id: number, price: number } | null>(null);

  const handleOpenAdminPanel = () => {
    setPendingAction('panel');
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSuccess = () => {
    setIsPasswordModalOpen(false);
    if (pendingAction === 'panel') {
      setIsAdminPanelOpen(true);
    } else if (pendingAction === 'edit-discount' && pendingDiscountData) {
      setEditingDiscountId(pendingDiscountData.id);
      setEditDiscountPercent(pendingDiscountData.percent.toString());
      setEditDiscountEnd(pendingDiscountData.end || '');
    } else if (pendingAction === 'edit' && pendingEditData) {
      setEditingId(pendingEditData.id);
      setEditValue(pendingEditData.price.toString());
    }
    setPendingAction(null);
    setPendingDiscountData(null);
    setPendingEditData(null);
  };

  const handleSave = (id: number) => {
    const newPrice = parseInt(editValue);
    if (!isNaN(newPrice)) {
      updateProductPrice(id, newPrice);
    }
    setEditingId(null);
  };

  const handleSaveDiscount = (id: number) => {
    const percent = parseInt(editDiscountPercent);
    if (!isNaN(percent)) {
      updateProductDiscount(id, {
        percent,
        start: new Date().toISOString(),
        end: editDiscountEnd
      });
    }
    setEditingDiscountId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      handleSave(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const groupedArticles = useMemo(() => {
    const groups: { [key: string]: { categoryRU: string; categoryEN: string; items: Article[] } } = {};
    kisanArticles.forEach(article => {
      if (!groups[article.categoryEN]) {
        groups[article.categoryEN] = {
          categoryRU: article.categoryRU,
          categoryEN: article.categoryEN,
          items: []
        };
      }
      groups[article.categoryEN].items.push(article);
    });
    return Object.values(groups);
  }, []);

  const getRateListCategoryName = (cat: string) => {
    if (language === 'english') {
      if (cat === 'Sabziyaan') return 'Vegetables';
      if (cat === 'Phal') return 'Fruits';
      if (cat === 'Dry Fruits') return 'Dry Fruits';
      if (cat === 'Anaaj') return 'Grains';
    }
    return cat;
  };

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden ac-fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920)' }}
        >
          <div className="absolute inset-0 bg-agri-green/80 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-4"
          >
            {language === 'romanUrdu' ? 'Kisan Tips' : 'Farmer Tips'}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 font-medium"
          >
            {language === 'romanUrdu' 
              ? 'Punjab Kay Kisanon Kay Liye Mufeed Maalumat' 
              : 'Useful Information For Punjab Farmers'}
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-40 bg-white border-b shadow-sm ac-slide-up ac-delay-1">
        <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center gap-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={cn(
                  "px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2",
                  activeTab === tab.id 
                    ? "bg-agri-green text-white shadow-lg shadow-agri-green/20" 
                    : "bg-gray-100 text-gray-600 hover:bg-agri-green/10 hover:text-agri-green"
                )}
              >
                {tab.icon}
                {getTabName(tab.id)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'advice' && (
            <motion.div
              key="advice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {groupedArticles.map((section) => (section.items.length > 0 && (
                <div key={section.categoryEN}>
                  <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <span className="p-2 bg-agri-green/10 rounded-xl text-agri-green">
                      <Sprout className="w-6 h-6" />
                    </span>
                    {language === 'romanUrdu' ? section.categoryRU : section.categoryEN}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {section.items.map((article, idx) => {
                      const delayClass = `ac-delay-${(idx % 4) + 1}`;
                      return (
                        <motion.div
                          key={article.id}
                          whileHover={{ y: -8 }}
                          className={`bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group ac-zoom-in ${delayClass}`}
                        >
                        <div className="h-64 overflow-hidden relative">
                          <img 
                            src={article.image} 
                            alt={article.titleEN} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-agri-green flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {today}
                          </div>
                        </div>
                        <div className="p-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-agri-green transition-colors">
                            {language === 'romanUrdu' ? article.titleRU : article.titleEN}
                          </h3>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {language === 'romanUrdu' ? article.descriptionRU : article.descriptionEN}
                          </p>
                          <button 
                            onClick={() => handleOpenArticle(article)}
                            className="bg-agri-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg shadow-agri-green/20"
                          >
                            {language === 'romanUrdu' ? 'Poora Parhein' : 'Read More'}
                          </button>
                        </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )))}
            </motion.div>
          )}

          {activeTab === 'seasonal' && (
            <motion.div
              key="seasonal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SeasonalTipsSlider />
            </motion.div>
          )}

          {activeTab === 'rates' && (
            <div
              id="rate-list-section"
              className="space-y-8"
            >
              {/* Rate List Header */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl font-serif font-bold text-gray-900">
                      {language === 'romanUrdu' ? 'Aaj Ki Sarkari Rate List' : "Today's Official Rate List"}
                    </h2>
                    <button 
                      onClick={handleOpenAdminPanel}
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-agri-green/20 text-agri-green rounded-xl font-bold hover:bg-agri-green hover:text-white transition-all shadow-sm"
                      title={t('admin.panel')}
                    >
                      <Lock className="w-4 h-4" />
                      <span>{language === 'romanUrdu' ? 'Admin Edit' : 'Admin Edit'}</span>
                    </button>
                  </div>
                  <p className="text-gray-500 font-medium">
                    {language === 'romanUrdu' 
                      ? 'Yeh Rates Punjab Mandi Say Li Gayi Hain' 
                      : 'These rates are sourced from Punjab Mandi'}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-agri-green font-bold">
                      <Calendar className="w-5 h-5" /> {today}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 font-medium">
                      <Clock className="w-5 h-5" /> Last Updated: {lastUpdated}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-agri-green hover:text-white transition-all shadow-sm"
                >
                  <Printer className="w-5 h-5" /> {language === 'romanUrdu' ? 'Rate List Print Karein' : 'Print Rate List'}
                </button>
              </div>

              {/* Rate List Tabs */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b overflow-x-auto no-scrollbar">
                  {rateListCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setRateListTab(cat)}
                      className={cn(
                        "px-8 py-6 font-bold text-sm transition-all border-b-4 whitespace-nowrap",
                        rateListTab === cat 
                          ? "border-agri-green text-agri-green bg-agri-green/5" 
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {getRateListCategoryName(cat)} {language === 'romanUrdu' ? 'Rate List' : 'Rate List'}
                    </button>
                  ))}
                </div>

                <div className="p-4 md:p-8 overflow-x-auto text-left w-full">
                  <table style={{ width: '100%', borderCollapse: 'collapse', display: 'table' }}>
                    <thead>
                      <tr style={{ background: '#2d6a2d', color: 'white', display: 'table-row' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', display: 'table-cell' }}>
                          {language === 'romanUrdu' ? 'Cheez Ka Naam' : 'Product Name'}
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', display: 'table-cell' }}>
                          {language === 'romanUrdu' ? 'Miqdar' : 'Quantity'}
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', display: 'table-cell' }}>
                          {language === 'romanUrdu' ? 'Rate (Rs.)' : 'Rate (Rs.)'}
                        </th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', display: 'table-cell' }}>
                          Discount
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ display: 'table-row-group' }}>
                      {allProducts
                        .filter(p => {
                          if (rateListTab === 'Sabziyaan') return p.category.includes('Sabziyaan') || p.category === 'Rozmarra Wali' || p.category === 'Patti Wali' || p.category === 'Aam Sabziyaan' || p.category === 'Khaas Sabziyaan';
                          if (rateListTab === 'Phal') return p.category.includes('Phal') || p.category === 'Aam Phal' || p.category === 'Khatti Meethi' || p.category === 'Desi Phal' || p.category === 'Khaas Phal';
                          if (rateListTab === 'Dry Fruits') return p.category.includes('Dry Fruits') || p.category === 'Aam Dry Fruits' || p.category === 'Seeds Walay' || p.category === 'Meethy Dry Fruits' || p.category === 'Khaas Dry Fruits';
                          if (rateListTab === 'Anaaj') return p.category.includes('Anaaj') || p.category === 'Aam Anaaj' || p.category === 'Daliyan' || p.category === 'Chawal Ki Kismein' || p.category === 'Khaas Anaaj';
                          return false;
                        })
                        .map((product, idx) => (
                          <tr 
                             key={product.id} 
                             data-product-name={product.name}
                             style={{ background: idx % 2 === 0 ? '#f9f9f9' : 'white', display: 'table-row' }}
                          >
                            <td style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#111827', display: 'table-cell' }} className="dark:text-white">
                              {language === 'romanUrdu' ? product.name : product.nameEnglish}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', color: '#6b7280', fontWeight: '500', display: 'table-cell' }} className="dark:text-gray-300">
                              {product.unit}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', display: 'table-cell' }}>
                              {editingId === product.id ? (
                                <div className="flex items-center justify-center gap-2">
                                  <input
                                    autoFocus
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, product.id)}
                                    className="w-24 px-3 py-1.5 border-2 border-agri-green rounded-lg outline-none font-bold text-agri-green"
                                  />
                                  <button onClick={() => handleSave(product.id)} className="p-1.5 bg-agri-green text-white rounded-lg hover:bg-green-800"><Check className="w-4 h-4" /></button>
                                  <button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"><X className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <button 
                                  data-type="rate-column"
                                  onClick={() => handleEdit(product.id, product.price)}
                                  className="group inline-flex items-center gap-2 hover:bg-agri-green/10 px-3 py-1 rounded-xl transition-all font-bold text-center justify-center"
                                  style={{ color: '#2d6a2d', fontWeight: 'bold', fontSize: '18px' }}
                                >
                                  Rs. {product.price}
                                  <Edit2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                                </button>
                              )}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', display: 'table-cell' }}>
                              <DiscountCell 
                                product={product} 
                                isAdmin={true} 
                                onEdit={handleEditDiscount} 
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <WeatherTabContent />
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <ArticleDetailModal 
        article={selectedArticle}
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
      />
      {/* Discount Edit Modal */}
      <AnimatePresence>
        {editingDiscountId !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingDiscountId(null)}
              className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[210] rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">✏️ Discount Edit</h2>
                </div>
                <button 
                  onClick={() => setEditingDiscountId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">Product:</p>
                  <p className="text-xl font-black text-gray-900">
                    {allProducts.find(p => p.id === editingDiscountId)?.name} ({allProducts.find(p => p.id === editingDiscountId)?.nameEnglish})
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Discount %:</label>
                  <div className="relative">
                    <input
                      autoFocus
                      type="text"
                      inputMode="numeric"
                      value={editDiscountPercent}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 99)) {
                          setEditDiscountPercent(val);
                        }
                      }}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-black text-2xl text-orange-600"
                      placeholder="0"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-2xl text-orange-600">%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">(numbers only, 0 to 99)</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Set Timer (Optional):</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={editDiscountEnd}
                        onChange={(e) => setEditDiscountEnd(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setEditingDiscountId(null)}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveDiscount(editingDiscountId!)}
                    className="flex-[2] bg-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    <Check className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AdminPanel 
        isOpen={isAdminPanelOpen} 
        onClose={() => setIsAdminPanelOpen(false)} 
      />
      <PasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

const rateListCategories = ['Sabziyaan', 'Phal', 'Dry Fruits', 'Anaaj'];

export default KisanTips;
