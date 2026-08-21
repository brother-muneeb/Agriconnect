import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, CloudSun, BarChart3, Calendar, Clock, Printer, Search, 
  Edit2, Check, X, Leaf, Droplets, Sprout, Bug, Scissors, Thermometer, 
  Wind, Umbrella, Sun, CloudRain, Cloud, MapPin, Lock, Tag, RefreshCw, 
  ArrowRight, Lightbulb, Info, MapPinned, AlertCircle, CheckCircle2, DollarSign
} from 'lucide-react';
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
import { doesItemMatchSeller } from '../utils/categoryMatcher';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

interface DiscountCellProps {
  product: Product;
  canEdit: boolean;
  onEdit: (id: number, percent: number, end: string) => void;
}

const DiscountCell: React.FC<DiscountCellProps> = ({ product, canEdit, onEdit }) => {
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
    const interval = setInterval(calculateTime, 60000);
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
      onClick={() => canEdit && onEdit(product.id, displayPercent, product.discountEnd || '')}
      className={cn(
        "p-2 rounded-xl transition-all inline-block min-w-[100px] group relative text-center mx-auto",
        canEdit ? "cursor-pointer hover:bg-orange-50 border border-transparent hover:border-orange-200" : ""
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
        {canEdit && <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />}
      </div>
      {(timeLeft || product.discountEnd) && (
        <div 
          data-type="timer"
          className="text-[10px] text-orange-400 font-bold flex items-center gap-1 mt-0.5 bg-orange-50 px-2 py-0.5 rounded-full"
          style={{ display: timeLeft ? 'flex' : 'none' }}
        >
          <Clock className="w-3 h-3" /> {timeLeft}
          {canEdit && (
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

  // User state & RBAC
  const [userRole, setUserRole] = useState<'customer' | 'seller' | 'admin' | 'guest'>('customer');
  const [currentSeller, setCurrentSeller] = useState<any>(null);

  // Admin Direct Edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editingDiscountId, setEditingDiscountId] = useState<number | null>(null);
  const [editDiscountPercent, setEditDiscountPercent] = useState<string>('0');
  const [editDiscountEnd, setEditDiscountEnd] = useState<string>('');

  // Seller Proposal Modal states
  const [sellerModalProduct, setSellerModalProduct] = useState<Product | null>(null);
  const [sellerRequestedPrice, setSellerRequestedPrice] = useState<string>('');
  const [sellerRequestedDiscount, setSellerRequestedDiscount] = useState<string>('0');
  const [sellerDiscountStart, setSellerDiscountStart] = useState<string>('');
  const [sellerDiscountEnd, setSellerDiscountEnd] = useState<string>('');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Toast / Feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Admin Panels
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'panel' | 'edit' | 'edit-discount' | null>(null);
  const [pendingDiscountData, setPendingDiscountData] = useState<{ id: number, percent: number, end: string } | null>(null);
  const [pendingEditData, setPendingEditData] = useState<{ id: number, price: number } | null>(null);
  const [isPasswordAuthenticated, setIsPasswordAuthenticated] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // Read logged in user role & seller data
  const loadUserRole = async () => {
    const storedUser = localStorage.getItem('ac_user');
    if (!storedUser) {
      setUserRole('customer');
      setCurrentSeller(null);
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      const role = parsed.userType || (parsed.role === 'admin' ? 'admin' : 'customer');
      setUserRole(role);

      if (role === 'seller') {
        const uid = parsed.uid || parsed.id;
        if (uid) {
          try {
            const sellerDoc = await getDoc(doc(db, 'sellers', uid));
            if (sellerDoc.exists()) {
              setCurrentSeller({ id: uid, ...sellerDoc.data() });
            } else {
              setCurrentSeller(parsed);
            }
          } catch (err) {
            setCurrentSeller(parsed);
          }
        } else {
          setCurrentSeller(parsed);
        }
      } else {
        setCurrentSeller(null);
      }
    } catch (e) {
      console.error(e);
      setUserRole('customer');
    }
  };

  useEffect(() => {
    loadUserRole();
    window.addEventListener('ac_user_updated', loadUserRole);
    return () => window.removeEventListener('ac_user_updated', loadUserRole);
  }, []);

  // Compute RBAC flags
  const isCustomer = userRole === 'customer';
  const isSeller = userRole === 'seller';
  const isAdmin = isAuthAdmin || userRole === 'admin' || isPasswordAuthenticated;

  // Compute seller selections for product matching
  const sellerSelections = useMemo(() => {
    if (!currentSeller) return [];
    return [
      ...(currentSeller.products || []),
      ...(currentSeller.categories || []),
      ...(currentSeller.otherProducts || [])
    ];
  }, [currentSeller]);

  // Check if current user can edit a specific product
  const canEditProduct = (product: Product) => {
    if (isCustomer) return false;
    if (isAdmin) return true;
    if (isSeller) {
      return doesItemMatchSeller({ name: product.name, category: product.category }, sellerSelections);
    }
    return false;
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  useEffect(() => {
    if (localStorage.getItem('goto_wx') === '1') {
      localStorage.removeItem('goto_wx');
      setSearchParams({ tab: 'weather' });
      setTimeout(() => {
        if ((window as any).wInit) (window as any).wInit();
      }, 100);
    }

    if (localStorage.getItem('goto_rates') === '1') {
      localStorage.removeItem('goto_rates');
      setSearchParams({ tab: 'rates' });
      
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

  // Open Admin Panel / Password Trigger
  const handleOpenAdminPanel = () => {
    if (isCustomer) {
      showToast(
        language === 'romanUrdu' ? 'Customer ko admin panel ki ijazat nahi hai.' : 'Customers cannot access the admin panel.',
        'error'
      );
      return;
    }
    if (isAdmin) {
      setIsAdminPanelOpen(true);
    } else {
      setPendingAction('panel');
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsPasswordAuthenticated(true);
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

  // Click on Rate column
  const handleClickRate = (product: Product) => {
    if (isCustomer) return;

    if (isAdmin) {
      setEditingId(product.id);
      setEditValue(product.price.toString());
      return;
    }

    if (isSeller) {
      if (doesItemMatchSeller({ name: product.name, category: product.category }, sellerSelections)) {
        // Open seller proposal modal
        setSellerModalProduct(product);
        setSellerRequestedPrice(product.price.toString());
        setSellerRequestedDiscount((product.discountPercent || 0).toString());
        setSellerDiscountStart(product.discountStart || '');
        setSellerDiscountEnd(product.discountEnd || '');
      }
      return;
    }

    // Otherwise prompt for password
    setPendingAction('edit');
    setPendingEditData({ id: product.id, price: product.price });
    setIsPasswordModalOpen(true);
  };

  // Click on Discount column
  const handleClickDiscount = (id: number, currentPercent: number, currentEnd: string) => {
    if (isCustomer) return;

    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    if (isAdmin) {
      setEditingDiscountId(id);
      setEditDiscountPercent(currentPercent.toString());
      setEditDiscountEnd(currentEnd || '');
      return;
    }

    if (isSeller) {
      if (doesItemMatchSeller({ name: product.name, category: product.category }, sellerSelections)) {
        setSellerModalProduct(product);
        setSellerRequestedPrice(product.price.toString());
        setSellerRequestedDiscount(currentPercent.toString());
        setSellerDiscountStart(product.discountStart || '');
        setSellerDiscountEnd(currentEnd || '');
      }
      return;
    }

    setPendingAction('edit-discount');
    setPendingDiscountData({ id, percent: currentPercent, end: currentEnd });
    setIsPasswordModalOpen(true);
  };

  // Admin Direct Rate Save
  const handleAdminSaveRate = (id: number) => {
    const newPrice = parseInt(editValue);
    if (!isNaN(newPrice)) {
      updateProductPrice(id, newPrice);
      showToast(language === 'romanUrdu' ? 'Rate update ho gaya!' : 'Rate updated!', 'success');
    }
    setEditingId(null);
  };

  // Admin Direct Discount Save
  const handleAdminSaveDiscount = (id: number) => {
    const percent = parseInt(editDiscountPercent);
    if (!isNaN(percent)) {
      updateProductDiscount(id, {
        percent,
        start: new Date().toISOString(),
        end: editDiscountEnd
      });
      showToast(language === 'romanUrdu' ? 'Discount update ho gaya!' : 'Discount updated!', 'success');
    }
    setEditingDiscountId(null);
  };

  // Seller Submit Proposal to `pendingChanges` in Firestore
  const handleSellerSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerModalProduct) return;

    const reqPrice = parseFloat(sellerRequestedPrice);
    const reqDiscount = parseFloat(sellerRequestedDiscount);

    if (isNaN(reqPrice) || reqPrice <= 0) {
      showToast(language === 'romanUrdu' ? 'Durust rate darj karein' : 'Please enter a valid price', 'error');
      return;
    }

    setIsSubmittingProposal(true);

    try {
      const storedUser = localStorage.getItem('ac_user');
      let sellerUid = currentSeller?.id || currentSeller?.uid || '';
      let sellerName = currentSeller?.ownerName || currentSeller?.shopName || currentSeller?.fullName || 'Kisan Seller';

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          sellerUid = sellerUid || parsed.uid || parsed.id || '';
          sellerName = sellerName || parsed.fullName || parsed.shopName || 'Kisan Seller';
        } catch (err) {
          console.error(err);
        }
      }

      await addDoc(collection(db, 'pendingChanges'), {
        sellerUid: sellerUid,
        sellerName: sellerName,
        productId: sellerModalProduct.id,
        productName: sellerModalProduct.name,
        productNameEnglish: sellerModalProduct.nameEnglish || sellerModalProduct.name,
        currentPrice: sellerModalProduct.price,
        requestedPrice: reqPrice,
        currentDiscount: sellerModalProduct.discountPercent || 0,
        requestedDiscount: isNaN(reqDiscount) ? 0 : reqDiscount,
        discountStart: sellerDiscountStart || null,
        discountEnd: sellerDiscountEnd || null,
        status: 'pending',
        requestedAt: new Date().toISOString()
      });

      // Show user requested exact message:
      // RU: "Aapki request admin ko bhej di gayi hai. Approval kay baad change apply ho ga!"
      // EN: "Your request has been sent to admin for approval. Change will apply after approval!"
      showToast(
        language === 'romanUrdu'
          ? "Aapki request admin ko bhej di gayi hai. Approval kay baad change apply ho ga!"
          : "Your request has been sent to admin for approval. Change will apply after approval!",
        'success'
      );

      setSellerModalProduct(null);
    } catch (error) {
      console.error('Error submitting proposal to pendingChanges:', error);
      handleFirestoreError(error, OperationType.CREATE, 'pendingChanges');
      showToast('Request send nahi ho saki. Please dobara koshish karein.', 'error');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      handleAdminSaveRate(id);
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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <header className="bg-agri-green text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20"
          >
            <Sprout className="w-4 h-4 text-agri-yellow" />
            <span className="text-sm font-medium tracking-wide">
              {language === 'romanUrdu' ? 'Kisan Bhaiyon Ka Sathi' : "Farmer's Companion"}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight"
          >
            {t('nav.kisanTips')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {language === 'romanUrdu' 
              ? 'Mandi kay taaza rates, mausam ki surat-e-hal aur faslon ki behtari kay liye mufeed mashwaray'
              : 'Fresh market rates, weather updates, and expert tips for better crop yield'}
          </motion.p>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl p-2 shadow-xl shadow-gray-200/50 border border-gray-100 mb-12 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={cn(
                "flex-1 min-w-[140px] py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-sm md:text-base",
                activeTab === tab.id
                  ? "bg-agri-green text-white shadow-lg shadow-agri-green/20"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {tab.icon}
              <span>{getTabName(tab.id)}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'advice' && (
            <motion.div
              key="advice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {groupedArticles.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-6">
                  <div className="flex items-center gap-3 border-b-2 border-agri-green/20 pb-3">
                    <Leaf className="w-6 h-6 text-agri-green" />
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                      {language === 'romanUrdu' ? group.categoryRU : group.categoryEN}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((article) => (
                      <motion.div
                        key={article.id}
                        whileHover={{ y: -6 }}
                        onClick={() => handleOpenArticle(article)}
                        className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <img 
                              src={article.image} 
                              alt={article.titleRU} 
                              className="w-14 h-14 rounded-2xl object-cover group-hover:scale-105 transition-transform" 
                            />
                            <span className="text-xs font-bold text-agri-green bg-agri-green/10 px-3 py-1.5 rounded-full">
                              {language === 'romanUrdu' ? group.categoryRU : group.categoryEN}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-agri-green transition-colors">
                            {language === 'romanUrdu' ? article.titleRU : article.titleEN}
                          </h3>

                          <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6 font-medium">
                            {language === 'romanUrdu' ? article.descriptionRU : article.descriptionEN}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-agri-green font-bold text-sm">
                          <span>{language === 'romanUrdu' ? 'Tafseelat Dekhein' : 'Read Full Guide'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
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
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                      {language === 'romanUrdu' ? 'Aaj Ki Sarkari Rate List' : "Today's Official Rate List"}
                    </h2>
                    
                    {/* Admin Edit Button: HIDDEN FROM CUSTOMERS completely */}
                    {!isCustomer && (
                      <button 
                        onClick={handleOpenAdminPanel}
                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-agri-green/20 text-agri-green rounded-xl font-bold hover:bg-agri-green hover:text-white transition-all shadow-sm text-sm"
                        title={t('admin.panel')}
                      >
                        <Lock className="w-4 h-4" />
                        <span>{language === 'romanUrdu' ? 'Admin Edit' : 'Admin Edit'}</span>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-500 font-medium">
                    {language === 'romanUrdu' 
                      ? 'Yeh Rates Punjab Mandi Say Li Gayi Hain' 
                      : 'These rates are sourced from Punjab Mandi'}
                  </p>
                  
                  {isSeller && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-1.5 rounded-xl font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        {language === 'romanUrdu'
                          ? 'Aap apni products ke rate aur discount par click kar ke admin ko approval request bhej saktay hain.'
                          : 'You can propose price/discount changes on your listed products for admin approval.'}
                      </span>
                    </div>
                  )}

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
                        .map((product, idx) => {
                          const canEdit = canEditProduct(product);

                          return (
                            <tr 
                              key={product.id} 
                              data-product-name={product.name}
                              style={{ background: idx % 2 === 0 ? '#f9f9f9' : 'white', display: 'table-row' }}
                            >
                              <td style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: '#111827', display: 'table-cell' }} className="dark:text-white">
                                <div className="flex items-center gap-2">
                                  <span>{language === 'romanUrdu' ? product.name : product.nameEnglish}</span>
                                  {isSeller && canEdit && (
                                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded">
                                      Your Item
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center', color: '#6b7280', fontWeight: '500', display: 'table-cell' }} className="dark:text-gray-300">
                                {product.unit}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center', display: 'table-cell' }}>
                                {isAdmin && editingId === product.id ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <input
                                      autoFocus
                                      type="number"
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onKeyDown={(e) => handleKeyPress(e, product.id)}
                                      className="w-24 px-3 py-1.5 border-2 border-agri-green rounded-lg outline-none font-bold text-agri-green text-center"
                                    />
                                    <button onClick={() => handleAdminSaveRate(product.id)} className="p-1.5 bg-agri-green text-white rounded-lg hover:bg-green-800"><Check className="w-4 h-4" /></button>
                                    <button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"><X className="w-4 h-4" /></button>
                                  </div>
                                ) : canEdit ? (
                                  <button 
                                    data-type="rate-column"
                                    onClick={() => handleClickRate(product)}
                                    className="group inline-flex items-center gap-2 hover:bg-agri-green/10 px-3 py-1 rounded-xl transition-all font-bold text-center justify-center cursor-pointer"
                                    style={{ color: '#2d6a2d', fontWeight: 'bold', fontSize: '18px' }}
                                    title={isSeller ? "Request price change" : "Edit rate"}
                                  >
                                    Rs. {product.price}
                                    <Edit2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity text-agri-green" />
                                  </button>
                                ) : (
                                  <span 
                                    data-type="rate-column"
                                    className="inline-block px-3 py-1 font-bold text-center justify-center text-agri-green"
                                    style={{ color: '#2d6a2d', fontWeight: 'bold', fontSize: '18px' }}
                                  >
                                    Rs. {product.price}
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center', display: 'table-cell' }}>
                                <DiscountCell 
                                  product={product} 
                                  canEdit={canEdit} 
                                  onEdit={handleClickDiscount} 
                                />
                              </td>
                            </tr>
                          );
                        })}
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

      {/* Global Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 40, x: '-50%' }}
            className={cn(
              "fixed bottom-8 left-1/2 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[300] text-white font-bold text-sm tracking-wide border",
              toastType === 'success' 
                ? "bg-emerald-700 border-emerald-500 shadow-emerald-900/30" 
                : "bg-red-700 border-red-500 shadow-red-900/30"
            )}
          >
            {toastType === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
            <span className="max-w-md">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seller Proposal Request Modal */}
      <AnimatePresence>
        {sellerModalProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSellerModalProduct(null)}
              className="fixed inset-0 bg-black/60 z-[220] backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white z-[230] rounded-[2.5rem] shadow-2xl p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 rounded-2xl text-agri-green">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-serif">
                      {language === 'romanUrdu' ? 'Rate / Discount Request' : 'Rate & Discount Request'}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      {language === 'romanUrdu' ? 'Changes Admin ki approval kay baad apply hongi' : 'Changes require Admin approval before going live'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSellerModalProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSellerSubmitProposal} className="space-y-5">
                {/* Product Summary */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                  <img 
                    src={sellerModalProduct.image} 
                    alt={sellerModalProduct.name} 
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200" 
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {language === 'romanUrdu' ? sellerModalProduct.name : sellerModalProduct.nameEnglish}
                    </h4>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      Current Rate: <span className="font-bold text-agri-green">Rs. {sellerModalProduct.price}</span> / {sellerModalProduct.unit}
                      {sellerModalProduct.discountPercent ? ` • Discount: ${sellerModalProduct.discountPercent}%` : ''}
                    </div>
                  </div>
                </div>

                {/* Requested Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {language === 'romanUrdu' ? `Naya Rate (Rs. / ${sellerModalProduct.unit})` : `New Requested Rate (Rs. / ${sellerModalProduct.unit})`}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={sellerRequestedPrice}
                      onChange={(e) => setSellerRequestedPrice(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-agri-green focus:bg-white outline-none transition-all font-bold text-xl text-gray-900"
                      placeholder="e.g. 150"
                    />
                  </div>
                </div>

                {/* Requested Discount */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {language === 'romanUrdu' ? 'Naya Discount % (0 to 99)' : 'Requested Discount % (0 to 99)'}
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={sellerRequestedDiscount}
                      onChange={(e) => setSellerRequestedDiscount(e.target.value)}
                      className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-agri-green focus:bg-white outline-none transition-all font-bold text-xl text-gray-900"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-lg">%</span>
                  </div>
                </div>

                {/* Optional Timer */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {language === 'romanUrdu' ? 'Discount Timer (Ikhtiyari / Optional)' : 'Discount Timer (Optional)'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-medium text-gray-400 mb-1 block">
                        {language === 'romanUrdu' ? 'Shuru' : 'Start'}
                      </span>
                      <input
                        type="datetime-local"
                        value={sellerDiscountStart}
                        onChange={(e) => setSellerDiscountStart(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-agri-green outline-none text-xs font-medium"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-gray-400 mb-1 block">
                        {language === 'romanUrdu' ? 'Khatam' : 'End'}
                      </span>
                      <input
                        type="datetime-local"
                        value={sellerDiscountEnd}
                        onChange={(e) => setSellerDiscountEnd(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-agri-green outline-none text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSellerModalProduct(null)}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProposal}
                    className="flex-[2] bg-agri-green text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-lg shadow-agri-green/20 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {isSubmittingProposal
                        ? (language === 'romanUrdu' ? 'Bheja ja raha hai...' : 'Submitting...')
                        : (language === 'romanUrdu' ? 'Request Admin Ko Bhein' : 'Submit Request to Admin')}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Direct Discount Modal */}
      <AnimatePresence>
        {isAdmin && editingDiscountId !== null && (
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
                  <h2 className="text-2xl font-bold text-gray-900">✏️ Direct Discount Edit</h2>
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
                    onClick={() => handleAdminSaveDiscount(editingDiscountId!)}
                    className="flex-[2] bg-orange-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    <Check className="w-5 h-5" />
                    Direct Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ArticleDetailModal 
        article={selectedArticle}
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
      />

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
