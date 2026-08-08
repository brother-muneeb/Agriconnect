import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../../data/kisanTipsData';
import { useLanguage } from '../../context/LanguageContext';

interface ArticleDetailModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, isOpen, onClose }) => {
  const { language, setLanguage } = useLanguage();

  if (!article) return null;

  const t = (ru: string, en: string) => (language === 'romanUrdu' ? ru : en);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl max-h-[90vh] bg-white z-[210] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-agri-green p-6 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl md:text-2xl font-bold">
                {t(article.titleRU, article.titleEN)}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex bg-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setLanguage('romanUrdu')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      language === 'romanUrdu' ? 'bg-white text-agri-green' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    RU
                  </button>
                  <button
                    onClick={() => setLanguage('english')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      language === 'english' ? 'bg-white text-agri-green' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    EN
                  </button>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="mb-8">
                <img
                  src={article.image}
                  alt={article.titleEN}
                  className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-lg mb-8"
                />
                <p className="text-gray-600 text-lg leading-relaxed mb-10 italic border-l-4 border-agri-green pl-6">
                  {t(article.descriptionRU, article.descriptionEN)}
                </p>
              </div>

              <div className="space-y-8">
                {article.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="shrink-0 w-12 h-12 bg-agri-green text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-agri-green/20 group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div className="pt-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-agri-green transition-colors">
                        {t(step.titleRU, step.titleEN)}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {t(step.detailRU, step.detailEN)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-center shrink-0">
              <button
                onClick={onClose}
                className="bg-agri-green text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20 flex items-center gap-3"
              >
                {t('Kisan Tips Par Jayein', 'Go To Farmer Tips')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArticleDetailModal;
