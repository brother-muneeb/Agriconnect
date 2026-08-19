import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const HomeLoginPopup: React.FC = () => {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check if user is logged in
    const localUser = localStorage.getItem('ac_user');
    const shown = sessionStorage.getItem('lp');

    if (!user && !localUser && !shown) {
      sessionStorage.setItem('lp', '1');
      setIsOpen(true);
    }
  }, [user, loading]);

  if (!isOpen) return null;

  const isEn = language === 'english';

  return (
    <div 
      id="lp"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <div 
        id="ac-login-popup-card"
        className="w-full max-w-[340px] bg-white rounded-[20px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{ borderRadius: '20px' }}
      >
        {/* Green gradient header */}
        <div 
          className="ac-popup-header relative p-6 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #1a6b3c, #2d9e5e)' }}
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/40 text-white font-bold text-base transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
          
          {/* Logo / icon */}
          <div className="text-4xl mb-1">🌾</div>
          <div className="ac-popup-title text-2xl font-extrabold tracking-tight">AgriConnect</div>
          
          {/* Tagline in both languages */}
          <div className="text-white/90 text-xs mt-1 leading-tight font-medium">
            Punjab Ki Taazgi - Aapke Ghar Tak
            <div className="text-[11px] opacity-80 font-normal">Punjab Freshness - Right To Your Door</div>
          </div>
        </div>

        {/* Popup Body */}
        <div className="ac-popup-body p-5">
          <div className="text-center text-gray-700 text-sm font-semibold mb-4">
            {isEn ? 'Login To Your Account' : 'Apne Account Mein Login Karein'}
            <div className="text-[11px] text-gray-500 font-normal">
              {isEn ? 'Apne Account Mein Login Karein' : 'Login To Your Account'}
            </div>
          </div>

          {/* Customer Login button (green) */}
          <button 
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/login';
            }}
            className="w-full bg-[#2d6a2d] hover:bg-[#235323] text-white py-3.5 px-4 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>👤</span> {isEn ? 'Customer Login' : 'Customer Login'}
          </button>

          {/* Seller Login button (orange) */}
          <button 
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/seller-login';
            }}
            className="w-full bg-[#e65100] hover:bg-[#c24400] text-white py-3.5 px-4 rounded-xl text-sm font-bold shadow-md transition-all mt-2.5 flex items-center justify-center gap-2"
          >
            <span>🏪</span> {isEn ? 'Seller Login' : 'Seller Login'}
          </button>

          {/* Register link */}
          <div className="text-center mt-4 pt-2 border-t border-gray-100">
            <span className="text-gray-500 text-xs">
              {isEn ? 'New here? ' : 'Naya account? '}
            </span>
            <button 
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/customer-register';
              }}
              className="text-[#2d6a2d] hover:text-[#1e481e] text-xs font-bold underline transition-colors"
            >
              {isEn ? 'Register Now →' : 'Register Karein →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoginPopup;
