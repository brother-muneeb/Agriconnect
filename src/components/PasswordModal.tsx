import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useLanguage } from '../context/LanguageContext';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { language, t } = useLanguage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'agriconnect2024') {
      onSuccess();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
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
            className="fixed inset-0 bg-black/60 z-[150] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[160] rounded-[2.5rem] shadow-2xl p-10 text-center"
          >
            <div className="bg-agri-green/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-agri-green">
              <Lock className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">{t('admin.panel')}</h2>
            <p className="text-gray-500 mb-8 font-medium">Please enter the admin password to continue</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('admin.password')}
                  className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-center tracking-widest ${
                    error ? 'border-red-500 animate-shake' : 'border-gray-100 focus:border-agri-green'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-agri-green transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

      {error && (
        <p className="text-red-500 text-sm font-bold">Galat Password! Dobara Koshish Karein</p>
      )}

      <button
        type="submit"
        className="w-full bg-agri-green text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20"
      >
        {language === 'romanUrdu' ? 'Darakhast Karein' : 'Submit'} <ArrowRight className="w-6 h-6" />
      </button>
            </form>

            <button 
              onClick={onClose}
              className="mt-6 text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PasswordModal;
