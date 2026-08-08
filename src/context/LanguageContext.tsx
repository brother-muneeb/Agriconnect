import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'romanUrdu' | 'english';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agriConnectLanguage');
    return (saved as Language) || 'romanUrdu';
  });


  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agriConnectLanguage', lang);
    
    // Step 6 - Language Toggle Fix
    // Align with global weather script expectations
    const wxLang = lang === 'romanUrdu' ? 'ru' : 'en';
    localStorage.setItem('agriconnect-lang', wxLang);
    if ((window as any).wxRefreshLang) {
      (window as any).wxRefreshLang();
    }

    var forecastBtn = document.getElementById(
      'forecast-nav-btn'
    );
    if(forecastBtn) {
      var selectedLang = localStorage.getItem(
        'agriconnect-lang'
      ) || 'ru';
      forecastBtn.textContent = selectedLang === 'en' ?
        'View Full Forecast →' :
        'Poora Forecast Dekhein →';
    }
  };


  // Simple translation helper
  const translations: Record<Language, Record<string, string>> = {
    romanUrdu: {
      'cart.add': 'Cart Mein Daalain',
      'whatsapp.order': 'WhatsApp Par Order Karein',
      'weight.select': 'Wazan Select Karein',
      'quantity.label': 'Tadaad',
      'total.price': 'Total Price',
      'farm.fresh': 'Farm Fresh',
      'reviews': 'Reviews',
      'wazan': 'Wazan',
      'search.placeholder': 'Apni pasand ki cheez talaash karein...',
      'filter.all': 'Sab',
      'nav.home': 'Home',
      'nav.vegetables': 'Sabziyaan',
      'nav.fruits': 'Phal',
      'nav.dryfruits': 'Dry Fruits',
      'nav.grains': 'Anaaj',
      'nav.kisantips': 'Kisan Tips',
      'nav.gallery': 'Gallery',
      'nav.about': 'About Us',
      'nav.contact': 'Contact',
      'nav.cart': 'Cart',
      'nav.login': 'Login / Register',
      'admin.panel': 'Admin Panel',
      'admin.password': 'Admin Password Darj Karein',
      'admin.unlock': 'Panel Kholain',
      'admin.save': 'Tabdeeliyaan Save Karein',
      'admin.remove': 'Discount Khatam Karein',
      'admin.percent': 'Discount Percentage (%)',
      'admin.start': 'Shuru Hone Ka Waqt',
      'admin.end': 'Khatam Hone Ka Waqt',
      'admin.success': 'Tabdeeliyaan Save Ho Gayi Hain!',
      'cart.title': 'Aapka Cart',
      'cart.subtitle': 'Apnay Selected Products Dekhein',
      'cart.empty': 'Aapka Cart Khali Hai',
      'cart.empty.sub': 'Kuch Mazaydar Cheezain Cart Mein Daalain',
      'cart.shopping.start': 'Shopping Shuru Karein',
      'cart.products.title': 'Aapki Products',
      'cart.remove': 'Hatayein',
      'cart.clear': 'Cart Saaf Karein',
      'cart.summary.title': 'Order Ka Khulasa',
      'cart.subtotal': 'Subtotal',
      'cart.delivery': 'Delivery Charges',
      'cart.free': 'Muft',
      'cart.delivery.lahore': 'Lahore: Muft',
      'cart.delivery.punjab': 'Punjab Kay Tamam Shehr: Muft',
      'cart.delivery.pakistan': 'Poora Pakistan: Muft',
      'cart.total': 'Kul Rakam',
      'cart.address.title': 'Delivery Ka Pata',
      'cart.address.name': 'Aapka Poora Naam',
      'cart.address.phone': 'Phone Number',
      'cart.address.whatsapp': 'WhatsApp Number',
      'cart.address.city': 'Apna Shehar Chunein',
      'cart.address.area': 'Area/Mohalla',
      'cart.address.complete': 'Mukammal Pata',
      'cart.address.landmark': 'Ghar Ka Nishaan',
      'cart.payment.title': 'Adaigi Ka Tarika',
      'cart.payment.jazzcash': 'JazzCash',
      'cart.payment.easypaisa': 'EasyPaisa',
      'cart.payment.cod': 'Cash On Delivery',
      'cart.jazzcash.number': 'JazzCash Number',
      'cart.jazzcash.name': 'Account Holder Ka Naam',
      'cart.jazzcash.instructions': 'Hamare JazzCash number par amount transfer karein aur WhatsApp par screenshot bhejein',
      'cart.easypaisa.number': 'EasyPaisa Number',
      'cart.easypaisa.name': 'Account Holder Ka Naam',
      'cart.easypaisa.instructions': 'Hamare EasyPaisa number par amount transfer karein aur WhatsApp par screenshot bhejein',
      'cart.cod.message': 'Delivery Par Naqdi Ada Karein',
      'cart.cod.extra': '',
      'cart.order.whatsapp': 'WhatsApp Par Order Karein',
      'cart.sidebar.order.whatsapp': 'WhatsApp Par Order',
      'cart.order.complete': 'Order Mukammal Karein',
      'cart.success.title': 'Shukriya {name}!',
      'cart.success.message': 'Aapka Order Mil Gaya!',
      'cart.success.number': 'Order Number',
      'cart.success.info': 'Jald Hi Aap Say Rabta Kiya Jayega',
      'cart.success.whatsapp': 'WhatsApp Par Confirmation Ayegi',
      'cart.home': 'Ghar Wapas Jayein',
      'cart.view': 'Cart Dekhein',
      'cat.vegetables': 'Sabziyaan',
      'cat.fruits': 'Phal',
      'cat.dryfruits': 'Dry Fruits',
      'cat.grains': 'Anaaj',
    },
    english: {
      'cart.add': 'Add to Cart',
      'whatsapp.order': 'Order on WhatsApp',
      'weight.select': 'Select Weight',
      'quantity.label': 'Quantity',
      'total.price': 'Total Price',
      'farm.fresh': 'Farm Fresh',
      'reviews': 'Reviews',
      'wazan': 'Weight',
      'search.placeholder': 'Search for your favorite items...',
      'filter.all': 'All',
      'nav.home': 'Home',
      'nav.vegetables': 'Vegetables',
      'nav.fruits': 'Fruits',
      'nav.dryfruits': 'Dry Fruits',
      'nav.grains': 'Grains',
      'nav.kisantips': 'Kisan Tips',
      'nav.gallery': 'Gallery',
      'nav.about': 'About Us',
      'nav.contact': 'Contact',
      'nav.cart': 'Cart',
      'nav.login': 'Login / Register',
      'admin.panel': 'Admin Panel',
      'admin.password': 'Enter Admin Password',
      'admin.unlock': 'Unlock Panel',
      'admin.save': 'Save Changes',
      'admin.remove': 'Remove Discount',
      'admin.percent': 'Discount Percentage (%)',
      'admin.start': 'Start Date/Time',
      'admin.end': 'End Date/Time',
      'admin.success': 'Changes Saved Successfully!',
      'cart.title': 'Your Cart',
      'cart.subtitle': 'View Your Selected Products',
      'cart.empty': 'Your Cart Is Empty',
      'cart.empty.sub': 'Add Some Delicious Items To Your Cart',
      'cart.shopping.start': 'Start Shopping',
      'cart.products.title': 'Your Products',
      'cart.remove': 'Remove',
      'cart.clear': 'Clear Cart',
      'cart.summary.title': 'Order Summary',
      'cart.subtotal': 'Subtotal',
      'cart.delivery': 'Delivery Charges',
      'cart.free': 'Free',
      'cart.delivery.lahore': 'Lahore: Free',
      'cart.delivery.punjab': 'All Punjab Cities: Free',
      'cart.delivery.pakistan': 'All Pakistan: Free',
      'cart.total': 'Total Amount',
      'cart.address.title': 'Delivery Address',
      'cart.address.name': 'Full Name',
      'cart.address.phone': 'Phone Number',
      'cart.address.whatsapp': 'WhatsApp Number',
      'cart.address.city': 'Select Your City',
      'cart.address.area': 'Area/Neighborhood',
      'cart.address.complete': 'Complete Address',
      'cart.address.landmark': 'Landmark',
      'cart.payment.title': 'Payment Method',
      'cart.payment.jazzcash': 'JazzCash',
      'cart.payment.easypaisa': 'EasyPaisa',
      'cart.payment.cod': 'Cash On Delivery',
      'cart.jazzcash.number': 'JazzCash Number',
      'cart.jazzcash.name': 'Account Holder Name',
      'cart.jazzcash.instructions': 'Transfer amount to our JazzCash number and share screenshot on WhatsApp',
      'cart.easypaisa.number': 'EasyPaisa Number',
      'cart.easypaisa.name': 'Account Holder Name',
      'cart.easypaisa.instructions': 'Transfer amount to our EasyPaisa number and share screenshot on WhatsApp',
      'cart.cod.message': 'Pay Cash On Delivery',
      'cart.cod.extra': '',
      'cart.order.whatsapp': 'Order On WhatsApp',
      'cart.sidebar.order.whatsapp': 'Order On WhatsApp',
      'cart.order.complete': 'Complete Order',
      'cart.success.title': 'Thank You {name}!',
      'cart.success.message': 'Your Order Has Been Received!',
      'cart.success.number': 'Order Number',
      'cart.success.info': 'We Will Contact You Soon',
      'cart.success.whatsapp': 'WhatsApp Confirmation Will Be Sent',
      'cart.home': 'Go To Home',
      'cart.view': 'View Cart',
      'cat.vegetables': 'Vegetables',
      'cat.fruits': 'Fruits',
      'cat.dryfruits': 'Dry Fruits',
      'cat.grains': 'Grains',
    }
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
