import React, { useState } from 'react';
import { Lightbulb, ArrowRight, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const KisanTips = () => {
  const { language } = useLanguage();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [popupLang, setPopupLang] = useState<'romanUrdu' | 'english'>(language);

  const tips = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
      title: language === 'romanUrdu' ? 'Gandum Ki Katai Ki Tips' : 'Wheat Harvest Tips',
      description: language === 'romanUrdu' ? 'Gandum ki katai ke behtareen tareeqay seekhein taake nuqsaan kam ho aur quality achi milay.' : 'Learn the best practices for harvesting wheat to minimize grain loss and ensure high quality.',
      content: {
        romanUrdu: "Gandum Ki Katai Ka Sahi Waqt Bohat Zaroori Hai. Jab Gandum Ka Rang Sona Ho Jaye Aur Daanay Sakht Ho Jayein Toh Katai Ka Waqt Aa Gaya Hai. Subah Kay Waqt Katai Karein Kyunki Is Waqt Daanay Zyada Mazboot Hotay Hain. Katai Kay Baad Gandum Ko Dhoop Mein Sukhayen Aur Phir Store Karein.",
        english: "The right time for wheat harvest is very important. When wheat turns golden and grains become hard, it is time to harvest. Harvest in the morning as grains are stronger at this time. After harvesting, dry the wheat in sunlight and then store it."
      }
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
      title: language === 'romanUrdu' ? 'Organic Khaad Ki Guide' : 'Organic Fertilizer Guide',
      description: language === 'romanUrdu' ? 'Ghar par organic khaad bananay ka tareeqa seekhein jo zameen ki sehat aur pedawar barhaye.' : 'Discover how to make and use organic fertilizers to improve soil health and crop yield naturally.',
      content: {
        romanUrdu: "Organic Khaad Ghar Par Banana Bohat Aasaan Hai. Sabziyoon Kay Chhalke, Chai Ki Patti Aur Anday Ki Khol Ko Ek Jagah Jama Karein. Inhe Kuch Hafte Saray Rehne Dein. Yeh Behtareen Organic Khaad Ban Jaati Hai Jo Aapki Fasal Ko Taaqat Deti Hai.",
        english: "Making organic fertilizer at home is very easy. Collect vegetable peels, tea leaves and egg shells together. Let them decompose for a few weeks. This becomes excellent organic fertilizer that gives strength to your crops."
      }
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
      title: language === 'romanUrdu' ? 'Keeron Say Bachao Kay Tarike' : 'Pest Control Methods',
      description: language === 'romanUrdu' ? 'Fasal ko keeron say bachane ke liye natural spray aur IPM ke tareeqay seekhein.' : 'Effective and safe ways to protect your crops from common pests using integrated pest management.',
      content: {
        romanUrdu: "Fasal Ko Keeron Say Bachane Kay Liye Natural Spray Banayein. Lehsan Aur Hari Mirch Ko Paani Mein Ubaalein. Thanda Ho Jaye Toh Spray Bottle Mein Bharein Aur Fasal Par Spray Karein. Yeh Keeron Ko Door Rakhta Hai Aur Fasal Ko Nuksan Nahi Pahunchata.",
        english: "To protect crops from pests make natural spray at home. Boil garlic and green chili in water. When cooled fill in spray bottle and spray on crops. This keeps pests away without harming crops."
      }
    },
  ];

  return (
    <section className="py-16 bg-agri-cream/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 ac-slide-up">
          <div className="inline-flex items-center gap-2 bg-agri-green/10 text-agri-green px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Lightbulb className="w-4 h-4" />
            {language === 'romanUrdu' ? 'Kisan Tips' : 'Kisan Tips'}
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900">
            {language === 'romanUrdu' ? 'Kisaanon Kay Liye Mahirana Mashwaray' : 'Expert Farming Advice'}
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            {language === 'romanUrdu' 
              ? 'Punjab kay kisaanon ko jadeed ziraat aur behtareen tareeqon say agah karna hamara maqsad hai.'
              : "Empowering Punjab's farmers with the latest agricultural knowledge and techniques."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tips.map((tip, idx) => (
            <div key={idx} className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300 ac-slide-up ac-delay-${idx + 1}`}>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={tip.image} 
                  alt={tip.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {tip.description}
                </p>
                <button 
                  onClick={() => {
                    setSelectedTip(idx);
                    setPopupLang(language);
                  }}
                  className="flex items-center gap-2 text-agri-green font-bold hover:gap-3 transition-all"
                >
                  {language === 'romanUrdu' ? 'Poora Parhein' : 'Read More'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Popup */}
      <AnimatePresence>
        {selectedTip !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTip(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="bg-agri-green p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold">{tips[selectedTip].title}</h3>
                <button 
                  onClick={() => setSelectedTip(null)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-center gap-4 mb-4">
                  <button 
                    onClick={() => setPopupLang('romanUrdu')}
                    className={cn(
                      "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                      popupLang === 'romanUrdu' ? "bg-agri-green text-white" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    Roman Urdu
                  </button>
                  <button 
                    onClick={() => setPopupLang('english')}
                    className={cn(
                      "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                      popupLang === 'english' ? "bg-agri-green text-white" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    English
                  </button>
                </div>

                <div className="h-48 rounded-2xl overflow-hidden">
                  <img 
                    src={tips[selectedTip].image} 
                    alt={tips[selectedTip].title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  {tips[selectedTip].content[popupLang]}
                </p>

                <div className="pt-6 border-t flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/kisan-tips"
                    className="flex-1 bg-agri-green text-white px-6 py-3 rounded-xl font-bold text-center hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {language === 'romanUrdu' ? 'Kisan Tips Par Jayein' : 'Go to Kisan Tips'}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => setSelectedTip(null)}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    {language === 'romanUrdu' ? 'Band Karein' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default KisanTips;
