import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Vegetables from './pages/Vegetables';
import Fruits from './pages/Fruits';
import DryFruits from './pages/DryFruits';
import Grains from './pages/Grains';
import Login from './pages/Login';
import CustomerSignup from './pages/CustomerSignup';
import SellerRegister from './pages/SellerRegister';
import Cart from './pages/Cart';
import TrackOrder from './pages/TrackOrder';
import KisanTips from './pages/KisanTips';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import About from './pages/About';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { cn } from './lib/utils';
import { Moon, Sun } from 'lucide-react';

const FloatingButtons = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const handleLanguageToggle = () => {
    setLanguage(language === 'romanUrdu' ? 'english' : 'romanUrdu');
  };

  return (
    <>
      {/* Floating Language Button */}
      <button 
        onClick={handleLanguageToggle}
        className="group flex items-center justify-center transition-all duration-300 font-bold"
        style={{
          position: 'fixed',
          bottom: '140px',
          right: '20px',
          zIndex: 9999,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          backgroundColor: language === 'romanUrdu' ? '#2d6a2d' : 'white',
          color: language === 'romanUrdu' ? 'white' : '#2d6a2d',
          border: '2px solid #2d6a2d',
          fontFamily: 'sans-serif',
          fontSize: '14px',
        }}
      >
        <div className="absolute -left-28 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100 dark:border-gray-700">
          {language === 'romanUrdu' ? 'English' : 'Roman Urdu'}
        </div>
        {language === 'romanUrdu' ? 'اردو' : 'EN'}
      </button>

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className={cn(
          "group flex items-center justify-center transition-all duration-300",
          theme === 'light' ? "bg-white text-gray-800 border border-gray-100" : "bg-gray-800 text-white border border-gray-700"
        )}
        style={{
          position: 'fixed',
          bottom: '85px',
          right: '20px',
          zIndex: 9999,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      >
        <div className="absolute -left-28 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100 dark:border-gray-700">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </div>
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/923019515764" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white hover:scale-110 transition-transform group flex items-center justify-center"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '20px',
          zIndex: 9999,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      >
        <div className="absolute -left-44 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100 dark:border-gray-700">
          WhatsApp Par Order Karein
        </div>
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </>
  );
};

const FirebaseAuthState = () => {
  React.useEffect(() => {
    const initListener = () => {
      const firebaseModules = (window as any).firebaseModules;
      const auth = (window as any).auth;
      const db = (window as any).db;
      
      if (firebaseModules && auth && db) {
        const unsubscribe = firebaseModules.onAuthStateChanged(auth, async (user: any) => {
          if (user) {
            try {
              const userDoc = await firebaseModules.getDoc(
                firebaseModules.doc(db, "users", user.uid)
              );
              
              if (userDoc.exists()) {
                const userData = userDoc.data();
                const oldUser = localStorage.getItem("ac_user");
                
                // If it's a new login (previously no user or different user)
                if (!oldUser || JSON.parse(oldUser).uid !== user.uid) {
                  localStorage.removeItem('ac_avatar_color');
                }
                
                localStorage.setItem("ac_user", JSON.stringify(userData));
                // Trigger profile update event
                window.dispatchEvent(new Event('ac_user_updated'));
              }
            } catch (e) {
              console.error("Auth state update error:", e);
            }
          } else {
            localStorage.removeItem("ac_user");
            localStorage.removeItem('ac_avatar_color');
            window.dispatchEvent(new Event('ac_user_updated'));
          }
        });
        return unsubscribe;
      }
      return null;
    };

    let unsubscribe: any = null;
    
    // Retry if firebase modules not loaded yet
    const checkInterval = setInterval(() => {
      if ((window as any).firebaseModules) {
        unsubscribe = initListener();
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => {
      clearInterval(checkInterval);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return null;
};

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <Router>
                  <FirebaseAuthState />
                  <ScrollToTop />
                  <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col transition-colors duration-300">
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sabziyaan" element={<Vegetables />} />
                        <Route path="/phal" element={<Fruits />} />
                        <Route path="/dry-fruits" element={<DryFruits />} />
                        <Route path="/anaaj" element={<Grains />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<CustomerSignup />} />
                        <Route path="/seller-register" element={<SellerRegister />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/track-order" element={<TrackOrder />} />
                        <Route path="/kisan-tips" element={<KisanTips />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />
                      </Routes>
                    </main>
                    <Footer />
                    <FloatingButtons />
                  </div>
                </Router>
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
