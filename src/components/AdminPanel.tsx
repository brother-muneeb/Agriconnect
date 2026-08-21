import React, { useState, useEffect } from 'react';
import { 
  X, Save, Calendar, Clock, Tag, ChevronRight, Search, CheckCircle2, 
  XCircle, Check, AlertCircle, Bell, DollarSign, User, ArrowRight, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, PendingChangeRequest } from '../types';
import { useProducts } from '../context/ProductContext';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { allProducts, updateProductDiscount, updateProductPrice, loading } = useProducts();
  const { language, t } = useLanguage();
  
  // Tabs: 'pending' | 'Sabziyaan' | 'Phal' | 'Dry Fruits' | 'Anaaj'
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pending changes state
  const [pendingRequests, setPendingRequests] = useState<PendingChangeRequest[]>([]);
  const [requestsFilter, setRequestsFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Direct editing state (Admin direct edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Categories for direct edit
  const categories = ['Sabziyaan', 'Phal', 'Dry Fruits', 'Anaaj'];
  const tabNames: Record<string, { romanUrdu: string, english: string }> = {
    'Sabziyaan': { romanUrdu: 'Sabziyaan', english: 'Vegetables' },
    'Phal': { romanUrdu: 'Phal', english: 'Fruits' },
    'Dry Fruits': { romanUrdu: 'Dry Fruits', english: 'Dry Fruits' },
    'Anaaj': { romanUrdu: 'Anaaj', english: 'Grains' },
  };

  // Listen to pendingChanges in Firestore
  useEffect(() => {
    const pendingCol = collection(db, 'pendingChanges');
    const q = query(pendingCol, orderBy('requestedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests: PendingChangeRequest[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as PendingChangeRequest));
      setPendingRequests(requests);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'pendingChanges');
    });

    return () => unsubscribe();
  }, []);

  const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle Approve Request
  const handleApprove = async (req: PendingChangeRequest) => {
    if (!req.id) return;
    setProcessingId(req.id);

    try {
      // 1. Update product price in Firestore & Local storage
      if (req.requestedPrice !== undefined && req.requestedPrice !== null) {
        await updateProductPrice(req.productId, Number(req.requestedPrice));
      }

      // 2. Update product discount in Firestore & Local storage
      if (req.requestedDiscount !== undefined && req.requestedDiscount !== null) {
        await updateProductDiscount(
          req.productId,
          {
            percent: Number(req.requestedDiscount),
            start: req.discountStart || '',
            end: req.discountEnd || ''
          },
          req.productName
        );
      }

      // 3. Mark pendingChange as approved
      const reqRef = doc(db, 'pendingChanges', req.id);
      await updateDoc(reqRef, {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });

      showNotification(
        language === 'romanUrdu' 
          ? `Request manzoor! ${req.productName} ka rate aur discount update ho gaya.` 
          : `Request approved! Price & discount updated for ${req.productName}.`,
        'success'
      );
    } catch (error) {
      console.error('Error approving request:', error);
      showNotification('Failed to approve request. Please try again.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Reject Request
  const handleReject = async (req: PendingChangeRequest) => {
    if (!req.id) return;
    setProcessingId(req.id);

    try {
      const reqRef = doc(db, 'pendingChanges', req.id);
      await updateDoc(reqRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });

      showNotification(
        language === 'romanUrdu'
          ? `Request radd kar di gayi (${req.productName}).`
          : `Request rejected for ${req.productName}.`,
        'error'
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
      showNotification('Failed to reject request.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Direct Product Filter for Category tabs
  const filteredProducts = allProducts.filter(p => {
    if (activeTab === 'pending') return false;
    const matchesCategory = p.category.includes(activeTab) || 
      (activeTab === 'Sabziyaan' && ['Rozmarra Wali', 'Patti Wali', 'Aam Sabziyaan', 'Khaas Sabziyaan'].includes(p.category)) ||
      (activeTab === 'Phal' && ['Aam Phal', 'Khatti Meethi', 'Desi Phal', 'Khaas Phal'].includes(p.category)) ||
      (activeTab === 'Dry Fruits' && ['Aam Dry Fruits', 'Seeds Walay', 'Meethy Dry Fruits', 'Khaas Dry Fruits'].includes(p.category)) ||
      (activeTab === 'Anaaj' && ['Aam Anaaj', 'Daliyan', 'Chawal Ki Kismein', 'Khaas Anaaj'].includes(p.category));
    
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Filtered Requests for Pending Requests tab
  const displayedRequests = pendingRequests.filter(req => {
    if (requestsFilter !== 'all' && req.status !== requestsFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (req.sellerName && req.sellerName.toLowerCase().includes(q)) ||
      (req.productName && req.productName.toLowerCase().includes(q)) ||
      (req.productNameEnglish && req.productNameEnglish.toLowerCase().includes(q))
    );
  });

  // Direct Admin Save for individual product
  const handleSaveDirectEdit = async () => {
    if (!editingProduct) return;
    try {
      if (editPrice > 0 && editPrice !== editingProduct.price) {
        await updateProductPrice(editingProduct.id, editPrice);
      }

      await updateProductDiscount(editingProduct.id, {
        percent: discountPercent,
        start: startDate,
        end: endDate
      });

      setEditingProduct(null);
      showNotification(
        language === 'romanUrdu' ? 'Changes direct save ho gaye!' : 'Changes saved successfully!',
        'success'
      );
    } catch (e) {
      console.error(e);
      showNotification('Error saving product changes', 'error');
    }
  };

  const handleRemoveDiscount = async (id: number) => {
    await updateProductDiscount(id, null);
    showNotification(
      language === 'romanUrdu' ? 'Discount khatam kar diya gaya' : 'Discount removed',
      'success'
    );
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
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white z-[110] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-agri-green text-white">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold font-serif">AgriConnect Admin Panel</h2>
                  {pendingCount > 0 && (
                    <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-1 rounded-full animate-bounce flex items-center gap-1">
                      <Bell className="w-3 h-3" /> {pendingCount} New
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-sm mt-0.5">
                  {language === 'romanUrdu' 
                    ? 'Rate List aur Seller Requests ka control' 
                    : 'Manage official rates, discounts and seller pending requests'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="flex items-center gap-2 px-3.5 py-2 hover:bg-white/10 rounded-xl transition-colors text-sm font-bold bg-white/5 border border-white/20"
              >
                <X className="w-5 h-5" />
                <span>{language === 'romanUrdu' ? 'Band Karein' : 'Close'}</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b overflow-x-auto no-scrollbar bg-gray-50 px-2">
              {/* Tab 1: Pending Requests */}
              <button
                onClick={() => setActiveTab('pending')}
                className={cn(
                  "px-5 py-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 whitespace-nowrap",
                  activeTab === 'pending'
                    ? "border-agri-green text-agri-green bg-white shadow-sm"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span>{language === 'romanUrdu' ? 'Pending Requests' : 'Pending Requests'}</span>
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>

              {/* Direct Category Tabs */}
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "px-5 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap",
                    activeTab === cat 
                      ? "border-agri-green text-agri-green bg-white shadow-sm" 
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  )}
                >
                  {language === 'romanUrdu' ? tabNames[cat].romanUrdu : tabNames[cat].english}
                </button>
              ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="p-4 border-b bg-gray-50/50 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'pending'
                      ? (language === 'romanUrdu' ? "Seller ya product dhundein..." : "Search seller or product...")
                      : (language === 'romanUrdu' ? "Product dhundein..." : "Search product...")
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 focus:border-agri-green rounded-xl outline-none transition-all text-sm font-medium"
                />
              </div>

              {activeTab === 'pending' && (
                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  <Filter className="w-4 h-4 text-gray-400 hidden sm:inline" />
                  {(['pending', 'all', 'approved', 'rejected'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setRequestsFilter(f)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap",
                        requestsFilter === f
                          ? "bg-agri-green text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {f === 'pending' && `Pending (${pendingCount})`}
                      {f === 'approved' && 'Approved'}
                      {f === 'rejected' && 'Rejected'}
                      {f === 'all' && 'All'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {/* TAB 1: PENDING REQUESTS SECTION */}
              {activeTab === 'pending' && (
                <div className="space-y-4">
                  {displayedRequests.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-500">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">
                        {language === 'romanUrdu' ? 'Koi Pending Request Nahi Hai' : 'No Pending Requests'}
                      </h4>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto mt-1 font-medium">
                        {language === 'romanUrdu'
                          ? 'Jab koi seller rate ya discount change karega to request yahan show hogi.'
                          : 'When sellers request rate or discount changes for their products, they will appear here.'}
                      </p>
                    </div>
                  ) : (
                    displayedRequests.map((req) => {
                      const isPending = req.status === 'pending';
                      const isApproved = req.status === 'approved';
                      const isRejected = req.status === 'rejected';

                      let reqTime = '';
                      if (req.requestedAt) {
                        try {
                          const dateObj = req.requestedAt?.toDate ? req.requestedAt.toDate() : new Date(req.requestedAt);
                          reqTime = dateObj.toLocaleString();
                        } catch (e) {
                          reqTime = String(req.requestedAt);
                        }
                      }

                      return (
                        <div 
                          key={req.id}
                          className={cn(
                            "bg-white border-2 rounded-2xl p-5 transition-all shadow-sm",
                            isPending ? "border-amber-200 bg-amber-50/20" : "border-gray-100 opacity-90"
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-agri-green/10 text-agri-green flex items-center justify-center font-bold text-sm">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 leading-tight">
                                  {req.sellerName || 'Kisan Seller'}
                                </h4>
                                <span className="text-xs text-gray-400 font-medium">
                                  {reqTime || 'Recently requested'}
                                </span>
                              </div>
                            </div>

                            {/* Status Tag */}
                            <div>
                              {isPending && (
                                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-amber-200">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                  Pending Approval
                                </span>
                              )}
                              {isApproved && (
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5" /> Approved
                                </span>
                              )}
                              {isRejected && (
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                                  <X className="w-3.5 h-3.5" /> Rejected
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Product Info & Requested Changes */}
                          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Product Name */}
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Product
                              </div>
                              <div className="font-bold text-base text-gray-900">
                                {req.productName}
                                {req.productNameEnglish && req.productNameEnglish !== req.productName && (
                                  <span className="text-gray-500 font-medium text-sm ml-1.5">
                                    ({req.productNameEnglish})
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Price Comparison */}
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                              <div>
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                  Rate Change
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400 line-through text-sm font-medium">
                                    Rs. {req.currentPrice}
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-agri-green font-bold text-base">
                                    Rs. {req.requestedPrice}
                                  </span>
                                </div>
                              </div>

                              {/* Discount Comparison */}
                              <div className="text-right">
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                  Discount
                                </div>
                                <div className="flex items-center gap-1.5 justify-end">
                                  <span className="text-gray-400 text-xs">
                                    {req.currentDiscount || 0}%
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-gray-400" />
                                  <span className="bg-red-50 text-red-600 font-black text-xs px-2 py-0.5 rounded-full border border-red-200">
                                    {req.requestedDiscount || 0}% OFF
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons for Pending Requests */}
                          {isPending && (
                            <div className="pt-2 flex items-center justify-end gap-3">
                              <button
                                disabled={processingId === req.id}
                                onClick={() => handleReject(req)}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-2 disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>{language === 'romanUrdu' ? 'Radd Karein' : 'Reject'}</span>
                              </button>

                              <button
                                disabled={processingId === req.id}
                                onClick={() => handleApprove(req)}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                              >
                                <Check className="w-4 h-4" />
                                <span>{language === 'romanUrdu' ? 'Manzoor Karein (Approve)' : 'Approve'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TABS 2-5: DIRECT CATEGORY EDIT */}
              {activeTab !== 'pending' && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 font-medium pb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-agri-green" />
                    <span>
                      {language === 'romanUrdu'
                        ? 'Admin yahan say direct kisi bhi product ka rate aur discount foran tabdeel kar sakta hai.'
                        : 'Admins can directly edit product prices and discounts here with immediate application.'}
                    </span>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 font-medium">No products found</div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="bg-white border rounded-2xl p-4 hover:shadow-md transition-shadow flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                          />
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {language === 'romanUrdu' ? product.name : product.nameEnglish}
                              <span className="text-xs text-gray-400 font-normal ml-2">({product.unit})</span>
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-agri-green font-bold text-base">Rs. {product.price}</span>
                              {product.discountPercent ? (
                                <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                  {product.discountPercent}% OFF
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setEditPrice(product.price);
                            setDiscountPercent(product.discountPercent || 0);
                            setStartDate(product.discountStart || '');
                            setEndDate(product.discountEnd || '');
                          }}
                          className="px-4 py-2 bg-gray-50 hover:bg-agri-green hover:text-white text-gray-700 font-bold rounded-xl transition-all flex items-center gap-1.5 text-sm border border-gray-200"
                        >
                          <span>Direct Edit</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 30, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 30, x: '-50%' }}
                  className={cn(
                    "fixed bottom-8 left-1/2 px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 z-[150] text-white font-bold text-sm tracking-wide",
                    toastType === 'success' ? "bg-agri-green" : "bg-red-600"
                  )}
                >
                  {toastType === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Direct Edit Modal for Admin */}
            <AnimatePresence>
              {editingProduct && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setEditingProduct(null)}
                    className="fixed inset-0 bg-black/50 z-[130] backdrop-blur-[2px]"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[140] rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6 pb-3 border-b">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 font-serif">
                          Direct Edit: {language === 'romanUrdu' ? editingProduct.name : editingProduct.nameEnglish}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Admin direct change will update website immediately</p>
                      </div>
                      <button 
                        onClick={() => setEditingProduct(null)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-5">
                      {/* Price Input */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Rate (Rs. / {editingProduct.unit})
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={isNaN(editPrice) ? '' : editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agri-green focus:bg-white outline-none transition-all font-bold text-gray-900 text-lg"
                            placeholder="e.g. 120"
                          />
                        </div>
                      </div>

                      {/* Discount Input */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Discount %
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={isNaN(discountPercent) ? '' : discountPercent}
                            onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-agri-green focus:bg-white outline-none transition-all font-bold text-gray-900 text-lg"
                            placeholder="e.g. 20"
                          />
                        </div>
                      </div>

                      {/* Timer Settings */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          {language === 'romanUrdu' ? 'Timer Set Karein' : 'Set Timer (Optional)'}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-[11px] font-medium text-gray-400 mb-1">
                              {language === 'romanUrdu' ? 'Shuru' : 'Start'}
                            </div>
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full pl-8 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agri-green outline-none text-xs font-medium"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-gray-400 mb-1">
                              {language === 'romanUrdu' ? 'Khatam' : 'End'}
                            </div>
                            <div className="relative">
                              <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full pl-8 pr-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-agri-green outline-none text-xs font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          type="button"
                          onClick={() => handleRemoveDiscount(editingProduct.id)}
                          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-all border border-red-200"
                        >
                          {t('admin.remove')}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveDirectEdit}
                          className="flex-[2] bg-agri-green text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-lg shadow-agri-green/20"
                        >
                          <Save className="w-4 h-4" />
                          <span>{language === 'romanUrdu' ? 'Direct Apply Karein' : 'Apply Changes'}</span>
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
