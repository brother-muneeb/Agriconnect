import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin, Home, Flag, Leaf, Briefcase, Package, Truck, CreditCard, ChevronDown, X, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';

async function checkConnection() {
  return navigator.onLine;
}

const SellerRegister = () => {
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappTouched, setWhatsappTouched] = useState(false);

  // CNIC State & Auto-formatting
  const [cnic, setCnic] = useState('');
  const [cnicTouched, setCnicTouched] = useState(false);

  // Password & Confirm Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isConfirmEmpty = confirmPassword === '';
  const isPasswordMatch = !isConfirmEmpty && confirmPassword === password;
  const isPasswordMismatch = !isConfirmEmpty && confirmPassword !== password;

  const getConfirmPasswordStyle = () => {
    if (isConfirmEmpty) return {};
    if (isPasswordMismatch) return { border: '2px solid #e74c3c', background: '#fff5f5' };
    if (isPasswordMatch) return { border: '2px solid #2ecc71', background: '#f0fff4' };
    return {};
  };

  // Products & Other Products dropdown state
  const [selectedMainProducts, setSelectedMainProducts] = useState<string[]>([]);
  const [isOtherProductsSelected, setIsOtherProductsSelected] = useState(false);
  const [selectedOtherProducts, setSelectedOtherProducts] = useState<string[]>([]);

  const otherProductsDropdownList = [
    { labelEN: 'Vegetables (Sabziyaan)', labelRU: 'Sabziyaan (Vegetables)', value: 'Vegetables' },
    { labelEN: 'Fruits (Phal)', labelRU: 'Phal (Fruits)', value: 'Fruits' },
    { labelEN: 'Dry Fruits', labelRU: 'Dry Fruits', value: 'Dry Fruits' },
    { labelEN: 'Grains (Anaaj)', labelRU: 'Anaaj (Grains)', value: 'Grains' }
  ];

  const formatCnic = (val: string) => {
    const rawDigits = val.replace(/\D/g, '').slice(0, 13);
    let res = '';
    if (rawDigits.length > 0) {
      res = rawDigits.slice(0, 5);
    }
    if (rawDigits.length > 5) {
      res += '-' + rawDigits.slice(5, 12);
    }
    if (rawDigits.length > 12) {
      res += '-' + rawDigits.slice(12, 13);
    }
    return res;
  };

  const acValidateCnic = (val: string) => {
    const digits = val.replace(/[\s-]/g, '');
    if (!digits) {
      return language === 'romanUrdu' ? 'CNIC 13 digits ka hona chahiye!' : 'CNIC must be 13 digits!';
    }
    if (digits.length !== 13) {
      return language === 'romanUrdu' ? 'CNIC 13 digits ka hona chahiye!' : 'CNIC must be 13 digits!';
    }
    return null;
  };

  const cnicErr = acValidateCnic(cnic);
  const showCnicErr = cnicTouched && cnicErr;
  const isCnicValid = cnic && !cnicErr;

  const getCnicStyle = () => {
    if (showCnicErr) return { border: '2px solid #e74c3c', background: '#fff5f5' };
    if (isCnicValid) return { border: '2px solid #2ecc71' };
    return {};
  };

  const handleToggleProduct = (item: string) => {
    const isOther = item === 'Other Products' || item === 'Dusri Cheezain';
    if (isOther) {
      if (isOtherProductsSelected) {
        setIsOtherProductsSelected(false);
        setSelectedOtherProducts([]);
        setSelectedMainProducts(prev => prev.filter(p => p !== item));
      } else {
        setIsOtherProductsSelected(true);
        setSelectedMainProducts(prev => [...prev, item]);
      }
    } else {
      if (selectedMainProducts.includes(item)) {
        setSelectedMainProducts(prev => prev.filter(p => p !== item));
      } else {
        setSelectedMainProducts(prev => [...prev, item]);
      }
    }
  };

  const handleSelectOtherProductOption = (val: string) => {
    if (!val) return;
    if (!selectedOtherProducts.includes(val)) {
      setSelectedOtherProducts(prev => [...prev, val]);
    }
  };

  const handleRemoveOtherProductTag = (val: string) => {
    setSelectedOtherProducts(prev => prev.filter(p => p !== val));
  };

  const acValidateEmail = (val: string) => {
    if(!val) {
      return language === 'romanUrdu' ? 'Email likhna zaroori hai!' : 'Email is required!';
    }
    if(!val.toLowerCase().endsWith('@gmail.com')) {
      return language === 'romanUrdu' 
        ? 'Sirf Gmail qabool hai! Email @gmail.com par khatam honi chahiye.' 
        : 'Only Gmail accepted! Email must end with @gmail.com';
    }
    return null;
  };

  const acValidatePhone = (val: string) => {
    var cleaned = val.trim();
    if(!cleaned) {
      return language === 'romanUrdu' ? 'Phone number likhna zaroori hai!' : 'Phone number is required!';
    }
    cleaned = cleaned.replace(/[\s-]/g, '');
    if(!cleaned.startsWith('+92')) {
      return language === 'romanUrdu' ? 'Number +92 say shuru hona chahiye!' : 'Number must start with +92!';
    }
    var afterCode = cleaned.substring(3);
    if(afterCode.length !== 10) {
      return language === 'romanUrdu' 
        ? 'Number +92 kay baad 10 digits hone chahiye! Total 12 characters: +923001234567'
        : 'Number must have exactly 10 digits after +92! Total 12 characters: +923001234567';
    }
    if(!/^\d{10}$/.test(afterCode)) {
      return language === 'romanUrdu' ? 'Sirf numbers likhein!' : 'Only digits are allowed!';
    }
    return null;
  };

  const emailErr = acValidateEmail(email);
  const showEmailErr = emailTouched && emailErr;
  const isEmailValid = email && !emailErr;

  const getEmailStyle = () => {
    if (showEmailErr) return { border: '2px solid #e74c3c', background: '#fff5f5' };
    if (isEmailValid) return { border: '2px solid #2ecc71' };
    return {};
  };

  const phoneErr = acValidatePhone(phone);
  const showPhoneErr = phoneTouched && phoneErr;
  const isPhoneValid = phone && !phoneErr;

  const getPhoneStyle = () => {
    if (showPhoneErr) return { border: '2px solid #e74c3c', background: '#fff5f5' };
    if (isPhoneValid) return { border: '2px solid #2ecc71' };
    return {};
  };

  const whatsappErr = acValidatePhone(whatsapp);
  const showWhatsappErr = whatsappTouched && whatsappErr;
  const isWhatsappValid = whatsapp && !whatsappErr;

  const getWhatsappStyle = () => {
    if (showWhatsappErr) return { border: '2px solid #e74c3c', background: '#fff5f5' };
    if (isWhatsappValid) return { border: '2px solid #2ecc71' };
    return {};
  };

  const content = {
    romanUrdu: {
      title: "Seller Account Banayein",
      subtitle: "AgriConnect Kay Saath Apna Karobaar Shuru Karein",
      welcome: "Behtareen munaafa aur barri market tak rasayi!",
      section1: "Zaati Maalumat",
      ownerName: "Owner Ka Poora Naam",
      ownerPlaceholder: "Owner ka naam likhain",
      email: "Email Address",
      emailPlaceholder: "Apna email darj karein",
      phone: "Phone Number",
      phonePlaceholder: "+92 300 0000000",
      whatsapp: "WhatsApp Number",
      whatsappPlaceholder: "+92 300 0000000",
      cnic: "CNIC Number",
      cnicPlaceholder: "00000-0000000-0",
      password: "Password",
      passwordPlaceholder: "Mazboot password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Dobara password likhain",
      section2: "Karobaar Ki Maalumat",
      shopName: "Dukaan / Farm Ka Naam",
      shopPlaceholder: "Apnay karobaar ka naam likhain",
      businessType: "Business Type",
      businessPlaceholder: "Business type select karein",
      businessOptions: {
        farmer: "Kisan (Farmer)",
        shopkeeper: "Dukandaar (Shopkeeper)",
        wholesaler: "Wholesaler",
        distributor: "Distributor"
      },
      city: "Shehar (City)",
      cityPlaceholder: "Shehar select karein",
      area: "Area / Mohalla",
      areaPlaceholder: "Area ka naam likhain",
      address: "Mukammal Pata",
      addressPlaceholder: "Dukaan ya farm ka mukammal pata likhain",
      section3: "Aap Kia Bechna Chahte Hain",
      productOptions: ['Sabziyaan', 'Phal', 'Dry Fruits', 'Anaaj', 'Beej', 'Khaad', 'Dairy Products', 'Dusri Cheezain'],
      section4: "Delivery & Payment Maalumat",
      deliveryRange: "Delivery Range",
      rangeOptions: {
        city: "Sirf Apna Shehar",
        punjab: "Poora Punjab",
        pakistan: "Poora Pakistan"
      },
      paymentMethods: "Payment Methods",
      terms: "Main AgriConnect ki Terms and Conditions say mutafiq hoon.",
      permission: "Main AgriConnect ko ijazat deta hoon kay meri dukaan/farm ki information website par show karay.",
      submit: "Seller Account Banayein",
      alreadyHaveAccount: "Pehle say Account hai?",
      login: "Login Karein"
    },
    english: {
      title: "Create Seller Account",
      subtitle: "Start Your Business With AgriConnect",
      welcome: "Best profit and access to a large market!",
      section1: "Personal Information",
      ownerName: "Owner Full Name",
      ownerPlaceholder: "Enter owner's full name",
      email: "Email Address",
      emailPlaceholder: "Enter your email address",
      phone: "Phone Number",
      phonePlaceholder: "+92 300 0000000",
      whatsapp: "WhatsApp Number",
      whatsappPlaceholder: "+92 300 0000000",
      cnic: "CNIC Number",
      cnicPlaceholder: "00000-0000000-0",
      password: "Password",
      passwordPlaceholder: "Strong password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      section2: "Business Information",
      shopName: "Shop/Farm Name",
      shopPlaceholder: "Enter your business name",
      businessType: "Business Type",
      businessPlaceholder: "Select business type",
      businessOptions: {
        farmer: "Farmer",
        shopkeeper: "Shopkeeper",
        wholesaler: "Wholesaler",
        distributor: "Distributor"
      },
      city: "Select City",
      cityPlaceholder: "Select City",
      area: "Area/Neighborhood",
      areaPlaceholder: "Enter area name",
      address: "Complete Address",
      addressPlaceholder: "Enter complete shop or farm address",
      section3: "What Do You Want To Sell",
      productOptions: ['Vegetables', 'Fruits', 'Dry Fruits', 'Grains', 'Seeds', 'Fertilizer', 'Dairy Products', 'Other Products'],
      section4: "Delivery & Payment Information",
      deliveryRange: "Delivery Range",
      rangeOptions: {
        city: "Only My City",
        punjab: "All Punjab",
        pakistan: "All Pakistan"
      },
      paymentMethods: "Payment Methods",
      terms: "I agree with AgriConnect Terms and Conditions",
      permission: "I give AgriConnect permission to show my shop/farm information on website",
      submit: "Create Seller Account",
      alreadyHaveAccount: "Already have account?",
      login: "Login"
    }
  };

  const t = content[language];

  const punjabCities = [
    "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Multan", "Sialkot",
    "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang", "Rahim Yar Khan", "Gujarat",
    "Sahiwal", "Wazirabad", "Kasur", "Okara", "Khanewal", "Hafizabad",
    "Chiniot", "Vehari", "Narowal", "Mianwali", "Pakpattan", "Attock",
    "Chakwal", "Jhelum", "Khushab", "Muzaffargarh", "Layyah", "Lodhran"
  ];

  const sellerSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const firebase = (window as any).firebase;

    function getVal(ids: string[]) {
      for(var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]) as HTMLInputElement;
        if(el) return el.value.trim();
      }
      return '';
    }
    
    var ownerName = getVal(['seller-name','owner-name','sellerName','ownerName']);
    var emailVal = email.trim();
    var phoneVal = phone.trim();
    var whatsappVal = whatsapp.trim();
    var cnicVal = cnic.trim();
    var passwordVal = password || getVal(['seller-password','sellerPassword']);
    var confirmPassVal = confirmPassword || getVal(['seller-confirm','sellerConfirm']);
    var shopName = getVal(['shop-name','shopName','farmName']);
    var businessType = (document.getElementById('business-type') as HTMLSelectElement)?.value || '';
    var city = (document.getElementById('seller-city') as HTMLSelectElement)?.value || '';
    var area = getVal(['seller-area','sellerArea']);
    var address = getVal(['seller-address','sellerAddress']);
    var landmark = getVal(['seller-landmark','sellerLandmark']);
    
    // Combine products: main selected products (without the raw 'Other Products' label) + selected dropdown other products
    const rawSelected = selectedMainProducts.filter(p => p !== 'Other Products' && p !== 'Dusri Cheezain');
    const finalSelectedProducts = Array.from(new Set([
      ...rawSelected,
      ...selectedOtherProducts
    ]));

    // If empty fallback
    if (finalSelectedProducts.length === 0) {
      finalSelectedProducts.push('Vegetables');
    }
    
    var deliveryRange = (document.getElementById('delivery-range') as HTMLSelectElement)?.value || 'Punjab';
    
    const acShowSellerMsg = (message: string, type: 'error' | 'success') => {
      const existing = document.getElementById('seller-msg');
      if(existing) existing.remove();
      const div = document.createElement('div');
      div.id = 'seller-msg';
      div.style.cssText = type === 'error'
        ? 'background:#fff3f3;border:1px solid #e74c3c;border-left:4px solid #e74c3c;border-radius:8px;padding:12px 16px;color:#c0392b;font-size:14px;margin-top:12px;'
        : 'background:#f0fff4;border:1px solid #2ecc71;border-left:4px solid #2ecc71;border-radius:8px;padding:12px 16px;color:#27ae60;font-size:14px;margin-top:12px;text-align:center;';
      div.innerHTML = (type === 'error' ? '❌ ' : '✅ ') + message;
      const form = document.getElementById('seller-signup-form');
      if(form) form.appendChild(div);
      div.scrollIntoView({behavior:'smooth'});
    };

    // Validation
    if(!ownerName) { acShowSellerMsg('Naam likhna zaroori hai!', 'error'); return; }

    var emailErrVal = acValidateEmail(emailVal);
    if(emailErrVal) {
      setEmailTouched(true);
      acShowSellerMsg(emailErrVal, 'error');
      return;
    }

    var phoneErrVal = acValidatePhone(phoneVal);
    if(phoneErrVal) {
      setPhoneTouched(true);
      acShowSellerMsg(phoneErrVal, 'error');
      return;
    }

    var whatsappErrVal = acValidatePhone(whatsappVal);
    if(whatsappErrVal) {
      setWhatsappTouched(true);
      acShowSellerMsg(whatsappErrVal, 'error');
      return;
    }

    // CNIC Validation: Exactly 13 digits
    var cnicErrVal = acValidateCnic(cnicVal);
    if(cnicErrVal) {
      setCnicTouched(true);
      acShowSellerMsg(cnicErrVal, 'error');
      return;
    }

    if(!passwordVal || passwordVal.length < 6) { 
      acShowSellerMsg(
        language === 'romanUrdu' ? 'Password kam az kam 6 characters ka hona chahiye!' : 'Password must be at least 6 characters!', 
        'error'
      ); 
      return; 
    }
    if(!confirmPassVal || passwordVal !== confirmPassVal) { 
      acShowSellerMsg(
        language === 'romanUrdu' ? 'Pehle password match karein!' : 'Please match passwords first!', 
        'error'
      ); 
      return; 
    }
    if(!shopName) { acShowSellerMsg('Dukaan ya farm ka naam likhein!', 'error'); return; }
    
    // Check connection before Firebase auth call
    var isOnline = await checkConnection();
    if(!isOnline) {
      acShowSellerMsg('Internet connection nahi hai! Internet check karein.', 'error');
      return;
    }

    const sellerBtn = document.getElementById('seller-submit-btn') as HTMLButtonElement;
    if(sellerBtn) {
      sellerBtn.disabled = true;
      sellerBtn.textContent = 'Account ban raha hai...';
    }
    
    var maxRetries = 3;
    var retryCount = 0;

    async function attemptSellerRegister() {
      try {
        return await firebase.auth().createUserWithEmailAndPassword(emailVal, passwordVal);
      } catch(error: any) {
        if(error && error.code === 'auth/network-request-failed' && retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptSellerRegister();
        }
        throw error;
      }
    }

    try {
      var userCred = await attemptSellerRegister();
      var user = userCred.user;
      
      await user.updateProfile({ displayName: ownerName });
      
      var colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#e91e63','#00bcd4','#ff5722'];
      var avatarColor = colors[Math.floor(Math.random() * colors.length)];
      localStorage.setItem('ac_avatar_' + user.uid, avatarColor);
      localStorage.setItem('ac_avatar_color', avatarColor);
      
      var userData = {
        uid: user.uid,
        userType: 'seller',
        fullName: ownerName,
        email: emailVal,
        phone: phoneVal,
        whatsapp: whatsappVal || phoneVal,
        cnic: cnicVal,
        shopName: shopName,
        businessType: businessType || '',
        city: city || '',
        area: area || '',
        address: address || '',
        landmark: landmark || '',
        products: finalSelectedProducts,
        otherProducts: selectedOtherProducts,
        deliveryRange: deliveryRange || 'Punjab',
        loginMethod: 'email',
        avatarColor: avatarColor,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        isActive: true
      };

      // Save to users collection
      await firebase.firestore().collection('users').doc(user.uid).set(userData);
      
      // Save to sellers collection
      await firebase.firestore().collection('sellers').doc(user.uid).set({
        uid: user.uid,
        ownerName: ownerName,
        email: emailVal,
        phone: phoneVal,
        whatsapp: whatsappVal || phoneVal,
        cnic: cnicVal,
        shopName: shopName,
        businessType: businessType || '',
        city: city || '',
        area: area || '',
        address: address || '',
        landmark: landmark || '',
        products: finalSelectedProducts,
        otherProducts: selectedOtherProducts,
        deliveryRange: deliveryRange || 'Punjab',
        loginMethod: 'email',
        avatarColor: avatarColor,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        isActive: true,
        isApproved: false
      });

      // Save to custom collection
      await firebase.firestore()
        .collection(
          userData.fullName + 
          ' (' + 
          userData.userType.charAt(0).toUpperCase() + 
          userData.userType.slice(1) + 
          ')'
        )
        .doc(userData.email)
        .set(userData);
      
      localStorage.setItem('ac_user', JSON.stringify({
        uid: user.uid,
        fullName: ownerName,
        email: emailVal,
        phone: phoneVal,
        userType: 'seller',
        shopName: shopName,
        loginMethod: 'email',
        avatarColor: avatarColor
      }));
      
      acShowSellerMsg('Seller account ban gaya! Approval ka intezaar karein.', 'success');
      
      setTimeout(function() {
        window.location.href = '/';
      }, 1500);
      
    } catch(error: any) {
      if(sellerBtn) {
        sellerBtn.disabled = false;
        sellerBtn.textContent = language === 'romanUrdu' ? 'Seller Account Banayein' : 'Create Seller Account';
      }
      
      if(error && error.code === 'auth/network-request-failed') {
        acShowSellerMsg('Internet connection masla! Page refresh karein aur dobara try karein.', 'error');
      } else if(error.code === 'auth/email-already-in-use') {
        acShowSellerMsg('Yeh email pehle se register hai!', 'error');
      } else {
        acShowSellerMsg('Kuch masla hua: ' + error.message, 'error');
      }
    }
  };

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header */}
      <section className="relative h-56 md:h-72 flex items-center justify-center overflow-hidden ac-fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1920)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-agri-green/90 to-agri-orange/90 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-4"
          >
            {t.title}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 font-medium"
          >
            {t.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Seller Form Section */}
      <section className="flex-1 px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 ac-zoom-in ac-delay-1"
        >
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-10 h-10 text-agri-orange fill-agri-orange" />
              <span className="text-3xl font-serif font-black text-agri-green">AgriConnect</span>
            </div>
            <p className="text-gray-500 font-medium">{t.welcome}</p>
          </div>

          <form id="seller-signup-form" onSubmit={sellerSignup} className="space-y-16">
            {/* Personal Info */}
            <div>
              <h3 className="text-2xl font-bold text-agri-green mb-8 flex items-center gap-3 border-b border-gray-100 pb-4">
                <User className="w-7 h-7 text-agri-orange" />
                {t.section1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.ownerName}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="seller-name" type="text" placeholder={t.ownerPlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      id="seller-email" 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailTouched(true);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      placeholder={t.emailPlaceholder} 
                      style={getEmailStyle()}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none" 
                    />
                    {showEmailErr && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">⚠️</span>
                    )}
                    {isEmailValid && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#2ecc71]">✓</span>
                    )}
                  </div>
                  {showEmailErr && (
                    <p className="mt-1.5 text-xs font-bold text-[#e74c3c] ml-1 animate-in fade-in slide-in-from-top-1">
                      {emailErr}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.phone}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      id="seller-phone" 
                      type="tel" 
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneTouched(true);
                      }}
                      onBlur={() => setPhoneTouched(true)}
                      onFocus={() => {
                        if (!phone || phone.trim() === '') {
                          setPhone('+92');
                        }
                      }}
                      placeholder={t.phonePlaceholder} 
                      style={getPhoneStyle()}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none" 
                    />
                    {showPhoneErr && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#e74c3c] font-bold">!</span>
                    )}
                    {isPhoneValid && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#2ecc71]">✓</span>
                    )}
                  </div>
                  {showPhoneErr && (
                    <p className="mt-1.5 text-xs font-bold text-[#e74c3c] ml-1 animate-in fade-in slide-in-from-top-1">
                      {phoneErr}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.whatsapp}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      id="seller-whatsapp" 
                      type="tel" 
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(e.target.value);
                        setWhatsappTouched(true);
                      }}
                      onBlur={() => setWhatsappTouched(true)}
                      onFocus={() => {
                        if (!whatsapp || whatsapp.trim() === '') {
                          setWhatsapp('+92');
                        }
                      }}
                      placeholder={t.whatsappPlaceholder} 
                      style={getWhatsappStyle()}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none" 
                    />
                    {showWhatsappErr && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#e74c3c] font-bold">!</span>
                    )}
                    {isWhatsappValid && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#2ecc71]">✓</span>
                    )}
                  </div>
                  {showWhatsappErr && (
                    <p className="mt-1.5 text-xs font-bold text-[#e74c3c] ml-1 animate-in fade-in slide-in-from-top-1">
                      {whatsappErr}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.cnic}</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      id="seller-cnic" 
                      type="text" 
                      value={cnic}
                      onChange={(e) => {
                        const formatted = formatCnic(e.target.value);
                        setCnic(formatted);
                        setCnicTouched(true);
                      }}
                      onBlur={() => setCnicTouched(true)}
                      placeholder={t.cnicPlaceholder} 
                      maxLength={15}
                      style={getCnicStyle()}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none font-mono" 
                    />
                    {showCnicErr && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#e74c3c] font-bold">!</span>
                    )}
                    {isCnicValid && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#2ecc71] font-bold">✓</span>
                    )}
                  </div>
                  {showCnicErr && (
                    <p className="mt-1.5 text-xs font-bold text-[#e74c3c] ml-1 animate-in fade-in slide-in-from-top-1">
                      {cnicErr}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      id="seller-password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder} 
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-agri-orange transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.confirmPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      id="seller-confirm" 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder} 
                      style={getConfirmPasswordStyle()}
                      className="w-full pl-12 pr-20 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none transition-colors" 
                    />
                    {isPasswordMismatch && (
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 text-lg text-[#e74c3c] font-bold select-none">
                        ✗
                      </span>
                    )}
                    {isPasswordMatch && (
                      <span className="absolute right-12 top-1/2 -translate-y-1/2 text-lg text-[#2ecc71] font-bold select-none">
                        ✓
                      </span>
                    )}
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-agri-orange transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {isPasswordMismatch && (
                    <p className="mt-1.5 text-xs font-bold text-[#e74c3c] ml-1 animate-in fade-in slide-in-from-top-1">
                      {language === 'romanUrdu' ? 'Password match nahi kar raha ✗' : 'Password does not match ✗'}
                    </p>
                  )}
                  {isPasswordMatch && (
                    <p className="mt-1.5 text-xs font-bold text-[#2ecc71] ml-1 animate-in fade-in slide-in-from-top-1">
                      {language === 'romanUrdu' ? 'Password match kar gaya ✓' : 'Password matched ✓'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div>
              <h3 className="text-2xl font-bold text-agri-green mb-8 flex items-center gap-3 border-b border-gray-100 pb-4">
                <Briefcase className="w-7 h-7 text-agri-orange" />
                {t.section2}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.shopName}</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="shop-name" type="text" placeholder={t.shopPlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.businessType}</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select id="business-type" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none appearance-none">
                      <option value="">{t.businessPlaceholder}</option>
                      <option value="Kisan">{t.businessOptions.farmer}</option>
                      <option value="Dukandaar">{t.businessOptions.shopkeeper}</option>
                      <option value="Wholesaler">{t.businessOptions.wholesaler}</option>
                      <option value="Distributor">{t.businessOptions.distributor}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.city}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select id="seller-city" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none appearance-none">
                      <option value="">{t.cityPlaceholder}</option>
                      {punjabCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.area}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="seller-area" type="text" placeholder={t.areaPlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.address}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea id="seller-address" rows={3} placeholder={t.addressPlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none resize-none"></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div>
              <h3 className="text-2xl font-bold text-agri-green mb-8 flex items-center gap-3 border-b border-gray-100 pb-4">
                <Package className="w-7 h-7 text-agri-orange" />
                {t.section3}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {t.productOptions.map(item => {
                  const isOther = item === 'Other Products' || item === 'Dusri Cheezain';
                  const isChecked = isOther 
                    ? isOtherProductsSelected 
                    : selectedMainProducts.includes(item);

                  return (
                    <label 
                      key={item} 
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all group ${
                        isChecked 
                          ? 'bg-agri-orange/10 border-agri-orange ring-2 ring-agri-orange/30' 
                          : 'bg-gray-50 border-gray-100 hover:bg-agri-orange/5 hover:border-agri-orange/30'
                      }`}
                    >
                      <input 
                        id={`product_${item}`} 
                        value={item} 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleToggleProduct(item)}
                        className="product-checkbox w-5 h-5 rounded border-gray-300 text-agri-orange focus:ring-agri-orange" 
                      />
                      <span className={`font-bold transition-colors ${isChecked ? 'text-agri-orange' : 'text-gray-700 group-hover:text-agri-orange'}`}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Other Products Multi-Select Dropdown */}
              <AnimatePresence>
                {isOtherProductsSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-6 bg-orange-50/70 dark:bg-orange-950/20 rounded-2xl border-2 border-orange-200 dark:border-orange-900/40 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-1">
                        {language === 'romanUrdu' ? 'Dusri Products Select Karein:' : 'Select Other Products:'}
                      </label>
                      <p className="text-xs text-gray-600 mb-3">
                        {language === 'romanUrdu' 
                          ? 'Dropdown se categories select karein (ek se zyada bhi select kar sakte hain):' 
                          : 'Choose categories from the dropdown below (you can select multiple):'}
                      </p>
                      <div className="relative max-w-md">
                        <select
                          id="other-products-select"
                          value=""
                          onChange={(e) => handleSelectOtherProductOption(e.target.value)}
                          className="w-full pl-4 pr-10 py-3.5 bg-white border border-orange-300 rounded-xl font-medium text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-agri-orange appearance-none cursor-pointer shadow-sm"
                        >
                          <option value="" disabled>
                            {language === 'romanUrdu' ? '-- Category muntakhib karein --' : '-- Select a category --'}
                          </option>
                          {otherProductsDropdownList.map((opt) => (
                            <option 
                              key={opt.value} 
                              value={opt.value}
                              disabled={selectedOtherProducts.includes(opt.value)}
                            >
                              {language === 'romanUrdu' ? opt.labelRU : opt.labelEN} {selectedOtherProducts.includes(opt.value) ? '✓' : ''}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Selected Tags Display */}
                    {selectedOtherProducts.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-bold text-gray-700">
                          {language === 'romanUrdu' ? 'Muntakhib Shuda Categories:' : 'Selected Categories:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedOtherProducts.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-agri-orange text-white text-xs font-bold shadow-sm"
                            >
                              <span>
                                {tag === 'Vegetables' ? (language === 'romanUrdu' ? 'Vegetables (Sabziyaan)' : 'Vegetables (Sabziyaan)') :
                                 tag === 'Fruits' ? (language === 'romanUrdu' ? 'Fruits (Phal)' : 'Fruits (Phal)') :
                                 tag === 'Dry Fruits' ? 'Dry Fruits' :
                                 tag === 'Grains' ? (language === 'romanUrdu' ? 'Grains (Anaaj)' : 'Grains (Anaaj)') : tag}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveOtherProductTag(tag)}
                                className="w-4 h-4 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors"
                                title="Remove tag"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Delivery & Payment */}
            <div>
              <h3 className="text-2xl font-bold text-agri-green mb-8 flex items-center gap-3 border-b border-gray-100 pb-4">
                <Truck className="w-7 h-7 text-agri-orange" />
                {t.section4}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 ml-1">{t.deliveryRange}</label>
                  <div className="relative">
                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select id="delivery-range" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-orange outline-none appearance-none">
                      <option value="Sirf Apna Shehar">{t.rangeOptions.city}</option>
                      <option value="Poora Punjab">{t.rangeOptions.punjab}</option>
                      <option value="Poora Pakistan">{t.rangeOptions.pakistan}</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.paymentMethods}</label>
                  <div className="flex flex-wrap gap-4">
                    {['Cash on Delivery', 'JazzCash', 'EasyPaisa'].map(method => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input name={`payment_${method}`} type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-agri-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-agri-orange"></div>
                        </div>
                        <span className="text-sm font-bold text-gray-600">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-4 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input type="checkbox" required className="mt-1 w-6 h-6 rounded border-gray-300 text-agri-orange focus:ring-agri-orange" />
                <span className="text-gray-600 font-medium">{t.terms}</span>
              </label>
              <label className="flex items-start gap-4 cursor-pointer group">
                <input type="checkbox" required className="mt-1 w-6 h-6 rounded border-gray-300 text-agri-orange focus:ring-agri-orange" />
                <span className="text-gray-600 font-medium">{t.permission}</span>
              </label>
            </div>

            <div className="space-y-8">
              <button id="seller-submit-btn" type="submit" className="w-full bg-agri-orange text-white py-6 rounded-2xl font-bold text-2xl hover:bg-orange-600 transition-all shadow-2xl shadow-agri-orange/20">
                {t.submit}
              </button>
              
              <p className="text-center text-gray-600 font-bold text-lg">
                {t.alreadyHaveAccount} <Link to="/login" className="text-agri-green hover:underline">{t.login}</Link>
              </p>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default SellerRegister;
