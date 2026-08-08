import React, { useState } from 'react';
import { Wheat, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Footer = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessBox, setShowSuccessBox] = useState(false);
  
  const [activePopup, setActivePopup] = useState<'privacy' | 'terms' | null>(null);

  const privacyPolicyContent = {
    english: {
      title: "Privacy Policy",
      text: `AgriConnect Privacy Policy

1. Data Collection:
We collect your name, email, phone
and address for order delivery only.

2. Data Usage:
Your data is used only for:
Order processing and delivery
WhatsApp order confirmation
Email updates if subscribed

3. Data Security:
Your data is stored securely
in Firebase database.
We never share your data
with third parties.

4. Contact:
For privacy concerns contact:
ahmedmuneeb036@gmail.com
+92 301 9515764

Last updated: June 2026`
    },
    romanUrdu: {
      title: "Privacy Policy",
      text: `AgriConnect Privacy Policy

1. Data Collection:
Hum sirf order delivery ke liye aapka naam, email, phone number aur pata jama karte hain.

2. Data Usage:
Aapka data sirf in kamo ke liye istemal hota hai:
Order processing aur delivery
WhatsApp par order ki tasdeeq
Email updates agar aap ne subscribe kiya ho

3. Data Security:
Aapka data Firebase database mein mehfooz tareeqay se store kiya jata hai.
Hum aapka data kabhi kisi teesre bande (third party) ke sath share nahi karte.

4. Contact:
Privacy ke masail ke liye humse rabta karein:
ahmedmuneeb036@gmail.com
+92 301 9515764

Aakhri dafa tabdeel kiya gaya: June 2026`
    }
  };

  const termsContent = {
    english: {
      title: "Terms & Conditions",
      text: `AgriConnect Terms & Conditions

1. Orders:
All orders are subject to
product availability.
We reserve the right to
cancel any order.

2. Delivery:
Free delivery across Punjab.
Delivery time: 24-48 hours.
We are not responsible for
delays due to weather or
other circumstances.

3. Payments:
We accept JazzCash, EasyPaisa
and Cash on Delivery.
All payments are secure.

4. Returns:
Fresh products cannot be returned.
Contact us within 2 hours
of delivery for any issues.

5. Contact:
ahmedmuneeb036@gmail.com
+92 301 9515764
Main Market, Tarikha, Gujrat

Last updated: June 2026`
    },
    romanUrdu: {
      title: "Terms & Conditions",
      text: `AgriConnect Terms & Conditions

1. Orders:
Tamam orders products ki dastyabi ke mutabiq hote hain.
Hum kisi bhi order ko mansookh (cancel) karne ka haq rakhte hain.

2. Delivery:
Pure Punjab mein free delivery.
Delivery ka waqt: 24-48 ghante.
Mausam ya deegar masail ki wajah se delivery mein takheer (delay) ke liye hum zimmadar nahi hain.

3. Payments:
Hum JazzCash, EasyPaisa aur Cash on Delivery (COD) qabool karte hain.
Tamam adaigiyan bilkul mehfooz hain.

4. Returns:
Taaza products (sabziyan aur phal) wapas nahi kiye ja sakte.
Kisi bhi masle ke liye delivery ke 2 ghante ke andar humse rabta karein.

5. Contact:
ahmedmuneeb036@gmail.com
+92 301 9515764
Main Market, Tarikha, Gujrat

Aakhri dafa tabdeel kiya gaya: June 2026`
    }
  };

  const getTypingError = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    if (!trimmed.toLowerCase().endsWith('@gmail.com')) {
      return language === 'romanUrdu' ? 'Sirf Gmail address qabool hai!' : 'Only Gmail address accepted!';
    }
    return null;
  };

  const validateEmailOnInput = (val: string) => {
    const err = getTypingError(val);
    setValidationError(err);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailTouched) {
      validateEmailOnInput(val);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    validateEmailOnInput(email);
  };

  const isValidGmail = email.trim().toLowerCase().endsWith('@gmail.com');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    
    const trimmed = email.trim();
    if (!trimmed) {
      setValidationError(language === 'romanUrdu' ? 'Email likhna zaroori hai!' : 'Please enter your email!');
      return;
    }
    
    if (!trimmed.toLowerCase().endsWith('@gmail.com')) {
      setValidationError(language === 'romanUrdu' ? 'Sirf Gmail qabool hai!' : 'Only Gmail accepted!');
      return;
    }

    setValidationError(null);

    // STEP 2 - SEND WELCOME EMAIL:
    var subject = encodeURIComponent(
      "AgriConnect Newsletter Mein Khush Aamdeed!"
    );

    var body = encodeURIComponent(
      "Assalam o Alaikum!\n\n" +
      "AgriConnect Newsletter Mein\n" +
      "Aapka Shukriya!\n\n" +
      "Aap bilkul sahi jagah aye hain!\n" +
      "Hum aapko hamesha yeh updates\n" +
      "dete rahenge:\n\n" +
      "✅ Taaze products ki updates\n" +
      "✅ Special discounts aur offers\n" +
      "✅ Naye products ki info\n" +
      "✅ Seasonal tips aur advice\n" +
      "✅ Mandi rates updates\n\n" +
      "Aapka AgriConnect family mein\n" +
      "khush aamdeed!\n\n" +
      "Punjab ki taazgi ab aapke ghar tak!\n\n" +
      "Shukriya\n" +
      "AgriConnect Team\n" +
      "Phone: +92 301 9515764\n" +
      "Email: ahmedmuneeb036@gmail.com\n" +
      "Address: Main Market, Tarikha,\n" +
      "Gujrat, Punjab"
    );

    window.open(
      "mailto:" + trimmed +
      "?subject=" + subject +
      "&body=" + body
    );

    // STEP 3 - SHOW SUCCESS MESSAGE:
    setShowSuccessBox(true);
    setEmail('');
    setEmailTouched(false);

    // STEP 4 - SAVE TO FIREBASE:
    try {
      await addDoc(collection(db, 'newsletter'), {
        email: trimmed,
        subscribedAt: serverTimestamp(),
        source: 'footer_newsletter'
      });
    } catch (err) {
      console.error("Error saving newsletter to Firestore:", err);
    }

    setTimeout(() => {
      setShowSuccessBox(false);
    }, 5000);
  };

  const quickLinks = [
    { name: language === 'romanUrdu' ? 'Home' : 'Home', href: '/' },
    { name: language === 'romanUrdu' ? 'Shop' : 'Shop', href: '/sabziyaan' },
    { name: language === 'romanUrdu' ? 'Register/Login' : 'Register/Login', href: '/login' },
    { name: language === 'romanUrdu' ? 'Kisan Tips' : 'Kisan Tips', href: '/kisan-tips' },
    { name: language === 'romanUrdu' ? 'Gallery' : 'Gallery', href: '/gallery' },
    { name: language === 'romanUrdu' ? 'Contact' : 'Contact', href: '/contact' },
    { name: language === 'romanUrdu' ? 'About Us' : 'About Us', href: '/about' },
    { name: language === 'romanUrdu' ? 'Track Order' : 'Track Order', href: '/track-order' }
  ];

  return (
    <>
      <footer className="bg-agri-green text-white pt-20 pb-10 ac-fade-in">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Brand */}
            <div className="ac-fade-in">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <div className="bg-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                  <Wheat className="text-agri-green w-6 h-6" />
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight">
                  AgriConnect
                </span>
              </Link>
              <p className="text-white/70 leading-relaxed mb-8 font-medium">
                {language === 'romanUrdu' ? 'Punjab Kay Taazay Products Seedha Aapke Ghar Tak' : 'Fresh Products From Punjab Directly To Your Home'}
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com/agriconnect" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-xl hover:bg-[#1877F2] transition-all hover:-translate-y-1"><Facebook className="w-5 h-5" /></a>
                <a href="https://instagram.com/agriconnect" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-xl hover:bg-[#E4405F] transition-all hover:-translate-y-1"><Instagram className="w-5 h-5" /></a>
                <a href="https://x.com/agriconnect" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-xl hover:bg-black transition-all hover:-translate-y-1"><Twitter className="w-5 h-5" /></a>
                <a href="https://youtube.com/agriconnect" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-xl hover:bg-[#FF0000] transition-all hover:-translate-y-1"><Youtube className="w-5 h-5" /></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="ac-fade-in">
              <h4 className="text-xl font-bold mb-8 relative inline-block">
                {language === 'romanUrdu' ? 'Quick Links' : 'Quick Links'}
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white/20 rounded-full" />
              </h4>
              <ul className="grid grid-cols-1 gap-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-white transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="ac-fade-in">
              <h4 className="text-xl font-bold mb-8 relative inline-block">
                {language === 'romanUrdu' ? 'Hamse Rabta Karein' : 'Contact Us'}
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white/20 rounded-full" />
              </h4>
              <ul className="space-y-6">
                <li>
                  <a href="tel:+923019515764" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-medium">+92 301 9515764</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/923019515764" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="font-medium">+92 301 9515764</span>
                  </a>
                </li>
                <li className="flex items-start gap-4 text-white/70">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="font-medium leading-relaxed">Main Market, Tarikha, Gujrat, Punjab</span>
                </li>
                <li>
                  <a href="mailto:ahmedmuneeb036@gmail.com" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-medium">ahmedmuneeb036@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="ac-fade-in">
              <h4 className="text-xl font-bold mb-8 relative inline-block">
                Newsletter
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white/20 rounded-full" />
              </h4>
              <p className="text-white/70 mb-6 font-medium">
                {language === 'romanUrdu' ? 'Hamare Saath Judein Aur Taazay Updates Paayein' : 'Join Us And Get Fresh Updates'}
              </p>
              
              {showSuccessBox ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.4)' }}
                  className="p-5 rounded-2xl border text-center font-bold text-sm leading-relaxed text-green-100"
                >
                  {language === 'romanUrdu' 
                    ? "✅ Shukriya! Aapko welcome email bhej di gayi hai! Apni Gmail check karein!"
                    : "✅ Thank You! Welcome email has been sent! Please check your Gmail!"
                  }
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3" noValidate>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder={language === 'romanUrdu' ? 'Aapki Email Darj Karein' : 'Enter Your Email'}
                      className={`w-full bg-white/10 border rounded-xl px-4 py-4 text-sm focus:outline-none transition-all ${
                        validationError 
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500' 
                          : isValidGmail 
                            ? 'border-green-500 focus:ring-1 focus:ring-green-500' 
                            : 'border-white/20 focus:border-white'
                      }`}
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                    />
                    {validationError && (
                      <p className="text-red-400 text-xs font-bold mt-1.5 ml-1">
                        {validationError}
                      </p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-white text-agri-green py-4 rounded-xl font-black text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {language === 'romanUrdu' ? 'Join Karein' : 'Join Now'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
              <p className="text-white/50 text-sm font-medium">
                © 2025 AgriConnect. {language === 'romanUrdu' ? 'Tamam Huqooq Mahfooz Hain.' : 'All Rights Reserved.'}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/30 font-bold uppercase tracking-widest">Payments:</span>
                <div className="flex gap-3">
                  {['JazzCash', 'EasyPaisa', 'COD'].map(method => (
                    <div key={method} className="bg-white/5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider border border-white/10">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-8 text-white/30 text-xs font-bold uppercase tracking-widest">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActivePopup('privacy'); }} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActivePopup('terms'); }} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>

      {activePopup && (
        <>
          {/* Dark overlay behind popup */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.6)',
              zIndex: 999998,
            }}
            onClick={() => setActivePopup(null)}
          />
          
          {/* White card centered on screen */}
          <div 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              zIndex: 999999,
              width: '90%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              backgroundColor: '#ffffff',
            }}
            className="flex flex-col text-gray-800"
          >
            {/* Green header with title */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #1a6b3c, #2d9e5e)',
                padding: '20px',
                position: 'relative'
              }}
              className="text-white flex items-center justify-between"
            >
              <h3 className="text-xl font-bold">
                {activePopup === 'privacy' 
                  ? (language === 'romanUrdu' ? privacyPolicyContent.romanUrdu.title : privacyPolicyContent.english.title)
                  : (language === 'romanUrdu' ? termsContent.romanUrdu.title : termsContent.english.title)
                }
              </h3>
              {/* Close X button top right */}
              <button 
                onClick={() => setActivePopup(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                }}
                className="flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer border-none outline-none"
              >
                ✕
              </button>
            </div>

            {/* White body with content */}
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                {activePopup === 'privacy' 
                  ? (language === 'romanUrdu' ? privacyPolicyContent.romanUrdu.text : privacyPolicyContent.english.text)
                  : (language === 'romanUrdu' ? termsContent.romanUrdu.text : termsContent.english.text)
                }
              </pre>
            </div>

            {/* Band Karein / Close button at bottom */}
            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
              <button 
                onClick={() => setActivePopup(null)}
                className="px-6 py-2.5 bg-agri-green text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity cursor-pointer border-none outline-none"
              >
                {language === 'romanUrdu' ? 'Band Karein' : 'Close'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Footer;
