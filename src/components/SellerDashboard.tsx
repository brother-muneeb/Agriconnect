import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Edit3, 
  LogOut, 
  Plus, 
  Search, 
  RefreshCw, 
  Filter, 
  X, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PRODUCT_CATEGORIES, 
  doesItemMatchSeller, 
  filterOrderForSeller 
} from '../utils/categoryMatcher';

interface SellerData {
  uid: string;
  ownerName: string;
  shopName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  cnic?: string;
  businessType?: string;
  city?: string;
  area?: string;
  address?: string;
  landmark?: string;
  products?: string[];
  deliveryRange?: string;
  isApproved?: boolean;
  avatarColor?: string;
  createdAt?: any;
}

interface OrderItem {
  id: string;
  orderNumber: string;
  orderDate?: any;
  orderTime?: string;
  customerInfo?: {
    name?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  deliveryAddress?: {
    city?: string;
    area?: string;
    address?: string;
    landmark?: string;
  };
  products?: Array<{
    name: string;
    category?: string;
    quantity: number;
    weight?: string;
    finalPrice?: number;
    totalPrice?: number;
  }>;
  orderSummary?: {
    subtotal?: number;
    deliveryCharges?: number;
    total?: number;
  };
  status?: 'pending' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
}

export const SellerDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isUrdu = language === 'romanUrdu';

  const [seller, setSeller] = useState<SellerData | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'profile'>('overview');
  
  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<SellerData>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Add Product State
  const [newProductInput, setNewProductInput] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load seller data from Firebase
  useEffect(() => {
    let unsubscribeOrders: (() => void) | undefined;

    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('ac_user');
        let uid = '';
        let localData: any = {};

        if (storedUser) {
          try {
            localData = JSON.parse(storedUser);
            uid = localData.uid || '';
          } catch (e) {
            console.error('Failed to parse local user', e);
          }
        }

        if (!uid && auth.currentUser) {
          uid = auth.currentUser.uid;
        }

        if (!uid) {
          setLoading(false);
          return;
        }

        // Fetch from sellers collection first
        const sellerDocRef = doc(db, 'sellers', uid);
        const sellerSnap = await getDoc(sellerDocRef);

        if (sellerSnap.exists()) {
          const sData = sellerSnap.data() as SellerData;
          setSeller(sData);
          setEditForm(sData);
        } else {
          // Fallback to users collection if not yet in sellers
          const userDocRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const uData = userSnap.data() as any;
            const fallbackSeller: SellerData = {
              uid,
              ownerName: uData.fullName || uData.ownerName || 'Kisan Seller',
              shopName: uData.shopName || `${uData.fullName || 'Kisan'}'s Fresh Farm`,
              email: uData.email || '',
              phone: uData.phone || '',
              whatsapp: uData.whatsapp || uData.phone || '',
              city: uData.city || 'Punjab',
              area: uData.area || '',
              address: uData.address || '',
              products: uData.products || ['Grains'],
              deliveryRange: uData.deliveryRange || 'Punjab Province',
              isApproved: true,
              avatarColor: localData.avatarColor || '#e65100'
            };
            setSeller(fallbackSeller);
            setEditForm(fallbackSeller);
          } else if (localData && localData.fullName) {
            const fallback: SellerData = {
              uid,
              ownerName: localData.fullName || 'Kisan Seller',
              shopName: localData.shopName || `${localData.fullName}'s Farm`,
              email: localData.email || '',
              phone: localData.phone || '',
              city: localData.city || 'Punjab',
              products: localData.products || ['Grains'],
              isApproved: true
            };
            setSeller(fallback);
            setEditForm(fallback);
          }
        }
      } catch (err) {
        console.error('Error fetching seller data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();

    // Listen to orders collection in Firestore
    try {
      const ordersCol = collection(db, 'orders');
      unsubscribeOrders = onSnapshot(ordersCol, (snapshot) => {
        const fetchedOrders: OrderItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          fetchedOrders.push({
            id: docSnap.id,
            orderNumber: data.orderNumber || docSnap.id.slice(0, 8).toUpperCase(),
            orderDate: data.orderDate,
            orderTime: data.orderTime || '',
            customerInfo: data.customerInfo || {},
            deliveryAddress: data.deliveryAddress || {},
            products: data.products || [],
            orderSummary: data.orderSummary || { total: 0 },
            status: data.status || 'pending'
          });
        });
        setOrders(fetchedOrders);
        setOrdersLoading(false);
      }, (error) => {
        console.warn('Orders listener notice:', error);
        setOrdersLoading(false);
      });
    } catch (e) {
      console.warn('Could not attach orders listener:', e);
      setOrdersLoading(false);
    }

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderItem['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Toggle category on/off for seller
  const handleToggleCategory = (categoryNameOrKey: string) => {
    if (!seller) return;
    const current = seller.products || [];
    const exists = current.some(p => p.toLowerCase() === categoryNameOrKey.toLowerCase());
    const updated = exists 
      ? current.filter(p => p.toLowerCase() !== categoryNameOrKey.toLowerCase())
      : [...current, categoryNameOrKey];

    const updatedSeller = { ...seller, products: updated };
    setSeller(updatedSeller);
    setEditForm(prev => ({ ...prev, products: updated }));

    try {
      const sellerRef = doc(db, 'sellers', seller.uid);
      updateDoc(sellerRef, { products: updated });
    } catch (e) {
      console.error('Error updating category in Firestore:', e);
    }
  };

  // Save profile edits
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;
    setIsSavingProfile(true);

    try {
      const uid = seller.uid;
      const updatedData = {
        ...seller,
        ...editForm,
      };

      // Update sellers doc
      const sellerRef = doc(db, 'sellers', uid);
      await updateDoc(sellerRef, {
        ownerName: editForm.ownerName || seller.ownerName,
        shopName: editForm.shopName || seller.shopName,
        phone: editForm.phone || seller.phone,
        whatsapp: editForm.whatsapp || seller.whatsapp || '',
        city: editForm.city || seller.city || '',
        area: editForm.area || seller.area || '',
        address: editForm.address || seller.address || '',
        landmark: editForm.landmark || seller.landmark || '',
        deliveryRange: editForm.deliveryRange || seller.deliveryRange || 'Punjab',
        products: editForm.products || seller.products || []
      });

      // Also update users doc
      try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
          fullName: editForm.ownerName || seller.ownerName,
          shopName: editForm.shopName || seller.shopName,
          phone: editForm.phone || seller.phone,
          city: editForm.city || seller.city || ''
        });
      } catch (uErr) {
        console.warn('User doc update notice', uErr);
      }

      // Update local state and localStorage
      setSeller(updatedData as SellerData);
      const stored = localStorage.getItem('ac_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('ac_user', JSON.stringify({
          ...parsed,
          fullName: editForm.ownerName || seller.ownerName,
          shopName: editForm.shopName || seller.shopName,
          phone: editForm.phone || seller.phone,
          city: editForm.city || seller.city || ''
        }));
      }

      setProfileSuccessMsg(isUrdu ? 'Profile kamyabi se update ho gaya!' : 'Profile updated successfully!');
      setTimeout(() => {
        setProfileSuccessMsg('');
        setIsEditModalOpen(false);
      }, 1200);

      window.dispatchEvent(new Event('ac_user_updated'));
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Add a product tag
  const handleAddProduct = () => {
    if (!newProductInput.trim() || !seller) return;
    const currentProducts = seller.products || [];
    if (currentProducts.some(p => p.toLowerCase() === newProductInput.trim().toLowerCase())) return;

    const updated = [...currentProducts, newProductInput.trim()];
    const updatedSeller = { ...seller, products: updated };
    setSeller(updatedSeller);
    setEditForm(prev => ({ ...prev, products: updated }));
    setNewProductInput('');

    // Persist to Firestore
    try {
      const sellerRef = doc(db, 'sellers', seller.uid);
      updateDoc(sellerRef, { products: updated });
    } catch (e) {
      console.error(e);
    }
  };

  // Remove a product tag
  const handleRemoveProduct = (prodToRemove: string) => {
    if (!seller) return;
    const updated = (seller.products || []).filter(p => p !== prodToRemove);
    const updatedSeller = { ...seller, products: updated };
    setSeller(updatedSeller);
    setEditForm(prev => ({ ...prev, products: updated }));

    try {
      const sellerRef = doc(db, 'sellers', seller.uid);
      updateDoc(sellerRef, { products: updated });
    } catch (e) {
      console.error(e);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('ac_user');
    localStorage.removeItem('ac_avatar_color');
    sessionStorage.removeItem('lp');
    window.dispatchEvent(new Event('ac_user_updated'));
    window.location.href = '/';
  };

  // Process orders to filter ONLY items relevant to this seller's products/categories
  const sellerRelevantOrders = React.useMemo(() => {
    const sellerProds = seller?.products || [];
    if (sellerProds.length === 0) {
      return [];
    }
    return orders
      .map(o => filterOrderForSeller(o, sellerProds))
      .filter((o): o is NonNullable<typeof o> => o !== null);
  }, [orders, seller?.products]);

  // Calculate statistics from seller's relevant orders only
  const totalOrdersCount = sellerRelevantOrders.length;
  const pendingOrdersCount = sellerRelevantOrders.filter(o => o.status === 'pending' || !o.status).length;
  const deliveredOrdersCount = sellerRelevantOrders.filter(o => o.status === 'delivered').length;
  const totalRevenue = sellerRelevantOrders.reduce((acc, curr) => acc + (curr.sellerTotal || 0), 0);

  // Filter orders by search & status
  const filteredOrders = sellerRelevantOrders.filter(o => {
    if (orderFilter !== 'all' && (o.status || 'pending') !== orderFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber?.toLowerCase().includes(q);
      const matchName = o.customerInfo?.name?.toLowerCase().includes(q);
      const matchPhone = o.customerInfo?.phone?.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-agri-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg">
            {isUrdu ? 'Seller Dashboard load ho raha hai...' : 'Loading Seller Dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  const sellerName = seller?.ownerName || 'Kisan Seller';
  const shopName = seller?.shopName || 'AgriConnect Verified Farm';

  return (
    <div className="min-h-screen bg-[#f8faf7] dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Top Banner & Seller Header */}
      <div className="bg-gradient-to-r from-[#e65100] via-[#f57c00] to-[#2d6a2d] text-white py-10 px-4 md:px-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <Store className="w-96 h-96 text-white" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white text-agri-orange flex items-center justify-center text-3xl font-black shadow-xl border-4 border-white/20">
              {seller?.avatarColor ? (
                <div 
                  className="w-full h-full rounded-xl flex items-center justify-center text-white font-extrabold"
                  style={{ backgroundColor: seller.avatarColor || '#e65100' }}
                >
                  {shopName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <Store className="w-10 h-10 text-agri-orange" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {isUrdu ? 'Verified Seller' : 'Verified Seller'}
                </span>
                <span className="bg-green-600/80 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {isUrdu ? 'Live Store' : 'Live Store'}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold font-serif mt-1 tracking-tight">
                {isUrdu ? `Khush Amdeed, ${sellerName}!` : `Welcome Back, ${sellerName}!`}
              </h1>

              <div className="flex items-center gap-4 mt-2 text-white/90 text-sm flex-wrap">
                <span className="flex items-center gap-1.5 font-medium">
                  <Store className="w-4 h-4 text-orange-200" />
                  <strong className="text-white">{shopName}</strong>
                </span>
                {seller?.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-orange-200" />
                    {seller.city} {seller.area ? `(${seller.area})` : ''}
                  </span>
                )}
                {seller?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-orange-200" />
                    {seller.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end flex-wrap">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-3 px-5 rounded-xl border border-white/30 shadow-md transition-all text-sm"
            >
              <Edit3 className="w-4 h-4" />
              {isUrdu ? 'Profile Edit Karein' : 'Edit Profile'}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-xl shadow-md transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              {isUrdu ? 'Logout' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'overview'
                ? 'bg-agri-orange text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            {isUrdu ? 'Dashboard Overview' : 'Overview'}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'orders'
                ? 'bg-agri-orange text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {isUrdu ? `Orders (${totalOrdersCount})` : `Orders (${totalOrdersCount})`}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'products'
                ? 'bg-agri-orange text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Package className="w-4 h-4" />
            {isUrdu ? `Meri Products (${seller?.products?.length || 0})` : `My Products (${seller?.products?.length || 0})`}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'profile'
                ? 'bg-agri-orange text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Store className="w-4 h-4" />
            {isUrdu ? 'Shop Details' : 'Shop Details'}
          </button>
        </div>

        {/* Category Relevance Filter Banner */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-850 border border-orange-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-agri-orange text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 dark:text-white">
                  {isUrdu ? 'Aapke Mutalliqah Orders Filter:' : 'Category Order Routing:'}
                </span>
                <span className="bg-orange-100 dark:bg-orange-950/60 text-agri-orange font-extrabold px-2.5 py-0.5 rounded-full text-xs border border-orange-300 dark:border-orange-800">
                  {(seller?.products && seller.products.length > 0) ? seller.products.join(', ') : 'All Agricultural Products'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isUrdu 
                  ? 'Aapko sirf wahi orders dikhai denge jo aapke chune hue categories (jaise Anaaj / Grains) ke mutabiq hain. Dusri cheezein (jaise Sabziyaan, Phal) doosray sellers ko routed hain.'
                  : 'You only receive orders for items you have chosen to sell (e.g. Grains). Unrelated items (e.g. Onions, Vegetables) are routed to their respective sellers.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold bg-white dark:bg-gray-800 text-agri-orange hover:bg-orange-50 dark:hover:bg-gray-700 border border-orange-200 dark:border-gray-600 px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isUrdu ? 'Categories Badlein' : 'Manage Categories'}
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {isUrdu ? 'Kul Orders (Total)' : 'Total Orders'}
              </span>
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-agri-orange flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-3 text-gray-900 dark:text-white">
              {totalOrdersCount}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mt-2">
              <CheckCircle className="w-3.5 h-3.5" />
              {isUrdu ? 'Real-time database sync' : 'Real-time database sync'}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {isUrdu ? 'Pending Orders' : 'Pending Orders'}
              </span>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-3 text-amber-600">
              {pendingOrdersCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {isUrdu ? 'Fauri delivery tayari' : 'Awaiting fulfillment'}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {isUrdu ? 'Dastyab Products' : 'Products Listed'}
              </span>
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/40 text-agri-green flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-3 text-agri-green">
              {seller?.products?.length || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {isUrdu ? 'Mandi categories mein active' : 'Active in market'}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {isUrdu ? 'Kul Karobar / Value' : 'Total Value'}
              </span>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-3 text-gray-900 dark:text-white">
              Rs. {totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 font-semibold mt-2">
              {isUrdu ? 'Punjab Mandi connect' : 'Across all orders'}
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Products Quick Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-agri-orange" />
                    {isUrdu ? 'Aapki Dastyab Faslain aur Products' : 'Products You Sell'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {isUrdu ? 'Yeh items customers aapke shop par dekh aur khareed sakte hain.' : 'These items are available for customers to order from your shop.'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('products')}
                  className="text-sm font-bold text-agri-orange hover:text-orange-600 flex items-center gap-1"
                >
                  {isUrdu ? 'Manage Products' : 'Manage Products'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {(seller?.products && seller.products.length > 0) ? (
                  seller.products.map((prod, idx) => (
                    <div 
                      key={idx}
                      className="bg-orange-50 dark:bg-gray-700/60 text-agri-orange dark:text-orange-300 font-bold px-4 py-2 rounded-xl text-sm border border-orange-100 dark:border-gray-600 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-agri-orange"></span>
                      {prod}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-4">
                    {isUrdu ? 'Koi product add nahi kiya gaya. Profile edit mein ja kar add karein.' : 'No products listed yet. Click Manage Products to add.'}
                  </p>
                )}
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-agri-orange" />
                    {isUrdu ? 'Taza Orders (Recent Orders)' : 'Recent Orders'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {isUrdu ? 'Firebase database se taza orders ki tafseelat.' : 'Orders received from customers across Punjab.'}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-sm font-bold text-agri-orange hover:text-orange-600 flex items-center gap-1"
                >
                  {isUrdu ? 'Tamam Orders Dekhein' : 'View All Orders'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {ordersLoading ? (
                <div className="py-12 text-center text-gray-400">
                  <div className="w-8 h-8 border-3 border-agri-orange border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  {isUrdu ? 'Orders load ho rahe hain...' : 'Loading orders...'}
                </div>
              ) : sellerRelevantOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-bold text-gray-700 dark:text-gray-300">
                    {isUrdu ? 'Aapke selected products ke liye koi naya order nahi aaya.' : 'No orders for your listed categories yet.'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                    {isUrdu 
                      ? 'Jab customer aapke category ke products order karega, yahan live show hoga. Dusri categories (jaise Sabziyaan/Phal) unke mutalliqah sellers ko dikhayi deti hain.' 
                      : 'Orders containing your products will automatically appear here in real-time. Orders for other categories (e.g. Vegetables, Fruits) are routed to their respective sellers.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-400 text-xs uppercase font-semibold">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">{isUrdu ? 'Customer' : 'Customer'}</th>
                        <th className="pb-3">{isUrdu ? 'Your Products' : 'Your Items'}</th>
                        <th className="pb-3">{isUrdu ? 'Your Total' : 'Your Subtotal'}</th>
                        <th className="pb-3">{isUrdu ? 'Status' : 'Status'}</th>
                        <th className="pb-3 text-right">{isUrdu ? 'Action' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {sellerRelevantOrders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors">
                          <td className="py-4 font-mono font-bold text-agri-orange">
                            #{ord.orderNumber}
                          </td>
                          <td className="py-4">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {ord.customerInfo?.name || 'Customer'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {ord.customerInfo?.phone || ord.deliveryAddress?.city || 'Punjab'}
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="text-gray-700 dark:text-gray-300 max-w-xs truncate font-medium">
                              {ord.sellerItems && ord.sellerItems.length > 0 
                                ? ord.sellerItems.map(p => `${p.name} (${p.quantity}x)`).join(', ')
                                : 'Fresh Farm Items'}
                            </div>
                            {ord.products && ord.sellerItems && ord.products.length > ord.sellerItems.length && (
                              <div className="text-[10px] text-gray-400 italic mt-0.5">
                                +{ord.products.length - ord.sellerItems.length} other items in order (other sellers)
                              </div>
                            )}
                          </td>
                          <td className="py-4 font-bold text-gray-900 dark:text-white">
                            Rs. {(ord.sellerTotal || ord.orderSummary?.total || 0).toLocaleString()}
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                              ord.status === 'delivered' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                : ord.status === 'processing'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                : ord.status === 'dispatched'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {ord.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => {
                                const nextStatus = ord.status === 'pending' ? 'processing' : ord.status === 'processing' ? 'dispatched' : 'delivered';
                                handleUpdateOrderStatus(ord.id, nextStatus as any);
                              }}
                              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-agri-orange hover:text-white text-gray-700 dark:text-gray-200 font-bold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {ord.status === 'delivered' ? 'Completed' : 'Update Status'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isUrdu ? 'Tamam Orders Management' : 'All Customer Orders'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isUrdu ? 'Status change karein aur delivery track karein.' : 'Manage order fulfillment and customer details.'}
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isUrdu ? 'Search order / name / phone...' : 'Search order, name, phone...'}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-agri-orange"
                  />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="py-2 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-agri-orange"
                >
                  <option value="all">{isUrdu ? 'Tamam Status' : 'All Status'}</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {isUrdu ? 'Koi order nahi mila' : 'No matching orders found'}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {isUrdu ? 'Filter reset karein ya naye orders ka intezaar karein.' : 'Try changing your search or filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="bg-gray-50 dark:bg-gray-900/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4 hover:border-agri-orange transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div>
                        <span className="font-mono text-sm font-bold text-agri-orange">
                          #{ord.orderNumber}
                        </span>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {ord.orderTime || 'Just now'}
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        ord.status === 'delivered'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                          : ord.status === 'processing'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : ord.status === 'dispatched'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ord.status || 'pending'}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-1 text-sm">
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gray-400" />
                        {ord.customerInfo?.name || 'Customer'}
                      </div>
                      {ord.customerInfo?.phone && (
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <a href={`tel:${ord.customerInfo.phone}`} className="hover:underline text-agri-green">
                            {ord.customerInfo.phone}
                          </a>
                        </div>
                      )}
                      {ord.deliveryAddress?.address && (
                        <div className="text-xs text-gray-500 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{ord.deliveryAddress.address}, {ord.deliveryAddress.city}</span>
                        </div>
                      )}
                    </div>

                    {/* Ordered Items Matching Seller */}
                    <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-2">
                      <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 font-semibold mb-1">
                        <span>{isUrdu ? 'Aapke Products (Items for you):' : 'Your Matched Products:'}</span>
                        <span className="text-[11px] text-agri-orange font-bold">
                          {(ord.sellerItems || []).length} {isUrdu ? 'items' : 'item(s)'}
                        </span>
                      </div>
                      {(ord.sellerItems && ord.sellerItems.length > 0 ? ord.sellerItems : (ord.products || [])).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-gray-800 dark:text-gray-200 py-0.5">
                          <span className="font-medium">• {item.name} {item.weight ? `(${item.weight})` : ''} <span className="text-gray-500 font-normal">x {item.quantity}</span></span>
                          <span className="font-bold">Rs. {item.totalPrice || item.finalPrice || 0}</span>
                        </div>
                      ))}
                      
                      {ord.products && ord.sellerItems && ord.products.length > ord.sellerItems.length && (
                        <div className="bg-gray-50 dark:bg-gray-750 px-2.5 py-1.5 rounded-lg text-[11px] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <span>+ {ord.products.length - ord.sellerItems.length} other items in customer cart</span>
                          <span className="text-[10px] text-gray-400">Routed to other sellers</span>
                        </div>
                      )}

                      <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2 flex items-center justify-between font-bold text-sm text-gray-900 dark:text-white">
                        <span>{isUrdu ? 'Aapka Hissa (Your Total):' : 'Your Order Total:'}</span>
                        <span className="text-agri-orange text-base font-extrabold">Rs. {(ord.sellerTotal || ord.orderSummary?.total || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Status Changer Actions */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'processing')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          ord.status === 'processing'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100'
                        }`}
                      >
                        Processing
                      </button>

                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'dispatched')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          ord.status === 'dispatched'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100'
                        }`}
                      >
                        Dispatched
                      </button>

                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          ord.status === 'delivered'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100'
                        }`}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS & CATEGORIES MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isUrdu ? 'Aapki Dastyab Products aur Categories' : 'Products & Categories You Sell'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isUrdu 
                  ? 'Select karein ke aap kaunsi categories (e.g. Grains / Anaaj, Vegetables / Sabziyaan) aur specific items sell karte hain. Customer ke sirf mutalliqah orders aapko nazar aayenge.' 
                  : 'Select which categories and products you offer. Only orders matching your selections will be routed to your account.'}
              </p>
            </div>

            {/* Quick Category Selectors */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                {isUrdu ? 'Categories Select Karein (Orders Filtering):' : 'Main Agricultural Categories (Controls Order Routing):'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const isSelected = (seller?.products || []).some(
                    p => p.toLowerCase() === cat.key.toLowerCase() || 
                         p.toLowerCase() === cat.labelEN.toLowerCase() || 
                         p.toLowerCase() === cat.labelRU.toLowerCase()
                  );
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleToggleCategory(cat.key)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-agri-orange bg-orange-50/60 dark:bg-orange-950/30 ring-2 ring-agri-orange/30'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-xl">{cat.icon}</div>
                        <div className="font-bold text-sm text-gray-900 dark:text-white">
                          {isUrdu ? cat.labelRU : cat.labelEN}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">
                          {isUrdu ? cat.labelEN : cat.labelRU}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected 
                          ? 'bg-agri-orange text-white' 
                          : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom product tag adder */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                {isUrdu ? 'Specific Faslain ya Products Add Karein:' : 'Add Specific Items & Crops:'}
              </label>
              <div className="flex items-center gap-3 max-w-xl">
                <input
                  type="text"
                  value={newProductInput}
                  onChange={(e) => setNewProductInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddProduct()}
                  placeholder={isUrdu ? 'Product ka naam (e.g. Desi Gandum, Makai, Basmati Rice)...' : 'Type product name (e.g. Organic Wheat, Basmati Rice)...'}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-agri-orange"
                />
                <button
                  onClick={handleAddProduct}
                  className="bg-agri-orange hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  {isUrdu ? 'Add Item' : 'Add Item'}
                </button>
              </div>
            </div>

            {/* Current Active Products & Tags Grid */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                {isUrdu ? 'Aapke Active Items aur Categories:' : 'Currently Active on Your Shop:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(seller?.products && seller.products.length > 0) ? (
                  seller.products.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-agri-orange transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-agri-orange flex items-center justify-center font-bold">
                          🌱
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">
                            {p}
                          </div>
                          <span className="text-[11px] text-green-600 font-medium">
                            {isUrdu ? 'Active & Filtered' : 'Active for orders'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveProduct(p)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Remove product"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    {isUrdu ? 'Koi category ya product select nahi kiya gaya.' : 'No products or categories listed yet. Click a category above to start receiving orders.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SHOP DETAILS & PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isUrdu ? 'Shop Profile & Information' : 'Shop & Business Profile'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isUrdu ? 'Aapka Firebase registered seller record.' : 'Your official verified business information.'}
                </p>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-agri-orange hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <Edit3 className="w-4 h-4" />
                {isUrdu ? 'Edit Profile' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-base text-agri-orange flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  {isUrdu ? 'Shop & Owner Information' : 'Shop & Owner'}
                </h3>
                <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Shop Name:</strong> {shopName}</p>
                  <p><strong>Owner Name:</strong> {sellerName}</p>
                  <p><strong>Business Type:</strong> {seller?.businessType || 'Farmer & Supplier'}</p>
                  <p><strong>Account Status:</strong> <span className="text-green-600 font-bold">Verified & Active</span></p>
                </div>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-base text-agri-green flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {isUrdu ? 'Location & Contact' : 'Location & Contact'}
                </h3>
                <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> {seller?.email || 'Registered via Email'}</p>
                  <p><strong>Phone:</strong> {seller?.phone || 'Not specified'}</p>
                  <p><strong>WhatsApp:</strong> {seller?.whatsapp || seller?.phone || 'Not specified'}</p>
                  <p><strong>City / Province:</strong> {seller?.city || 'Punjab'}</p>
                  <p><strong>Delivery Range:</strong> {seller?.deliveryRange || 'Punjab Province'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-agri-orange" />
                  {isUrdu ? 'Seller Profile Edit Karein' : 'Edit Seller Profile'}
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {profileSuccessMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {profileSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isUrdu ? 'Owner Name (Aapka Naam)' : 'Owner Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.ownerName || ''}
                      onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-agri-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isUrdu ? 'Shop Name (Dukan ka Naam)' : 'Shop Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.shopName || ''}
                      onChange={(e) => setEditForm({ ...editForm, shopName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-agri-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isUrdu ? 'Phone Number' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-agri-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isUrdu ? 'WhatsApp Number' : 'WhatsApp Number'}
                    </label>
                    <input
                      type="tel"
                      value={editForm.whatsapp || ''}
                      onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-agri-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isUrdu ? 'City (Shehar)' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={editForm.city || ''}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-agri-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {isUrdu ? 'Area / Tehsil' : 'Area / Tehsil'}
                    </label>
                    <input
                      type="text"
                      value={editForm.area || ''}
                      onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-agri-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {isUrdu ? 'Full Address (Pura Pata)' : 'Full Address'}
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-agri-orange"
                  />
                </div>

                {/* Product Categories in Edit Modal */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {isUrdu ? 'Aapki Selling Categories (Order Routing)' : 'Products & Categories You Sell'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRODUCT_CATEGORIES.map((cat) => {
                      const isChecked = (editForm.products || seller?.products || []).some(
                        p => p.toLowerCase() === cat.key.toLowerCase() || 
                             p.toLowerCase() === cat.labelEN.toLowerCase() || 
                             p.toLowerCase() === cat.labelRU.toLowerCase()
                      );
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => {
                            const current = editForm.products || seller?.products || [];
                            const exists = current.some(p => p.toLowerCase() === cat.key.toLowerCase());
                            const updated = exists 
                              ? current.filter(p => p.toLowerCase() !== cat.key.toLowerCase())
                              : [...current, cat.key];
                            setEditForm({ ...editForm, products: updated });
                          }}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-colors ${
                            isChecked
                              ? 'border-agri-orange bg-orange-50 text-agri-orange dark:bg-orange-950/40'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>{cat.icon}</span>
                            <span>{isUrdu ? cat.labelRU : cat.labelEN}</span>
                          </span>
                          {isChecked && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                  >
                    {isUrdu ? 'Cancel' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-agri-orange hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingProfile && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {isUrdu ? 'Save Changes' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboard;
