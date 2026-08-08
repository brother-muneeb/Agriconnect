import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Gallery = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const galleryImages = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="ac-fade-in">
            <div className="inline-flex items-center gap-2 bg-agri-green/10 text-agri-green px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <ImageIcon className="w-4 h-4" />
              {language === 'romanUrdu' ? 'Gallery' : 'Gallery'}
            </div>
            <h2 className="text-4xl font-serif font-bold text-gray-900">
              {language === 'romanUrdu' ? 'Punjab Ki Jhalak' : 'Glimpses of Punjab'}
            </h2>
          </div>
          <button 
            onClick={() => navigate('/gallery')}
            className="hidden md:block bg-agri-green text-white px-6 py-2 rounded-full font-bold hover:bg-agri-green/90 transition-colors ac-fade-in ac-delay-3"
          >
            {language === 'romanUrdu' ? 'Poori Gallery Dekhein' : 'View Full Gallery'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate('/gallery')}
              className={`relative aspect-square overflow-hidden rounded-2xl group cursor-pointer ac-zoom-in ac-delay-${idx + 1}`}
            >
              <img 
                src={img} 
                alt={`Punjab Agriculture ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                  <ImageIcon className="text-white w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => navigate('/gallery')}
          className="md:hidden w-full mt-8 bg-agri-green text-white px-6 py-3 rounded-full font-bold ac-fade-in ac-delay-3"
        >
          {language === 'romanUrdu' ? 'Poori Gallery Dekhein' : 'View Full Gallery'}
        </button>
      </div>
    </section>
  );
};

export default Gallery;
