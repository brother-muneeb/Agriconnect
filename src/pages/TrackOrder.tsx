import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, Search, CheckCircle, MessageSquare, ExternalLink, MapPin, Wheat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

const TrackOrder = () => {
  const { language } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) {
      setShowResult(true);
    }
  };

  const stages = [
    {
      id: 1,
      titleRU: "Order Receive Ho Gaya",
      titleEN: "Order Received",
      descRU: "Aapka order hamare paas pahunch gaya hai",
      descEN: "Your order has been received",
      status: 'completed',
      time: '12:45 PM'
    },
    {
      id: 2,
      titleRU: "Order Tayyar Ho Raha Hai",
      titleEN: "Preparing Your Order",
      descRU: "Hamere staff ne tayyari shuru kar di hai",
      descEN: "Our staff has started preparation",
      status: 'current',
      info: "Expected: 30-60 minutes"
    },
    {
      id: 3,
      titleRU: "Rider Rasta Mein Hai",
      titleEN: "Rider On The Way",
      descRU: "Rider aapki taraf aa raha hai",
      descEN: "Rider is coming towards you",
      status: 'pending'
    },
    {
      id: 4,
      titleRU: "Delivery Ho Gayi",
      titleEN: "Delivered",
      descRU: "Aapka order deliver ho gaya",
      descEN: "Your order has been delivered",
      status: 'pending'
    }
  ];

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Search Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl text-center mb-12 ac-zoom-in"
      >
        <div className="bg-agri-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8 text-agri-green" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
          {language === 'romanUrdu' ? 'Apna Order Track Karein' : 'Track Your Order'}
        </h1>
        <p className="text-gray-600 mb-8 font-medium">
          {language === 'romanUrdu' 
            ? 'Order Number (jaise AGC0001) likhein aur apni delivery ka haal janain' 
            : 'Enter your Order Number (e.g. AGC0001) to stay updated on your delivery'}
        </p>

        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text" 
            placeholder={language === 'romanUrdu' ? "Order Number Likhein" : "Enter Order Number"}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full px-6 py-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-agri-green outline-none transition-all text-lg font-bold pr-16"
          />
          <button 
            type="submit"
            className="absolute right-3 top-3 bottom-3 bg-agri-green text-white px-4 rounded-xl flex items-center justify-center hover:bg-green-800 transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
        </form>
      </motion.div>

      {/* Result Section */}
      {showResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 ac-slide-up"
        >
          {/* Result Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-8 border-b">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking Order</p>
              <h2 className="text-2xl font-black text-agri-green">{orderId.toUpperCase()}</h2>
            </div>
            <div className="bg-agri-green/5 px-4 py-2 rounded-xl">
              <p className="text-[10px] font-bold text-agri-green uppercase tracking-tighter">Current Status</p>
              <p className="font-bold text-gray-800">
                {language === 'romanUrdu' ? 'Tayyar Ho Raha Hai' : 'Preparing Order'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Timeline */}
            <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[3px] before:bg-gray-100">
              {stages.map((stage) => (
                <div key={stage.id} className="relative pl-12">
                  {stage.status === 'completed' ? (
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-10 shadow-lg shadow-green-200">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  ) : stage.status === 'current' ? (
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center z-10 animate-pulse shadow-lg shadow-orange-100">
                      <div className="w-3.5 h-3.5 rounded-full bg-orange-500" />
                    </div>
                  ) : (
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center z-10" />
                  )}
                  
                  <div className={cn(
                    "transition-all",
                    stage.status === 'pending' ? "opacity-40" : "opacity-100"
                  )}>
                    <p className={cn(
                      "text-lg font-bold leading-none mb-1",
                      stage.status === 'current' ? "text-orange-600 italic" : "text-gray-900"
                    )}>
                      {language === 'romanUrdu' ? stage.titleRU : stage.titleEN}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {language === 'romanUrdu' ? stage.descRU : stage.descEN}
                    </p>
                    {stage.time && <p className="text-xs font-black text-agri-green mt-2">{stage.time}</p>}
                    {stage.info && <p className="text-xs font-black text-orange-500 mt-2">{stage.info}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Rider & Map */}
            <div className="space-y-6">
              {/* Rider Box */}
              <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
                    🛵
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-agri-green uppercase tracking-widest mb-1">
                      {language === 'romanUrdu' ? 'Rider Ki Maalumat' : 'Rider Information'}
                    </p>
                    <p className="text-xl font-bold text-gray-900">Ahmed M.</p>
                    <p className="text-sm text-gray-600">+92 301 9515764</p>
                  </div>
                </div>
                <a 
                  href="https://wa.me/923019515764" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-agri-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-800 transition-all shadow-lg shadow-agri-green/20"
                >
                  <MessageSquare className="w-5 h-5" />
                  {language === 'romanUrdu' ? 'Rider Say Baat Karein' : 'Chat with Rider'}
                </a>
              </div>

              {/* Shop info */}
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm shrink-0">
                    📍
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      {language === 'romanUrdu' ? 'Dispatch Location' : 'Dispatch Location'}
                    </p>
                    <p className="font-bold text-gray-900">AgriConnect Main Shop</p>
                    <p className="text-xs text-gray-500">Main Market, Tarikha, Gujrat, Punjab</p>
                  </div>
                </div>
                
                <iframe
                  src="https://maps.google.com/maps?q=Main+Market+Tarikha+Gujrat+Punjab+Pakistan&output=embed&z=13"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '20px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tracking Map"
                ></iframe>

                <a 
                  href="https://maps.app.goo.gl/aFpiFweQEq9xpjbC6" 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-4 w-full bg-white text-agri-green border-2 border-agri-green/10 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-agri-green hover:text-white transition-all shadow-sm"
                >
                  <MapPin className="w-5 h-5" />
                  {language === 'romanUrdu' ? 'Map Par Dekhein' : 'View on Map'}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackOrder;
