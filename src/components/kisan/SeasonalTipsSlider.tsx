import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Edit2, Check, X, Plus, Trash2 } from 'lucide-react';
import { seasonalTipsData, SeasonalTip } from '../../data/kisanTipsData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const SeasonalTipsSlider = () => {
  const { language, setLanguage } = useLanguage();
  const { isAdmin } = useAuth();
  const [tips, setTips] = useState<SeasonalTip[]>(seasonalTipsData);
  const [currentIndex, setCurrentIndex] = useState(1); // Start with Vaisakh as center (index 1)
  const [isEditing, setIsEditing] = useState(false);
  const [editingTip, setEditingTip] = useState<SeasonalTip | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  }, [tips.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  }, [tips.length]);

  useEffect(() => {
    if (!isEditing) {
      const timer = setInterval(nextSlide, 7000);
      return () => clearInterval(timer);
    }
  }, [nextSlide, isEditing]);

  const getVisibleIndices = () => {
    const prev = (currentIndex - 1 + tips.length) % tips.length;
    const next = (currentIndex + 1) % tips.length;
    return [prev, currentIndex, next];
  };

  const handleEdit = (tip: SeasonalTip) => {
    setEditingTip(JSON.parse(JSON.stringify(tip)));
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingTip) {
      setTips(prev => prev.map(t => t.id === editingTip.id ? editingTip : t));
      setIsEditing(false);
      setEditingTip(null);
    }
  };

  const t = (ru: string, en: string) => (language === 'romanUrdu' ? ru : en);

  const visibleIndices = getVisibleIndices();

  return (
    <div className="relative py-12 px-4 overflow-hidden">
      {/* Local Language Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-white p-2 rounded-2xl shadow-lg flex gap-2 border border-gray-100">
          <button
            onClick={() => setLanguage('romanUrdu')}
            className={cn(
              "px-6 py-2 rounded-xl font-bold text-sm transition-all",
              language === 'romanUrdu' 
                ? "bg-agri-green text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            Roman Urdu
          </button>
          <button
            onClick={() => setLanguage('english')}
            className={cn(
              "px-6 py-2 rounded-xl font-bold text-sm transition-all",
              language === 'english' 
                ? "bg-agri-green text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            English
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="max-w-7xl mx-auto relative h-[600px] md:h-[500px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {visibleIndices.map((idx, position) => {
            const tip = tips[idx];
            const isCenter = position === 1;
            
            return (
              <motion.div
                key={`${tip.id}-${position}`}
                initial={{ opacity: 0, scale: 0.8, x: position === 0 ? -100 : position === 2 ? 100 : 0 }}
                animate={{ 
                  opacity: isCenter ? 1 : 0.4, 
                  scale: isCenter ? 1 : 0.85,
                  x: position === 0 ? '-105%' : position === 2 ? '105%' : '0%',
                  zIndex: isCenter ? 10 : 0
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className={cn(
                  "absolute w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row",
                  !isCenter && "cursor-pointer"
                )}
                onClick={() => !isCenter && (position === 0 ? prevSlide() : nextSlide())}
              >
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                  <img src={tip.image} alt={tip.monthEN} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="md:w-3/5 p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-agri-green">
                        {t(tip.punjabiMonth, `${tip.punjabiMonth} (${tip.englishMonths})`)}
                      </span>
                      <h3 className="text-4xl font-black text-gray-900 mt-1">
                        {t(tip.monthRU, tip.monthEN)}
                      </h3>
                    </div>
                    {isAdmin && isCenter && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEdit(tip); }}
                        className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-agri-green hover:text-white transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <ul className="space-y-4 flex-1">
                    {(language === 'romanUrdu' ? tip.tipsRU : tip.tipsEN).map((bullet, i) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className="mt-1 w-6 h-6 rounded-full bg-agri-green/10 text-agri-green flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-gray-600 font-medium leading-tight">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-xl text-agri-green hover:bg-agri-green hover:text-white transition-all"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-xl text-agri-green hover:bg-agri-green hover:text-white transition-all"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {tips.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "h-2 rounded-full transition-all",
              currentIndex === idx ? "w-8 bg-agri-green" : "w-2 bg-gray-300 hover:bg-gray-400"
            )}
          />
        ))}
      </div>

      {/* Admin Edit Modal */}
      <AnimatePresence>
        {isEditing && editingTip && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white z-[310] rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Edit {editingTip.monthEN} Tips</h2>
                <button onClick={() => setIsEditing(false)}><X className="w-6 h-6 text-gray-400" /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Month Name (Roman Urdu)</label>
                  <input 
                    type="text" 
                    value={editingTip.monthRU}
                    onChange={(e) => setEditingTip({...editingTip, monthRU: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-agri-green outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Month Name (English)</label>
                  <input 
                    type="text" 
                    value={editingTip.monthEN}
                    onChange={(e) => setEditingTip({...editingTip, monthEN: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-agri-green outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Tips (Roman Urdu)</label>
                    {editingTip.tipsRU.map((tip, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          type="text" 
                          value={tip}
                          onChange={(e) => {
                            const newTips = [...editingTip.tipsRU];
                            newTips[i] = e.target.value;
                            setEditingTip({...editingTip, tipsRU: newTips});
                          }}
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-agri-green outline-none text-sm"
                        />
                        <button 
                          onClick={() => {
                            const newTips = editingTip.tipsRU.filter((_, idx) => idx !== i);
                            const newTipsEN = editingTip.tipsEN.filter((_, idx) => idx !== i);
                            setEditingTip({...editingTip, tipsRU: newTips, tipsEN: newTipsEN});
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setEditingTip({...editingTip, tipsRU: [...editingTip.tipsRU, ''], tipsEN: [...editingTip.tipsEN, '']})}
                      className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-agri-green hover:text-agri-green transition-all flex items-center justify-center gap-2 text-sm font-bold"
                    >
                      <Plus className="w-4 h-4" /> Add Tip
                    </button>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Tips (English)</label>
                    {editingTip.tipsEN.map((tip, i) => (
                      <input 
                        key={i}
                        type="text" 
                        value={tip}
                        onChange={(e) => {
                          const newTips = [...editingTip.tipsEN];
                          newTips[i] = e.target.value;
                          setEditingTip({...editingTip, tipsEN: newTips});
                        }}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-agri-green outline-none text-sm"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 rounded-2xl font-bold text-white bg-agri-green hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" /> Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeasonalTipsSlider;
