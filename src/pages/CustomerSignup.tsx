import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin, Home, Flag, Leaf, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';

async function checkConnection() {
  return navigator.onLine;
}

const CustomerSignup = () => {
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
      title: "Naya Customer Account Banayein",
      welcome: "AgriConnect family ka hissa banain!",
      section1: "Bunyadi Maalumat",
      fullName: "Mukammal Naam",
      fullNamePlaceholder: "Apna poora naam likhain",
      email: "Email Address",
      emailPlaceholder: "Apna email darj karein",
      phone: "Phone Number",
      phonePlaceholder: "+92 300 0000000",
      whatsapp: "WhatsApp Number",
      whatsappPlaceholder: "+92 300 0000000",
      password: "Password",
      passwordPlaceholder: "Kam az kam 8 huroof",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Dobara password likhain",
      section2: "Apna Pata Darj Karein",
      city: "Shehar (City)",
      cityPlaceholder: "Shehar select karein",
      area: "Area / Mohalla",
      areaPlaceholder: "Apnay area ka naam likhain",
      address: "Mukammal Pata",
      addressPlaceholder: "Ghar ka mukammal pata likhain",
      landmark: "Ghar ka Nishaan (Landmark)",
      landmarkPlaceholder: "Mishal ke tor par: Masjid ke kareeb ya School ke samne",
      terms: "Main AgriConnect ki Terms and Conditions say mutafiq hoon.",
      offers: "Main chahta hoon kay AgriConnect mujhe offers aur updates bhejay.",
      submit: "Account Banayein",
      orSignupWith: "Ya Phir In Say Signup Karein",
      alreadyHaveAccount: "Pehle say Account hai?",
      login: "Login Karein"
    },
    english: {
      title: "Create New Customer Account",
      welcome: "Become a part of the AgriConnect family!",
      section1: "Basic Information",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      email: "Email Address",
      emailPlaceholder: "Enter your email address",
      phone: "Phone Number",
      phonePlaceholder: "+92 300 0000000",
      whatsapp: "WhatsApp Number",
      whatsappPlaceholder: "+92 300 0000000",
      password: "Password",
      passwordPlaceholder: "At least 8 characters",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      section2: "Enter Your Address",
      city: "Select Your City",
      cityPlaceholder: "Select City",
      area: "Area/Neighborhood",
      areaPlaceholder: "Enter your area name",
      address: "Complete Home Address",
      addressPlaceholder: "Enter your complete home address",
      landmark: "Home Landmark",
      landmarkPlaceholder: "e.g. Near Mosque or Opposite School",
      terms: "I agree with AgriConnect Terms and Conditions",
      offers: "I want AgriConnect to send me offers and updates",
      submit: "Create Account",
      orSignupWith: "Or Signup With",
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

  const customerSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const firebase = (window as any).firebase;

    function getVal(ids: string[]) {
      for(var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]) as HTMLInputElement;
        if(el) return el.value.trim();
      }
      return '';
    }
    
    var fullName = getVal(['signup-name','customer-name','full-name','name','fullName']);
    var email = getVal(['signup-email','customer-email','email','reg-email']);
    var phone = getVal(['signup-phone','customer-phone','phone','phoneNumber']);
    var whatsapp = getVal(['signup-whatsapp','whatsapp','whatsappNumber','wp-number']);
    var password = getVal(['signup-password','customer-password','password','reg-password']);
    var confirmPass = getVal(['signup-confirm','confirm-password','confirmPassword','conf-pass']);
    var city = getVal(['signup-city','customer-city','city','citySelect']);
    var area = getVal(['signup-area','customer-area','area','mohalla']);
    var address = getVal(['signup-address','customer-address','address','fullAddress']);
    var landmark = getVal(['signup-landmark','customer-landmark','landmark','nearBy']);
    
    const acShowSignupMsg = (message: string, type: 'error' | 'success') => {
      const existing = document.getElementById('signup-msg');
      if(existing) existing.remove();
      
      const div = document.createElement('div');
      div.id = 'signup-msg';
      div.style.cssText = type === 'error' 
        ? 'background:#fff3f3;border:1px solid #e74c3c;border-left:4px solid #e74c3c;border-radius:8px;padding:12px 16px;color:#c0392b;font-size:14px;margin-top:12px;'
        : 'background:#f0fff4;border:1px solid #2ecc71;border-left:4px solid #2ecc71;border-radius:8px;padding:12px 16px;color:#27ae60;font-size:14px;margin-top:12px;text-align:center;';
      div.innerHTML = (type === 'error' ? '❌ ' : '✅ ') + message;
      
      const form = document.getElementById('customer-signup-form');
      if(form) form.appendChild(div);
      div.scrollIntoView({behavior:'smooth'});
    };

    // VALIDATION
    if(!fullName) { acShowSignupMsg('Naam likhna zaroori hai!', 'error'); return; }

    var emailErrVal = acValidateEmail(email);
    if(emailErrVal) {
      setEmailTouched(true);
      acShowSignupMsg(emailErrVal, 'error');
      return;
    }

    if(!password) { acShowSignupMsg('Password likhna zaroori hai!', 'error'); return; }
    if(password.length < 6) { acShowSignupMsg('Password kam az kam 6 characters ka hona chahiye!', 'error'); return; }
    if(password !== confirmPass) { acShowSignupMsg('Password aur Confirm Password match nahi kar rahe!', 'error'); return; }

    var phoneErrVal = acValidatePhone(phone);
    if(phoneErrVal) {
      setPhoneTouched(true);
      acShowSignupMsg(phoneErrVal, 'error');
      return;
    }

    var whatsappErrVal = acValidatePhone(whatsapp);
    if(whatsappErrVal) {
      setWhatsappTouched(true);
      acShowSignupMsg(whatsappErrVal, 'error');
      return;
    }
    
    // Check connection before Firebase auth call
    var isOnline = await checkConnection();
    if(!isOnline) {
      acShowSignupMsg('Internet connection nahi hai! Internet check karein.', 'error');
      return;
    }

    const submitBtn = document.getElementById('signup-submit-btn') as HTMLButtonElement;
    if(submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Account ban raha hai...';
    }
    
    var maxRetries = 3;
    var retryCount = 0;

    async function attemptSignup() {
      try {
        return await firebase.auth().createUserWithEmailAndPassword(email, password);
      } catch(error: any) {
        if(error && error.code === 'auth/network-request-failed' && retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptSignup();
        }
        throw error;
      }
    }

    try {
      var userCred = await attemptSignup();
      var user = userCred.user;
      
      await user.updateProfile({ displayName: fullName });
      
      var colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#e91e63','#00bcd4','#ff5722'];
      var avatarColor = colors[Math.floor(Math.random() * colors.length)];
      localStorage.setItem('ac_avatar_' + user.uid, avatarColor);
      localStorage.setItem('ac_avatar_color', avatarColor);
      
      var userData = {
        uid: user.uid,
        userType: 'customer',
        fullName: fullName,
        email: email,
        phone: phone,
        whatsapp: whatsapp || phone,
        city: city || '',
        area: area || '',
        address: address || '',
        landmark: landmark || '',
        loginMethod: 'email',
        avatarColor: avatarColor,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        isActive: true
      };

      await firebase.firestore().collection('users').doc(user.uid).set(userData);

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
        fullName: fullName,
        email: email,
        phone: phone,
        whatsapp: whatsapp || phone,
        city: city || '',
        userType: 'customer',
        loginMethod: 'email',
        avatarColor: avatarColor
      }));
      
      acShowSignupMsg('Account ban gaya! Khush aamdeed ' + fullName + '!', 'success');
      
      setTimeout(function() {
        window.location.href = '/';
      }, 1500);
      
    } catch(error: any) {
      if(submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = language === 'romanUrdu' ? 'Account Banayein' : 'Create Account';
      }
      
      if(error && error.code === 'auth/network-request-failed') {
        acShowSignupMsg('Internet connection masla! Page refresh karein aur dobara try karein.', 'error');
      } else if(error.code === 'auth/email-already-in-use') {
        acShowSignupMsg('Yeh email pehle se register hai! Login karein ya dusri email use karein.', 'error');
      } else if(error.code === 'auth/invalid-email') {
        acShowSignupMsg('Email ka format galat hai!', 'error');
      } else if(error.code === 'auth/weak-password') {
        acShowSignupMsg('Password zyada strong banana hoga! Kam az kam 6 characters likhein.', 'error');
      } else {
        acShowSignupMsg('Kuch masla hua: ' + error.message, 'error');
      }
    }
  };

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header */}
      <section className="relative h-48 md:h-64 flex items-center justify-center overflow-hidden ac-fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1920)' }}
        >
          <div className="absolute inset-0 bg-agri-green/80 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-2"
          >
            {t.title}
          </motion.h1>
        </div>
      </section>

      {/* Signup Form Section */}
      <section className="flex-1 px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 ac-zoom-in ac-delay-1"
        >
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-10 h-10 text-agri-green fill-agri-green" />
              <span className="text-3xl font-serif font-black text-agri-green">AgriConnect</span>
            </div>
            <p className="text-gray-500 font-medium">{t.welcome}</p>
          </div>

          <form id="customer-signup-form" onSubmit={customerSignup} className="space-y-12">
            {/* Basic Info */}
            <div>
              <h3 className="text-xl font-bold text-agri-green mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-agri-green/10 flex items-center justify-center text-sm">1</span>
                {t.section1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.fullName}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="signup-name" type="text" placeholder={t.fullNamePlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      id="signup-email" 
                      type="email" 
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailTouched(true);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      placeholder={t.emailPlaceholder} 
                      style={getEmailStyle()}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
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
                      id="signup-phone" 
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
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
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
                      id="signup-whatsapp" 
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
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" 
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="signup-password" type={showPassword ? "text" : "password"} placeholder={t.passwordPlaceholder} className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-agri-green transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.confirmPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="signup-confirm" type={showConfirmPassword ? "text" : "password"} placeholder={t.confirmPasswordPlaceholder} className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-agri-green transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div>
              <h3 className="text-xl font-bold text-agri-green mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-agri-green/10 flex items-center justify-center text-sm">2</span>
                {t.section2}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.city}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select id="signup-city" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none appearance-none">
                      <option value="">{t.cityPlaceholder}</option>
                      {punjabCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.area}</label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="signup-area" type="text" placeholder={t.areaPlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.address}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea id="signup-address" rows={3} placeholder={t.addressPlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none resize-none"></textarea>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.landmark}</label>
                  <div className="relative">
                    <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input id="signup-landmark" type="text" placeholder={t.landmarkPlaceholder} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-gray-300 text-agri-green focus:ring-agri-green" />
                <span className="text-sm text-gray-600">{t.terms}</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-agri-green focus:ring-agri-green" />
                <span className="text-sm text-gray-600">{t.offers}</span>
              </label>
            </div>

            <div className="bottom-8 space-y-6">
              <button id="signup-submit-btn" type="submit" className="w-full bg-agri-green text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20">
                {t.submit}
              </button>
              
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <span className="relative px-4 bg-white text-sm text-gray-400 font-medium">{t.orSignupWith}</span>
              </div>

              <div className="flex justify-center">
                <button type="button" className="w-full flex items-center justify-center py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group">
                  <Chrome className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <p className="text-center text-gray-600 font-medium">
                {t.alreadyHaveAccount} <Link to="/login" className="text-agri-green font-bold hover:underline">{t.login}</Link>
              </p>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
};

export default CustomerSignup;
