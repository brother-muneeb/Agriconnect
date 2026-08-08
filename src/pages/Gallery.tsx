import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Share2, Maximize2, Quote, Wheat } from 'lucide-react';
import { cn } from '../lib/utils';

interface Photo {
  id: number;
  category: 'Khet' | 'Kisaan' | 'Team' | 'Van' | 'Shop';
  image: string;
  caption: string;
}

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('Sab');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [currentQuote, setCurrentQuote] = useState(0);

  const filters = ['Sab', 'Khet', 'Kisaan', 'AgriConnect Team', 'Van', 'Hamaari Shop'];

  const photos: Photo[] = [
    // KHET (Farm Photos)
    { id: 1, category: 'Khet', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', caption: 'Punjab Kay Hare Bharay Khet' },
    { id: 2, category: 'Khet', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800', caption: 'Yahan Say Shuru Hoti Hai Hamari Kahani' },
    { id: 3, category: 'Khet', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800', caption: 'Taazi Fasal Seedha Khet Say' },
    { id: 4, category: 'Khet', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800', caption: 'Punjab Ki Zarkhez Zameen' },
    { id: 5, category: 'Khet', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREj5m4x9MyeDDezxczkhin92yQfFsMx2RJD0qDTkNxGXcuWeKgFe9fI5A&s=10', caption: 'Subah Ki Roshni Mein Khet' },
    { id: 6, category: 'Khet', image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=800', caption: 'Fasal Ki Katai Ka Waqt' },

    // KISAAN (Farmer Photos)
    { id: 7, category: 'Kisaan', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800', caption: 'Hamara Asli Hero — Punjab Ka Kisaan' },
    { id: 8, category: 'Kisaan', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800', caption: 'Mehnat Aur Lagan Ka Dusra Naam Kisaan' },
    { id: 9, category: 'Kisaan', image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=800', caption: 'Apni Fasal Kay Saath Khush Kisaan' },
    { id: 10, category: 'Kisaan', image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=800', caption: 'Subah Say Sham Tak Maihnat Karna' },
    { id: 11, category: 'Kisaan', image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=800', caption: 'Zameen Say Pyar Karna Seekha Kisaan Say' },
    { id: 12, category: 'Kisaan', image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800', caption: 'Punjab Ka Fakar — Hamare Kisaan' },

    // TEAM (AgriConnect Team)
    { id: 13, category: 'Team', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800', caption: 'AgriConnect Team Kisaan Say Taazi Cheezain Le Rahi Hai' },
    { id: 14, category: 'Team', image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800', caption: 'Seedha Khet Say Aapke Ghar Tak' },
    { id: 15, category: 'Team', image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b7c?auto=format&fit=crop&q=80&w=800', caption: 'AgriConnect Team Har Waqt Aapki Khidmat Mein' },
    { id: 16, category: 'Team', image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=800', caption: 'Quality Check Har Product Ka' },
    { id: 17, category: 'Team', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800', caption: 'Kisaan Aur AgriConnect — Ek Mazboot Rishta' },
    { id: 18, category: 'Team', image: 'https://images.unsplash.com/photo-1556742031-c352320bb170?auto=format&fit=crop&q=80&w=800', caption: 'Taazgi Ka Wada — AgriConnect Ka Irada' },

    // VAN (Delivery Van)
    { id: 19, category: 'Van', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800', caption: 'AgriConnect Ki Delivery Van' },
    { id: 20, category: 'Van', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', caption: 'Aapke Darwaze Tak Pahunchti Hai Taazgi' },
    { id: 21, category: 'Van', image: 'https://images.unsplash.com/photo-1549194388-2469d59ec69c?auto=format&fit=crop&q=80&w=800', caption: 'Punjab Kay Kone Kone Mein AgriConnect' },
    { id: 22, category: 'Van', image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800', caption: 'Waqt Par Delivery — Hamara Wada' },

    // SHOP (Hamaari Shop)
    { id: 23, category: 'Shop', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', caption: 'AgriConnect Ki Shop — Islamabad' },
    { id: 24, category: 'Shop', image: 'https://images.unsplash.com/photo-1604719312563-8912e9223c6a?auto=format&fit=crop&q=80&w=800', caption: 'Taazi Sabziyaan Aur Phal Hamaari Shop Mein' },
    { id: 25, category: 'Shop', image: 'https://images.unsplash.com/photo-1573248639112-b39c0d46c582?auto=format&fit=crop&q=80&w=800', caption: 'Aayein Aur Dekhein Taazgi Khud' },
    { id: 26, category: 'Shop', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=800', caption: 'Islamabad Mein AgriConnect Ka Naya Thikana' },
  ];

  const quotes = [
    {
      text: "Zameen Mein Beej Daalte Hain, Umeed Ugaate Hain — Yahi Hai Asli Zindagi",
      author: "Allama Iqbal",
      bg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
    },
    {
      text: "Kisan Woh Shahsawar Hai Jo Bina Talwar Kay Poori Qaum Ka Pet Bharta Hai",
      author: "AgriConnect Team",
      bg: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1920"
    },
    {
      text: "Mehnat Karo Zameen Par, Results Aayenge Aasman Se",
      author: "AgriConnect Team",
      bg: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1920"
    },
    {
      text: "Jo Kisaan Apni Zameen Say Pyar Karta Hai, Zameen Usse Kabhi Nirash Nahi Karti",
      author: "Anonymous",
      bg: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=1920"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const filteredPhotos = photos.filter(photo => {
    if (activeFilter === 'Sab') return true;
    if (activeFilter === 'AgriConnect Team') return photo.category === 'Team';
    if (activeFilter === 'Hamaari Shop') return photo.category === 'Shop';
    return photo.category === activeFilter;
  });

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex(prev => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null));
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex(prev => (prev !== null ? (prev + 1) % filteredPhotos.length : null));
  };

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden ac-fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920)' }}
        >
          <div className="absolute inset-0 bg-agri-green/80 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-4"
          >
            AgriConnect Ki Gallery
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 font-medium"
          >
            Farm Say Aapke Ghar Tak Ki Poori Kahani
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-40 bg-white border-b shadow-sm ac-slide-up ac-delay-1">
        <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center gap-4 min-w-max">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-8 py-3 rounded-full font-bold text-sm transition-all",
                  activeFilter === filter 
                    ? "bg-agri-green text-white shadow-lg shadow-agri-green/20" 
                    : "bg-gray-100 text-gray-600 hover:bg-agri-green/10 hover:text-agri-green"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => {
              const delayClass = `ac-delay-${(index % 4) + 1}`;
              return (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`relative group cursor-pointer rounded-3xl overflow-hidden break-inside-avoid shadow-sm border border-gray-100 ac-zoom-in ${delayClass}`}
                  onClick={() => setSelectedPhotoIndex(index)}
                >
                  <img 
                    src={photo.image} 
                    alt={photo.caption} 
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <div className="bg-agri-green/20 backdrop-blur-md w-fit p-2 rounded-xl mb-4">
                      <Maximize2 className="text-white w-5 h-5" />
                    </div>
                    <p className="text-white font-bold text-lg leading-tight">{photo.caption}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox Popup */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="absolute top-8 left-8 flex items-center gap-4">
              <div className="bg-agri-green p-2 rounded-xl">
                <Wheat className="text-white w-6 h-6" />
              </div>
              <span className="text-white font-serif font-bold text-xl">AgriConnect</span>
            </div>

            <button 
              onClick={handlePrevPhoto}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button 
              onClick={handleNextPhoto}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="max-w-5xl w-full flex flex-col items-center">
              <motion.img
                key={filteredPhotos[selectedPhotoIndex].id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                src={filteredPhotos[selectedPhotoIndex].image}
                alt="Selected"
                className="max-h-[70vh] w-auto rounded-[2rem] shadow-2xl border-4 border-white/10"
              />
              <div className="mt-8 text-center max-w-2xl">
                <p className="text-white text-2xl md:text-3xl font-bold mb-6 leading-tight">
                  {filteredPhotos[selectedPhotoIndex].caption}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button className="bg-agri-green text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-800 transition-all">
                    <Share2 className="w-5 h-5" /> Share Photo
                  </button>
                  <span className="text-white/40 font-mono text-sm">
                    {selectedPhotoIndex + 1} / {filteredPhotos.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Quotes Slider */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden ac-slide-up">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${quotes[currentQuote].bg})` }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            key={`quote-content-${currentQuote}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Quote className="w-16 h-16 text-agri-green mx-auto mb-8 opacity-50" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight italic">
              "{quotes[currentQuote].text}"
            </h2>
            <p className="text-agri-green text-xl md:text-2xl font-bold">
              — {quotes[currentQuote].author}
            </p>
          </motion.div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-3">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuote(idx)}
              className={cn(
                "h-2 transition-all duration-500 rounded-full",
                currentQuote === idx ? "w-12 bg-agri-green" : "w-2 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        <button 
          onClick={() => setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-white/30 hover:text-white transition-colors hidden md:block"
        >
          <ChevronLeft className="w-12 h-12" />
        </button>

        <button 
          onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-white/30 hover:text-white transition-colors hidden md:block"
        >
          <ChevronRight className="w-12 h-12" />
        </button>

        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2 opacity-50">
          <Wheat className="text-agri-green w-5 h-5" />
          <span className="text-white text-xs font-bold tracking-widest uppercase">AgriConnect</span>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
