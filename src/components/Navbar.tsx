import React, { useState, useEffect, useRef } from 'react';
import { Wheat, ShoppingCart, Menu, X, ChevronDown, LogIn, LogOut, User as UserIcon, Truck, Package, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { cartCount } = useCart();
  const { language, setLanguage } = useLanguage();
  const { user, profile, login, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      // Close avatar dropdown when clicking outside
      const avatarBtn = document.getElementById('avatar-btn');
      const avatarDropdown = document.getElementById('avatar-dropdown');
      if (avatarBtn && !avatarBtn.contains(event.target as Node) && 
          avatarDropdown && !avatarDropdown.contains(event.target as Node)) {
        setShowAvatarDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [avatarColor, setAvatarColor] = useState('#2ecc71');
  const [acUser, setAcUser] = useState<any>(null);

  useEffect(() => {
    const updateAcUser = () => {
      const saved = localStorage.getItem('ac_user');
      if (saved) {
        const userData = JSON.parse(saved);
        setAcUser(userData);
        
        // Get permanent color logic
        const uid = userData.uid;
        const colorKey = 'ac_avatar_' + uid;
        let pColor = localStorage.getItem(colorKey);
        if (!pColor) {
          const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#e91e63','#00bcd4','#ff5722'];
          pColor = colors[Math.floor(Math.random() * colors.length)];
          localStorage.setItem(colorKey, pColor);
        }
        localStorage.setItem('ac_avatar_color', pColor);
        setAvatarColor(pColor);
      } else {
        setAcUser(null);
      }
    };

    updateAcUser();
    window.addEventListener('ac_user_updated', updateAcUser);
    return () => window.removeEventListener('ac_user_updated', updateAcUser);
  }, []);

  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('ac_user');
    localStorage.removeItem('ac_avatar_color');
    setShowAvatarDropdown(false);
    window.dispatchEvent(new Event('ac_user_updated'));
    setIsMobileMenuOpen(false);
  };

  const navLinks: any[] = [
    { name: language === 'romanUrdu' ? 'Home' : 'Home', href: '/' },
    { 
      name: language === 'romanUrdu' ? 'Shop' : 'Shop', 
      href: '/sabziyaan',
      dropdown: [
        { name: language === 'romanUrdu' ? 'Sabziyaan' : 'Vegetables', href: '/sabziyaan' },
        { name: language === 'romanUrdu' ? 'Phal' : 'Fruits', href: '/phal' },
        { name: language === 'romanUrdu' ? 'Dry Fruits' : 'Dry Fruits', href: '/dry-fruits' },
        { name: language === 'romanUrdu' ? 'Anaaj' : 'Grains', href: '/anaaj' }
      ]
    },
    { 
      name: language === 'romanUrdu' ? 'Cart' : 'Cart', 
      href: '/cart', 
      icon: (
        <div className="relative">
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-agri-orange text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
              {cartCount}
            </span>
          )}
        </div>
      )
    },
    { 
      name: language === 'romanUrdu' ? 'Kisan Tips' : 'Kisan Tips', 
      href: '/kisan-tips',
      dropdown: [
        { name: language === 'romanUrdu' ? 'Farming Advice' : 'Farming Advice', href: '/kisan-tips?tab=advice' },
        { name: language === 'romanUrdu' ? 'Seasonal Tips' : 'Seasonal Tips', href: '/kisan-tips?tab=seasonal' },
        { name: language === 'romanUrdu' ? 'Aaj Ki Rate List' : 'Today\'s Rate List', href: '/kisan-tips?tab=rates' },
        { name: language === 'romanUrdu' ? 'Weather Updates' : 'Weather Updates', href: '/kisan-tips?tab=weather' }
      ]
    },
    { name: language === 'romanUrdu' ? 'Gallery' : 'Gallery', href: '/gallery' },
    { name: language === 'romanUrdu' ? 'Contact' : 'Contact', href: '/contact' },
    { name: language === 'romanUrdu' ? 'About Us' : 'About Us', href: '/about' }
  ];

  const isLoggedIn = !!(user || (acUser && acUser.uid));
  const userDisplayName = acUser?.fullName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const userEmail = acUser?.email || user?.email || '';
  const userRole = acUser?.userType || 'customer';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  const handleShowProfile = () => {
    setShowAvatarDropdown(false);
    setIsMobileMenuOpen(false);
    if ((window as any).acShowProfile) {
      (window as any).acShowProfile();
    } else {
      window.location.hash = '#/profile';
    }
  };

  const handleShowOrders = () => {
    setShowAvatarDropdown(false);
    setIsMobileMenuOpen(false);
    if ((window as any).acShowOrders) {
      (window as any).acShowOrders();
    } else {
      window.location.hash = '#/track-order';
    }
  };

  const handleShowPendingOrders = () => {
    setShowAvatarDropdown(false);
    setIsMobileMenuOpen(false);
    if ((window as any).acShowPendingOrders) {
      (window as any).acShowPendingOrders();
    } else {
      window.location.hash = '#/track-order';
    }
  };

  const handleLogoutAction = async () => {
    setShowAvatarDropdown(false);
    setIsMobileMenuOpen(false);
    if ((window as any).acLogout) {
      await (window as any).acLogout();
    } else {
      await handleLogout();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled 
        ? "bg-white dark:bg-[#1f1f1f] py-2 shadow-md border-gray-100 dark:border-gray-800" 
        : "bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-sm py-4 border-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-agri-green p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Wheat className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-serif font-bold text-agri-green tracking-tight">
              AgriConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">


            {navLinks.map((link, index) => (
              <div key={link.name} className="relative group">
                {link.dropdown ? (
                  <Link 
                    id={link.name === 'Shop' ? 'nav-shop' : undefined}
                    to={link.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors py-2",
                      link.name === 'Shop' ? "nav-shop shop-nav-item" : "",
                      (isActive(link.href) || link.dropdown?.some(d => isActive(d.href))) ? "text-agri-green" : "text-gray-700 hover:text-agri-green"
                    )}
                  >
                    {link.icon}
                    {link.name}
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />
                  </Link>
                ) : (
                  <Link 
                    to={link.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors py-2",
                      isActive(link.href) ? "text-agri-green" : "text-gray-700 hover:text-agri-green"
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )}
                
                {link.dropdown && (
                  <div className={cn("nav-dropdown", (index > navLinks.length - 3) && "right-aligned")}>
                    {link.dropdown.map((item) => (
                      item.onClick ? (
                        <button 
                          key={item.name} 
                          onClick={item.onClick}
                          className="nav-dropdown-item w-full text-left flex items-center gap-2"
                        >
                          {item.icon}
                          {item.name}
                        </button>
                      ) : item.href.startsWith('/') ? (
                        <Link 
                          key={item.name} 
                          to={item.href} 
                          className="nav-dropdown-item"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <a key={item.name} href={item.href} className="nav-dropdown-item">
                          {item.name}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Install App Button (Desktop) */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="bg-[#2d6a2d] hover:bg-green-800 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all duration-300 active:scale-95"
              style={{ padding: '8px 16px', borderRadius: '8px' }}
            >
              {language === 'romanUrdu' ? '📲 App Install Karein' : '📲 Install App'}
            </button>

            {/* Auth / Avatar Area (Desktop) */}
            <div className="relative">
              {isLoggedIn ? (
                <div id="nav-avatar-wrap" className="relative inline-block">
                  <button
                    id="avatar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAvatarDropdown(!showAvatarDropdown);
                    }}
                    className="flex items-center gap-1.5 focus:outline-none cursor-pointer group"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base border-2 border-white/80 shadow-md transition-transform group-hover:scale-105 select-none"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {userInitial}
                    </div>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-gray-500 transition-transform duration-200", showAvatarDropdown && "rotate-180")} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showAvatarDropdown && (
                      <motion.div
                        id="avatar-dropdown"
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#252525] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-[#1a6b3c] to-[#2d9e5e] text-white">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/60 shadow-inner flex-shrink-0"
                              style={{ backgroundColor: avatarColor }}
                            >
                              {userInitial}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-bold text-sm truncate leading-tight">{userDisplayName}</p>
                              <p className="text-xs text-white/85 truncate mt-0.5">{userEmail}</p>
                              <div className="mt-1.5 bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-md inline-block font-medium">
                                {userRole === 'seller' ? '🏪 Seller' : '👤 Customer'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Options */}
                        <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
                          {userRole === 'seller' && (
                            <Link
                              to="/seller-dashboard"
                              onClick={() => { setShowAvatarDropdown(false); setIsMobileMenuOpen(false); }}
                              className="w-full text-left px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center gap-3 transition-colors cursor-pointer text-agri-orange"
                            >
                              <span className="text-lg">🏪</span>
                              <div>
                                <p className="font-semibold text-xs text-agri-orange font-bold">
                                  {language === 'romanUrdu' ? 'Seller Dashboard' : 'Seller Dashboard'}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  {language === 'romanUrdu' ? 'Orders & shop manage karein' : 'Manage orders & shop'}
                                </p>
                              </div>
                            </Link>
                          )}

                          <button
                            onClick={handleShowProfile}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <span className="text-lg">👤</span>
                            <div>
                              <p className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                                {language === 'romanUrdu' ? 'Mera Profile' : 'My Profile'}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {language === 'romanUrdu' ? 'Apni maloomat dekhein' : 'View profile info'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={handleShowOrders}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <span className="text-lg">📦</span>
                            <div>
                              <p className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                                {language === 'romanUrdu' ? 'Mere Orders' : 'My Orders'}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {language === 'romanUrdu' ? 'Order history dekhein' : 'View order history'}
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={handleShowPendingOrders}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <span className="text-lg">⏳</span>
                            <div>
                              <p className="font-semibold text-xs text-gray-800 dark:text-gray-100">
                                {language === 'romanUrdu' ? 'Pending Orders' : 'Pending Orders'}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {language === 'romanUrdu' ? 'Active orders track karein' : 'Track active orders'}
                              </p>
                            </div>
                          </button>

                          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                          <button
                            onClick={handleLogoutAction}
                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <span className="text-lg">🚪</span>
                            <span className="text-xs font-bold">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  id="nav-login-btn"
                  to="/login"
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-semibold transition-colors py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive('/login') ? "text-agri-green" : "text-gray-700 dark:text-gray-200 hover:text-agri-green"
                  )}
                >
                  <LogIn className="w-4 h-4" />
                  {language === 'romanUrdu' ? 'Login' : 'Login'}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-agri-green transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-[#1f1f1f] border-t border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <div className="max-h-[80vh] overflow-y-auto px-4 pt-4 pb-8 space-y-2">


              <div className="space-y-1">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-gray-50 last:border-0 py-1">
                    <div className="flex items-center justify-between text-agri-green font-semibold py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                      {link.href && link.href !== '#' ? (
                        <Link 
                          to={link.href} 
                          className={cn("w-full flex items-center gap-3", isActive(link.href) && "text-agri-orange font-bold")}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.icon}
                          {link.name}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-3 w-full">
                          {link.icon}
                          {link.name}
                        </span>
                      )}
                    </div>
                    {link.dropdown && (
                      <div className="pl-10 mt-1 space-y-3 mb-3 border-l-2 border-agri-green/10 ml-5">
                        {link.dropdown.map((item) => (
                          item.onClick ? (
                            <button 
                              key={item.name} 
                              onClick={() => {
                                item.onClick();
                                setIsMobileMenuOpen(false);
                              }}
                              className="flex items-center gap-2 text-sm text-gray-600 hover:text-agri-green transition-colors w-full text-left"
                            >
                              {item.icon}
                              {item.name}
                            </button>
                          ) : item.href.startsWith('/') ? (
                            <Link 
                              key={item.name} 
                              to={item.href} 
                              className={cn("block text-sm transition-colors", isActive(item.href) ? "text-agri-green font-bold" : "text-gray-500 hover:text-agri-green")}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <a 
                              key={item.name} 
                              href={item.href} 
                              className="block text-sm text-gray-500 hover:text-agri-green"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </a>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Install App Button (Mobile) */}
                <div className="py-2 px-2 border-b border-gray-50 dark:border-gray-800/50">
                  <button
                    onClick={() => {
                      setIsInstallModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-[#2d6a2d] hover:bg-green-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-300 active:scale-95"
                    style={{ padding: '8px 16px', borderRadius: '8px' }}
                  >
                    {language === 'romanUrdu' ? '📲 App Install Karein' : '📲 Install App'}
                  </button>
                </div>

                {/* Mobile Auth Links */}
                <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
                  {isLoggedIn ? (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base border-2 border-white shadow-sm flex-shrink-0"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {userInitial}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight truncate">{userDisplayName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {userRole === 'seller' ? (
                          <Link
                            to="/seller-dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-1.5 px-2 bg-orange-100 dark:bg-orange-950/50 text-xs font-bold rounded-lg shadow-xs text-agri-orange text-center cursor-pointer"
                          >
                            Dashboard
                          </Link>
                        ) : (
                          <button
                            onClick={handleShowProfile}
                            className="py-1.5 px-2 bg-white dark:bg-gray-700 text-xs font-semibold rounded-lg shadow-xs text-gray-700 dark:text-gray-200 text-center cursor-pointer"
                          >
                            Profile
                          </button>
                        )}
                        <button
                          onClick={handleShowOrders}
                          className="py-1.5 px-2 bg-white dark:bg-gray-700 text-xs font-semibold rounded-lg shadow-xs text-gray-700 dark:text-gray-200 text-center cursor-pointer"
                        >
                          Orders
                        </button>
                        <button
                          onClick={handleLogoutAction}
                          className="py-1.5 px-2 bg-red-50 dark:bg-red-900/30 text-xs font-semibold rounded-lg text-red-600 dark:text-red-400 text-center cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link 
                      to="/login"
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-agri-green text-white font-bold text-sm rounded-xl shadow-sm hover:bg-green-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      {language === 'romanUrdu' ? 'Login' : 'Login'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install App Modal */}
      <AnimatePresence>
        {isInstallModalOpen && (
          <>
            <style>{`
              .custom-install-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0,0,0,0.6) !important;
                z-index: 999999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .custom-install-card {
                position: relative !important;
                top: auto !important;
                left: auto !important;
                transform: none !important;
                width: 400px !important;
                max-width: 90vw !important;
                background: white !important;
                border-radius: 20px !important;
                padding: 30px 24px !important;
                overflow: hidden !important;
                max-height: none !important;
              }
            `}</style>
            <div className="backdrop-blur-sm custom-install-overlay">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="custom-install-card text-center border border-gray-100 dark:border-gray-800 shadow-2xl"
              >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setIsInstallModalOpen(false);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}
                id="close-install-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Big Phone Icon */}
              <div className="text-6xl my-4 animate-bounce">📱</div>

              {/* Title */}
              <h3 className="text-2xl font-black text-gray-950 dark:text-white mb-2 tracking-tight">
                {language === 'romanUrdu' ? 'AgriConnect App Install Karein' : 'Install AgriConnect App'}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                {language === 'romanUrdu' 
                  ? 'Hamare app ko install karke shopping aur bhi aasan banayein!' 
                  : 'Install our app for easier shopping experience!'}
              </p>

              {/* Buttons */}
              <div className="space-y-3 mb-6">
                {/* Android Download Button */}
                <a
                  href="https://ais-dev-n4dnowy64ny4d4hqk4maw4-322034100168.asia-east1.run.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2d6a2d] hover:bg-green-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-950/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  {language === 'romanUrdu' ? '📥 Android APK Download' : '📥 Download Android APK'}
                </a>

                {/* iOS Button (Disabled) */}
                <button
                  disabled
                  className="w-full bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-gray-300 dark:border-gray-700 opacity-60"
                >
                  {language === 'romanUrdu' ? '🍎 iOS - Coming Soon' : '🍎 iOS - Coming Soon'}
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />

              {/* App Highlights */}
              <div className="flex flex-col items-center justify-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500">✅</span>
                  <span>{language === 'romanUrdu' ? 'Secure Download' : 'Secure Download'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500">✅</span>
                  <span>{language === 'romanUrdu' ? 'Free Install' : 'Free Install'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-green-500">✅</span>
                  <span>{language === 'romanUrdu' ? 'No Hidden Charges' : 'No Hidden Charges'}</span>
                </div>
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
