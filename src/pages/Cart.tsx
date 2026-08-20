import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, MessageSquare, CheckCircle, MapPin, CreditCard, Truck, ArrowRight, ShoppingCart, Mail, Home, ExternalLink, Wheat } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { isPunjabCity } from '../utils/categoryMatcher';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, getCurrentPriceData } = useCart();
  const { allProducts } = useProducts();
  const { language, t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash' | 'easypaisa' | 'cod'>('cod');
  const [city, setCity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTime, setOrderTime] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOrderComplete) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2d6a2d', '#f27d26', '#ffffff']
      });
    }
  }, [isOrderComplete]);

  const punjabCities = [
    "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Multan", "Sialkot",
    "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang", "Rahim Yar Khan", "Gujarat",
    "Sahiwal", "Wazirabad", "Kasur", "Okara", "Khanewal", "Hafizabad",
    "Chiniot", "Vehari", "Narowal", "Mianwali", "Pakpattan", "Attock",
    "Chakwal", "Jhelum", "Khushab", "Muzaffargarh", "Layyah", "Lodhran"
  ];

  const getMultiplier = (weight: string) => {
    if (weight.includes('kg')) return parseFloat(weight);
    if (weight.includes('g')) return parseFloat(weight) / 1000;
    return 1;
  };

  const deliveryCharges = 0;
  const codCharges = 0;
  const grandTotal = cartTotal + deliveryCharges + codCharges;

  const handleWhatsAppOrder = (finalOrderNum?: string) => {
    const targetNum = "+923019515764".replace('+', '');
    const numToDisplay = finalOrderNum || orderNumber || "AGC0001";
    
    let message = `🌿 *AgriConnect - Naya Order!* 🌿\n\n`;
    message += `📋 *Order Number:* ${numToDisplay}\n`;
    message += `👤 *Customer:* ${customerName}\n`;
    message += `📱 *Phone:* ${phone}\n`;
    message += `💬 *WhatsApp:* ${whatsapp}\n\n`;
    
    message += `📦 *Order Details:*\n`;
    cartItems.forEach(item => {
      const priceData = getCurrentPriceData(item.name, item.price);
      const itemTotal = priceData.finalPrice * item.quantity * getMultiplier(item.selectedWeight);
      
      if (priceData.discount > 0) {
        message += `${item.name} (${priceData.discount}% OFF): Rs. ${priceData.originalPrice} -> Rs. ${priceData.finalPrice} x ${item.quantity} = Rs. ${itemTotal}\n`;
      } else {
        message += `${item.name} - ${item.selectedWeight} - ${item.quantity} - Rs.${itemTotal}\n`;
      }
    });
    
    message += `\n💰 *Subtotal:* Rs.${cartTotal}`;
    message += `\n🚚 *Delivery:* Free`;
    message += `\n*Total:* Rs.${grandTotal}\n\n`;
    
    message += `📍 *Delivery Pata:*\n${address}\n${area ? area + ', ' : ''}${city}, Punjab\n\n`;
    message += `💳 *Payment Method:* ${paymentMethod.toUpperCase()}\n\n`;
    message += `Shukriya AgriConnect ko choose karne ka! Hum jald delivery karein gay! 🌾`;
    
    window.open(`https://wa.me/${targetNum}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailOrder = (finalOrderNum?: string) => {
    const numToUse = finalOrderNum || orderNumber;
    const subject = `AgriConnect - Order ${numToUse} Confirm Ho Gaya! 🌿`;
    const today = new Date().toLocaleDateString('en-PK');
    const time = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
    
    let body = `Assalam o Alaikum ${customerName}!\n\n`;
    body += `🎉 Aapka Order Confirm Ho Gaya!\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `📋 ORDER DETAILS\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    body += `Order Number: ${numToUse}\n`;
    body += `Order Date: ${today}\n`;
    body += `Order Time: ${time}\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `🛒 AAPNE ORDER KIYA\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    cartItems.forEach(item => {
      const priceData = getCurrentPriceData(item.name, item.price);
      const itemTotal = priceData.finalPrice * item.quantity * getMultiplier(item.selectedWeight);
      
      if (priceData.discount > 0) {
        body += `${item.name} (${priceData.discount}% OFF): Rs. ${priceData.originalPrice} -> Rs. ${priceData.finalPrice} x ${item.quantity} = Rs. ${itemTotal}\n`;
      } else {
        body += `${item.name} - ${item.selectedWeight} x ${item.quantity} = Rs.${itemTotal}\n`;
      }
    });
    
    body += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `💰 PAYMENT SUMMARY\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    body += `Subtotal:     Rs.${cartTotal}\n`;
    body += `Delivery:     Free\n`;
    body += `──────────────────────\n`;
    body += `Total:        Rs.${grandTotal}\n\n`;
    body += `Payment Method: ${paymentMethod.toUpperCase()}\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `📍 DELIVERY ADDRESS\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    body += `${customerName}\n`;
    body += `${address}\n`;
    body += `${area}, ${city}, Punjab\n`;
    body += `Phone: ${phone}\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `📞 HUMSE RABTA KAREIN\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    body += `WhatsApp: +92 301 9515764\n`;
    body += `Email: ahmedmuneeb036@gmail.com\n`;
    body += `Address: Main Market, Tarikha, Gujrat, Punjab\n\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    body += `Hum 24-48 ghanton mein deliver karein gay!\n\n`;
    body += `Shukriya AgriConnect ko choose karne ka! 🌿\n\n`;
    body += `AgriConnect Team\n`;
    body += `www.agriconnect.pk`;

    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const saveOrderToFirebase = async (orderData: any) => {
    try {
      const firebaseModules = (window as any).firebaseModules;
      const db = (window as any).db;
      
      // Get current order number
      const counterDoc = await firebaseModules.getDoc(
        firebaseModules.doc(db, "adminData", "orderCounter")
      );
      
      let orderNum = 1;
      if(counterDoc.exists()){
        orderNum = counterDoc.data().count + 1;
      }
      
      // Format order number AGC0001
      const orderNumber = "AGC" + String(orderNum).padStart(4, "0");
      
      // Get logged in user
      const acUser = JSON.parse(localStorage.getItem("ac_user") || "{}");
      
      // Save order to Firestore
      await firebaseModules.addDoc(
        firebaseModules.collection(db, "orders"),
        {
          orderNumber: orderNumber,
          orderDate: new Date(),
          orderTime: new Date().toLocaleTimeString(),
          customerCity: orderData.city,
          customerProvince: isPunjabCity(orderData.city) ? "Punjab" : "Other",
          
          customerInfo: {
            uid: acUser.uid || "guest",
            name: orderData.customerName,
            phone: orderData.phone,
            whatsapp: orderData.whatsapp,
            email: acUser.email || ""
          },
          
          deliveryAddress: {
            city: orderData.city,
            province: isPunjabCity(orderData.city) ? "Punjab" : "Other",
            area: orderData.area,
            address: orderData.address,
            landmark: orderData.landmark
          },
          
          products: orderData.products.map((p: any) => ({
            name: p.name,
            category: p.category,
            quantity: p.quantity,
            weight: p.selectedWeight,
            originalPrice: p.price,
            discount: 0, // Should be calculated if available
            finalPrice: p.price,
            totalPrice: p.price * p.quantity
          })),
          
          orderSummary: {
            subtotal: orderData.subtotal,
            deliveryCharges: 0,
            total: orderData.subtotal
          },
          
          paymentMethod: orderData.paymentMethod,
          paymentStatus: "Pending",
          orderStatus: "Received",
          
          trackingStages: {
            received: new Date(),
            preparing: null,
            onTheWay: null,
            delivered: null
          },
          
          createdAt: new Date()
        }
      );
      
      // Update order counter
      await firebaseModules.setDoc(
        firebaseModules.doc(db, "adminData", "orderCounter"),
        { count: orderNum }
      );
      
      // Update localStorage order number
      localStorage.setItem("ac_last_order", orderNumber);
      
      return orderNumber;
      
    } catch(error) {
      console.error("Order save error:", error);
      return "AGC" + Math.floor(Math.random() * 9000 + 1000);
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalOrderNum = await saveOrderToFirebase({
      customerName,
      phone,
      whatsapp,
      city,
      area,
      address,
      landmark,
      products: cartItems,
      subtotal: cartTotal,
      paymentMethod
    });
    
    const now = new Date();
    setOrderNumber(finalOrderNum);
    setOrderDate(now.toLocaleDateString('en-PK'));
    setOrderTime(now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }));
    
    setIsOrderComplete(true);
    
    // Automatically open WhatsApp AND Email
    setTimeout(() => {
      handleWhatsAppOrder(finalOrderNum);
      handleEmailOrder(finalOrderNum);
    }, 1000);
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      'Sabziyaan': 'cat.vegetables',
      'Vegetables': 'cat.vegetables',
      'Phal': 'cat.fruits',
      'Fruits': 'cat.fruits',
      'Dry Fruits': 'cat.dryfruits',
      'Anaaj': 'cat.grains',
      'Grains': 'cat.grains'
    };
    return t(map[cat] || cat);
  };

  if (cartItems.length === 0 && !isOrderComplete) {
    return (
      <div className="pt-[72px] min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="bg-agri-green/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-agri-green" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-500 mb-8 font-medium">{t('cart.empty.sub')}</p>
          <Link 
            to="/sabziyaan" 
            className="inline-flex items-center gap-2 bg-agri-green text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20"
          >
            {t('cart.shopping.start')} <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative h-48 md:h-64 flex items-center justify-center overflow-hidden ac-fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920)' }}
        >
          <div className="absolute inset-0 bg-agri-green/80 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-2"
          >
            {t('cart.title')}
          </motion.h1>
          <p className="text-lg md:text-xl text-white/90 font-medium">{t('cart.subtitle')}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Products List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-agri-green" />
                  {t('cart.products.title')} ({cartItems.length})
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-sm font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> {t('cart.clear')}
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, idx) => {
                  const delayClass = `ac-delay-${(idx % 4) + 1}`;
                  return (
                    <div key={`${item.id}-${item.selectedWeight}`} className={`p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50/50 transition-colors ac-slide-left ${delayClass}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full md:w-32 h-32 object-cover rounded-2xl shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                          <span className="text-xs font-bold text-agri-green bg-agri-green/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedWeight)}
                          className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> {t('cart.remove')}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">{t('wazan')}</p>
                            <span className="font-bold text-gray-700">{item.selectedWeight}</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">{t('quantity.label')}</p>
                            <div className="flex items-center gap-3 bg-white border rounded-xl px-3 py-1">
                              <button onClick={() => updateQuantity(item.id, item.selectedWeight, -1)} className="hover:text-agri-green transition-colors"><Minus className="w-4 h-4" /></button>
                              <span className="font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.selectedWeight, 1)} className="hover:text-agri-green transition-colors"><Plus className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-1">{t('total.price')}</p>
                          {(() => {
                            const priceData = getCurrentPriceData(item.name, item.price);
                            const itemTotal = priceData.finalPrice * item.quantity * getMultiplier(item.selectedWeight);
                            const originalItemTotal = priceData.originalPrice * item.quantity * getMultiplier(item.selectedWeight);

                            return (
                              <div className="flex flex-col items-end">
                                {priceData.discount > 0 && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-lg">
                                      {priceData.discount}% OFF
                                    </span>
                                    <span className="text-sm text-gray-400 line-through font-bold">
                                      Rs. {originalItemTotal}
                                    </span>
                                  </div>
                                )}
                                <span className={cn("text-xl font-black", priceData.discount > 0 ? "text-green-600" : "text-agri-green")}>
                                  Rs. {itemTotal}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address Form */}
            <form id="checkout-form" onSubmit={handleCompleteOrder} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 ac-slide-up ac-delay-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <MapPin className="w-7 h-7 text-agri-green" />
                {t('cart.address.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart.address.name')}</label>
                  <input 
                    type="text" 
                    required 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'romanUrdu' ? "Apna poora naam likhain" : "Enter your full name"} 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart.address.phone')}</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000" 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart.address.whatsapp')}</label>
                  <input 
                    type="tel" 
                    required 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+92 300 0000000" 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{language === 'romanUrdu' ? 'Email Address' : 'Email Address'}</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com" 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart.address.city')}</label>
                  <select 
                    required 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none appearance-none"
                  >
                    <option value="">{t('cart.address.city')}</option>
                    {punjabCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart.address.area')}</label>
                  <input 
                    type="text" 
                    required 
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder={language === 'romanUrdu' ? "Area ka naam" : "Area name"} 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart.address.complete')}</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={language === 'romanUrdu' ? "Ghar ka mukammal pata likhain" : "Enter complete street address"} 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart.address.landmark')}</label>
                  <input 
                    type="text" 
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder={language === 'romanUrdu' ? "Mishal ke tor par: Masjid ke kareeb" : "e.g. Near Mosque"} 
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Side: Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 sticky top-[100px] ac-slide-right ac-delay-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cart.summary.title')}</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-bold">Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('cart.delivery')}</span>
                  <span className="font-bold text-green-600">{t('cart.free')}</span>
                </div>
                <div className="bg-green-50/50 p-3 rounded-xl border border-green-100/50 space-y-1">
                  <p className="text-[10px] font-bold text-agri-green/60 uppercase tracking-tight">{t('cart.delivery.lahore')}</p>
                  <p className="text-[10px] font-bold text-agri-green/60 uppercase tracking-tight">{t('cart.delivery.punjab')}</p>
                  <p className="text-[10px] font-bold text-agri-green/60 uppercase tracking-tight">{t('cart.delivery.pakistan')}</p>
                </div>
                <div className="pt-4 border-t border-dashed flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">{t('cart.total')}</span>
                  <span className="text-3xl font-black text-agri-green">Rs. {grandTotal}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8 ac-slide-up ac-delay-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-agri-green" />
                  {t('cart.payment.title')}
                </h3>
                <div className="space-y-3">
                  {[
                    { id: 'jazzcash', name: 'JazzCash', emoji: '📱', color: '#e91e63' },
                    { id: 'easypaisa', name: 'EasyPaisa', emoji: '💚', color: '#4caf50' },
                    { id: 'cod', name: t('cart.payment.cod'), icon: <Truck className="w-6 h-6" />, emoji: '💵' }
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all",
                        paymentMethod === method.id ? "border-agri-green bg-agri-green/5" : "border-gray-100 hover:border-agri-green/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id as any)}
                          className="w-4 h-4 text-agri-green focus:ring-agri-green"
                        />
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '20px' }}>{method.emoji}</span>
                          <span style={{ fontWeight: 700, color: method.color || 'inherit' }}>{method.name}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Payment Instructions */}
                <AnimatePresence mode="wait">
                  {paymentMethod === 'jazzcash' && (
                    <motion.div 
                      key="jazzcash"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-agri-green/5 rounded-2xl border border-agri-green/20 space-y-4 overflow-hidden"
                    >
                      <p className="text-xs text-agri-green font-bold uppercase tracking-wider">{language === 'romanUrdu' ? 'Hidayat' : 'Instructions'}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t('cart.jazzcash.instructions')}
                      </p>
                      <div className="space-y-3">
                        <input type="text" placeholder={t('cart.jazzcash.number')} className="w-full px-3 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-1 focus:ring-agri-green" />
                        <input type="text" placeholder={t('cart.jazzcash.name')} className="w-full px-3 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-1 focus:ring-agri-green" />
                      </div>
                    </motion.div>
                  )}
                  {paymentMethod === 'easypaisa' && (
                    <motion.div 
                      key="easypaisa"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-agri-green/5 rounded-2xl border border-agri-green/20 space-y-4 overflow-hidden"
                    >
                      <p className="text-xs text-agri-green font-bold uppercase tracking-wider">{language === 'romanUrdu' ? 'Hidayat' : 'Instructions'}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t('cart.easypaisa.instructions')}
                      </p>
                      <div className="space-y-3">
                        <input type="text" placeholder={t('cart.easypaisa.number')} className="w-full px-3 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-1 focus:ring-agri-green" />
                        <input type="text" placeholder={t('cart.easypaisa.name')} className="w-full px-3 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-1 focus:ring-agri-green" />
                      </div>
                    </motion.div>
                  )}
                  {paymentMethod === 'cod' && (
                    <motion.div 
                      key="cod"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden"
                    >
                      <p className="text-sm text-gray-600 font-bold mb-1">
                        {t('cart.cod.message')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-4 ac-zoom-in ac-delay-3">
                <button 
                  onClick={() => handleWhatsAppOrder()}
                  className="w-full bg-agri-green text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20"
                >
                  <MessageSquare className="w-6 h-6" />
                  {t('cart.order.whatsapp')}
                </button>
                <button 
                  form="checkout-form"
                  type="submit"
                  className="w-full bg-agri-orange text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-agri-orange/20"
                >
                  {t('cart.order.complete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Success Popup */}
      <AnimatePresence>
        {isOrderComplete && (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative bg-white rounded-[20px] w-[90%] max-w-[480px] max-h-[85vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <button 
                onClick={() => setIsOrderComplete(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '50%',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100
                }}>
                ✕
              </button>
              {/* Header / Top Info - Scrollable */}
              <div className="flex-1 overflow-y-auto p-[30px_24px]">
                {/* AgriConnect Logo */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-agri-green p-1.5 rounded-lg">
                      <Wheat className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-serif font-bold text-agri-green">AgriConnect</span>
                  </div>
                </div>

                {/* Animated Checkmark */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg"
                >
                  <motion.div
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <CheckCircle className="w-12 h-12 text-agri-green" />
                  </motion.div>
                </motion.div>

                <div className="space-y-4 text-center">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 leading-tight">
                    {language === 'romanUrdu' ? 'Order Place Ho Gaya!' : 'Order Placed Successfully!'}
                  </h2>
                  
                  <p className="text-xl font-bold font-serif text-agri-green">
                    {language === 'romanUrdu' ? `🎉 Shukriya ${customerName}!` : `🎉 Thank You ${customerName}!`}
                  </p>

                  <div className="bg-agri-green/5 rounded-2xl p-4 border border-agri-green/10 my-4 text-left">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {language === 'romanUrdu' ? '📋 Order Number' : '📋 Order Number'}
                      </p>
                      <p className="text-lg font-black text-agri-green tracking-tight">{orderNumber}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {language === 'romanUrdu' ? '📅 Tarikh' : '📅 Date'}: <span className="text-gray-600 ml-1 font-bold">{orderDate}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {language === 'romanUrdu' ? '⏰ Waqt' : '⏰ Time'}: <span className="text-gray-600 ml-1 font-bold">{orderTime}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-left bg-gray-50 rounded-xl p-4 border border-gray-100 italic">
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-agri-green" />
                      {language === 'romanUrdu' 
                        ? '💬 Aapko WhatsApp par confirmation message bheja ja raha hai...' 
                        : '💬 WhatsApp confirmation message is being sent...'}
                    </p>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                      <Mail className="w-3 h-3 text-blue-500" />
                      {language === 'romanUrdu' 
                        ? '📧 Aapki email par bhi confirmation bheji ja rahi hai...' 
                        : '📧 Email confirmation is being sent...'}
                    </p>
                    <p className="text-xs text-agri-green font-bold flex items-center gap-2 mt-2 not-italic">
                      <Truck className="w-3 h-3" />
                      {language === 'romanUrdu' 
                        ? '🚚 Hum 24-48 ghanton mein deliver karein gay!' 
                        : '🚚 We will deliver within 24-48 hours!'}
                    </p>
                  </div>

                  {/* Delivery Tracking Section */}
                  <div className="mt-8 border-t pt-6 text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-agri-green" />
                      {language === 'romanUrdu' ? 'Aapki Delivery Track Karein' : 'Track Your Delivery'}
                    </h3>

                    {/* Timeline */}
                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                      {/* Stage 1: Received */}
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {language === 'romanUrdu' ? 'Order Receive Ho Gaya' : 'Order Received'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {language === 'romanUrdu' ? 'Aapka order hamare paas pahunch gaya hai' : 'Your order has been received'}
                          </p>
                          <p className="text-[10px] font-bold text-agri-green mt-1">{orderTime}</p>
                        </div>
                      </div>

                      {/* Stage 2: Preparing */}
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center z-10 animate-pulse">
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 italic">
                            {language === 'romanUrdu' ? 'Order Tayyar Ho Raha Hai' : 'Preparing Your Order'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {language === 'romanUrdu' ? 'Hamare staff ne tayyari shuru kar di hai' : 'Our staff has started preparation'}
                          </p>
                          <p className="text-[10px] font-bold text-orange-500 mt-1">Expected: 30-60 minutes</p>
                        </div>
                      </div>

                      {/* Stage 3: Rider */}
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center z-10" />
                        <div>
                          <p className="font-bold text-gray-400">
                            {language === 'romanUrdu' ? 'Rider Rasta Mein Hai' : 'Rider On The Way'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {language === 'romanUrdu' ? 'Rider aapki taraf aa raha hai' : 'Rider is coming towards you'}
                          </p>
                        </div>
                      </div>

                      {/* Stage 4: Delivered */}
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center z-10" />
                        <div>
                          <p className="font-bold text-gray-400">
                            {language === 'romanUrdu' ? 'Delivery Ho Gayi' : 'Delivered'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rider Info Box */}
                    <div className="mt-8 bg-green-50 rounded-2xl p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-agri-green/10 flex items-center justify-center">
                          <span className="text-2xl">🛵</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-agri-green uppercase tracking-wider">
                            {language === 'romanUrdu' ? 'Rider Ki Maalumat' : 'Rider Information'}
                          </p>
                          <p className="font-bold text-gray-900">Ahmed (AgriConnect Rider)</p>
                          <p className="text-xs text-gray-600">+92 301 9515764</p>
                        </div>
                      </div>
                      <a 
                        href="https://wa.me/923019515764" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full bg-white border border-agri-green text-agri-green py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-agri-green hover:text-white transition-all shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {language === 'romanUrdu' ? 'Rider Say Baat Karein' : 'Chat with Rider'}
                      </a>
                    </div>

                    {/* Shop Location Box */}
                    <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                          📍
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                            {language === 'romanUrdu' ? 'Dispatch Location' : 'Dispatch Location'}
                          </p>
                          <p className="font-bold text-gray-900 leading-none">AgriConnect Shop</p>
                          <p className="text-[10px] text-gray-600 mt-1">Main Market, Tarikha, Gujrat</p>
                        </div>
                        <a 
                          href="https://maps.app.goo.gl/aFpiFweQEq9xpjbC6" 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-white p-2 rounded-lg border text-agri-green hover:bg-agri-green hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Map Embed */}
                      <iframe
                        src="https://maps.google.com/maps?q=Main+Market+Tarikha+Gujrat+Punjab+Pakistan&output=embed&z=13"
                        width="100%"
                        height="160"
                        style={{ border: 0, borderRadius: '12px', marginTop: '12px' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="AgriConnect Shop Location"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer Button */}
              <div className="p-6 bg-white border-t relative z-20 shrink-0">
                <button 
                  onClick={() => {
                    clearCart();
                    setIsOrderComplete(false);
                    navigate('/');
                    window.scrollTo(0, 0);
                  }}
                  className="w-full bg-agri-green text-white py-[14px] rounded-[10px] font-bold text-base hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20"
                >
                  {language === 'romanUrdu' ? 'Ghar Wapas Jayein' : 'Go To Home'}
                </button>
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
                  AgriConnect Team
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
