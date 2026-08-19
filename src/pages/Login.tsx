import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, Leaf, Chrome, Facebook, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

async function checkConnection() {
  return navigator.onLine;
}

const Login = () => {
  const { language } = useLanguage();
  const [isSellerLogin, setIsSellerLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'seller' || params.get('type') === 'seller' || window.location.pathname.includes('seller')) {
      setIsSellerLogin(true);
    }
  }, []);

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

  const emailErr = acValidateEmail(email);
  const showEmailErr = emailTouched && emailErr;
  const isEmailValid = email && !emailErr;

  const getEmailStyle = () => {
    if (showEmailErr) {
      return { border: '2px solid #e74c3c', background: '#fff5f5' };
    }
    if (isEmailValid) {
      return { border: '2px solid #2ecc71' };
    }
    return {};
  };

  const content = {
    romanUrdu: {
      customerTitle: "Apnay Account Mein Login Karein",
      sellerTitle: "Seller Login",
      customerWelcome: "Khush Aamdeed",
      sellerWelcome: "Apne Seller Account Mein Login Karein",
      emailLabel: "Email Ya Phone Number",
      emailPlaceholder: "Apna email ya phone darj karein",
      passwordLabel: "Password",
      passwordPlaceholder: "Apna password darj karein",
      rememberMe: "Mujhe Yaad Rakho",
      forgotPassword: "Password Bhool Gaye?",
      customerLoginBtn: "Login Karein",
      sellerLoginBtn: "Seller Login Karein",
      orLoginWith: "Ya Phir",
      googleLogin: "Google Say Login",
      facebookLogin: "Facebook Say Login",
      twitterLogin: "X Say Login",
      newAccount: "Naya Account Banana Hai?",
      customerSignup: "Customer Signup",
      sellerRegister: "Seller Register",
      areYouSeller: "Seller Hain Aap?",
      sellerLoginLink: "Seller Login",
      noSellerAccount: "Seller Account Nahi Hai?",
      registerAsSeller: "Seller Register Karein",
      backToCustomer: "Customer Login Par Jayein"
    },
    english: {
      customerTitle: "Login To Your Account",
      sellerTitle: "Seller Login",
      customerWelcome: "Welcome Back",
      sellerWelcome: "Login To Your Seller Account",
      emailLabel: "Email or Phone Number",
      emailPlaceholder: "Enter your email or phone",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember Me",
      forgotPassword: "Forgot Password?",
      customerLoginBtn: "Login",
      sellerLoginBtn: "Seller Login",
      orLoginWith: "Or Login With",
      googleLogin: "Login With Google",
      facebookLogin: "Login With Facebook",
      twitterLogin: "Login With X",
      newAccount: "Want To Create New Account?",
      customerSignup: "Customer Signup",
      sellerRegister: "Seller Register",
      areYouSeller: "Are You A Seller?",
      sellerLoginLink: "Seller Login",
      noSellerAccount: "Don't Have Seller Account?",
      registerAsSeller: "Register As Seller",
      backToCustomer: "Go To Customer Login"
    }
  };

  const t = content[language];

  const showLoginError = (msg: string) => {
    setErrorMessage({ 
      text: msg, 
      type: 'error' 
    });
    setIsSubmitting(false);
  };

  const acCustomerLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // FIX 3: Check internet connection before any Firebase auth call
    var isOnline = await checkConnection();
    if(!isOnline) {
      showLoginError(
        'Internet connection nahi hai! ' +
        'Internet check karein.'
      );
      return;
    }
    
    const emailVal = (document.getElementById('login-email') as HTMLInputElement)?.value.trim();
    const passwordVal = (document.getElementById('login-password') as HTMLInputElement)?.value;

    if(!emailVal || !passwordVal) {
      setErrorMessage({ 
        text: language === 'romanUrdu' ? 'Email aur password dono likhna zaroori hai!' : 'Email and password both are required!', 
        type: 'error' 
      });
      return;
    }

    const emailErrVal = acValidateEmail(emailVal);
    if(emailErrVal) {
      setEmailTouched(true);
      setErrorMessage({
        text: emailErrVal,
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const firebase = (window as any).firebase;

    // FIX 1: Add retry logic to login
    var maxRetries = 3;
    var retryCount = 0;
    
    async function attemptLogin() {
      try {
        var email = (document.getElementById(
          'login-email'
        ) as HTMLInputElement)?.value.trim() || emailVal;
        var password = (document.getElementById(
          'login-password'
        ) as HTMLInputElement)?.value || passwordVal;
        
        var result = await firebase.auth()
          .signInWithEmailAndPassword(
            email, password
          );
        return result;
        
      } catch(error: any) {
        if(error && error.code === 
          'auth/network-request-failed' &&
          retryCount < maxRetries) {
          retryCount++;
          // Wait 1 second then retry
          await new Promise(resolve => 
            setTimeout(resolve, 1000)
          );
          return attemptLogin();
        }
        throw error;
      }
    }

    try {
      const userCred = await attemptLogin();
      const user = userCred.user;

      const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();

      if(!userDoc.exists) {
        setErrorMessage({ 
          text: language === 'romanUrdu' ? 'Pehle signup karein! Account nahi mila database mein.' : 'Please signup first! Account not found in database.', 
          type: 'error' 
        });
        await firebase.auth().signOut();
        setIsSubmitting(false);
        return;
      }

      const userData = userDoc.data();

      // Update last login
      await firebase.firestore().collection('users').doc(user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Permanent color system
      const colorKey = 'ac_avatar_' + user.uid;
      let savedColor = localStorage.getItem(colorKey);
      if(!savedColor) {
        const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#e91e63','#00bcd4','#ff5722'];
        savedColor = colors[Math.floor(Math.random() * colors.length)];
        localStorage.setItem(colorKey, savedColor);
      }
      localStorage.setItem('ac_avatar_color', savedColor);

      localStorage.setItem('ac_user', JSON.stringify({
        uid: user.uid,
        fullName: userData.fullName,
        email: userData.email,
        userType: userData.userType,
        phone: userData.phone || '',
        city: userData.city || '',
        loginMethod: 'email'
      }));

      setErrorMessage({ 
        text: language === 'romanUrdu' ? 'Login ho gaya! Khush aamdeed ' + userData.fullName + '!' : 'Logged in successfully! Welcome ' + userData.fullName + '!', 
        type: 'success' 
      });

      window.dispatchEvent(new Event('ac_user_updated'));

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error: any) {
      setIsSubmitting(false);
      if(error && error.code === 'auth/network-request-failed') {
        showLoginError(
          'Internet connection masla! ' +
          'Page refresh karein aur ' +
          'dobara try karein.'
        );
      } else if(error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setErrorMessage({ 
          text: language === 'romanUrdu' ? 'Yeh email register nahi hai! Pehle signup karein.' : 'This email is not registered! Please sign up first.', 
          type: 'error' 
        });
      } else if(error.code === 'auth/wrong-password') {
        setErrorMessage({ 
          text: language === 'romanUrdu' ? 'Password galat hai! Dobara koshish karein.' : 'Wrong password! Try again.', 
          type: 'error' 
        });
      } else if(error.code === 'auth/invalid-email') {
        setErrorMessage({ 
          text: language === 'romanUrdu' ? 'Email ka format galat hai!' : 'Invalid email format!', 
          type: 'error' 
        });
      } else if(error.code === 'auth/too-many-requests') {
        setErrorMessage({ 
          text: language === 'romanUrdu' ? 'Zyada galat koshishain! Thodi der baad try karein.' : 'Too many attempts! Try again later.', 
          type: 'error' 
        });
      } else {
        setErrorMessage({ 
          text: language === 'romanUrdu' ? 'Login mein masla hua. Dobara koshish karein.' : 'Login problem. Please try again.', 
          type: 'error' 
        });
      }
    }
  };

  const acForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    var isOnline = await checkConnection();
    if(!isOnline) {
      setForgotStatus({
        text: 'Internet connection nahi hai! Internet check karein.',
        type: 'error'
      });
      return;
    }

    const emailVal = (document.getElementById('forgot-email') as HTMLInputElement)?.value.trim();
    
    if(!emailVal) {
      setForgotStatus({ text: language === 'romanUrdu' ? 'Email likhna zaroori hai!' : 'Email is required!', type: 'error' });
      return;
    }

    setIsForgotSubmitting(true);
    setForgotStatus(null);
    
    const firebase = (window as any).firebase;

    try {
      await firebase.auth().sendPasswordResetEmail(emailVal);
      setForgotStatus({ text: language === 'romanUrdu' ? 'Email Bhej Di Gayi!' : 'Email Sent!', type: 'success' });
      
      // Update form UI like requested
      const formEl = document.getElementById('forgot-form-inner');
      if (formEl) {
        formEl.innerHTML = `
          <div style="text-align:center; padding:20px;">
            <div style="font-size:48px;">📧</div>
            <h3 style="color:#2d6a2d; margin:16px 0 8px;">
              ${language === 'romanUrdu' ? 'Email Bhej Di Gayi!' : 'Email Sent!'}
            </h3>
            <p style="color:#666; font-size:14px;">
              ${emailVal} ${language === 'romanUrdu' ? 'par password reset ka link bheja gaya hai. Email check karein!' : 'has been sent a password reset link. Check your email!'}
            </p>
            <p style="color:#999; font-size:12px; margin-top:8px;">
              ${language === 'romanUrdu' ? 'Spam folder bhi check karein.' : 'Also check your spam folder.'}
            </p>
          </div>
        `;
      }
      setIsForgotSubmitting(false);
    } catch(error: any) {
      setIsForgotSubmitting(false);
      if(error && error.code === 'auth/network-request-failed') {
        setForgotStatus({ text: 'Internet connection masla! Page refresh karein aur dobara try karein.', type: 'error' });
      } else if(error.code === 'auth/user-not-found') {
        setForgotStatus({ text: language === 'romanUrdu' ? 'Yeh email register nahi hai!' : 'This email is not registered!', type: 'error' });
      } else if(error.code === 'auth/invalid-email') {
        setForgotStatus({ text: language === 'romanUrdu' ? 'Email format galat hai!' : 'Invalid email format!', type: 'error' });
      } else {
        setForgotStatus({ text: language === 'romanUrdu' ? 'Kuch masla hua. Dobara koshish karein.' : 'Something went wrong. Try again.', type: 'error' });
      }
    }
  };

  const googleLogin = async (userType?: string) => {
    var isOnline = await checkConnection();
    if(!isOnline) {
      showLoginError('Internet connection nahi hai! Internet check karein.');
      return;
    }

    try {
      const firebase = (window as any).firebase;
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCred = await firebase.auth().signInWithPopup(provider);
      
      const user = userCred.user;
      
      const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      
      let userData: any;
      if(!userDoc.exists) {
        userData = {
          uid: user.uid,
          userType: userType || "customer",
          fullName: user.displayName || "User",
          email: user.email || "",
          phone: user.phoneNumber || "",
          whatsapp: "",
          city: "",
          area: "",
          address: "",
          profilePhoto: user.photoURL || "",
          loginMethod: "google",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          isActive: true
        };
        await firebase.firestore().collection('users').doc(user.uid).set(userData);
        localStorage.setItem("ac_user", JSON.stringify(userData));
        localStorage.removeItem('ac_avatar_color');
      } else {
        await firebase.firestore().collection('users').doc(user.uid).update({
          lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        userData = {
          ...userDoc.data(),
          fullName: userDoc.data()?.fullName || user.displayName || "User",
          email: userDoc.data()?.email || user.email || "",
          userType: userDoc.data()?.userType || userType || "customer"
        };
        localStorage.setItem("ac_user", JSON.stringify(userDoc.data()));
        localStorage.removeItem('ac_avatar_color');
      }
      
      if (userData && userData.fullName && userData.email && userData.userType) {
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
      }
      
      window.dispatchEvent(new Event('ac_user_updated'));
      window.location.href = '/';
      
    } catch(error: any) {
      alert(language === 'romanUrdu' ? "Google login mein masla. Dobara koshish karein." : "Google login problem. Try again.");
    }
  };

  const acShowLoginError = (msg: string) => {
    setErrorMessage({ text: msg, type: 'error' });
  };

  const navigateToPage = (path: string) => {
    if (path === 'home') {
      navigate('/');
    } else {
      navigate('/' + path);
    }
  };

  const acShowLoginPopup = (name: string, method: 'google' | 'facebook' | 'twitter') => {
    const lang = localStorage.getItem('agriconnect-lang') || 'ru';
    const l = lang === 'en';
    
    const icons = {
      google: '🔵',
      facebook: '📘',
      twitter: '🐦'
    };
    
    const methods = {
      google: 'Google',
      facebook: 'Facebook', 
      twitter: 'X (Twitter)'
    };
    
    const popup = document.createElement('div');
    popup.style.cssText = 
      'position:fixed;top:0;left:0;'+
      'width:100%;height:100%;'+
      'background:rgba(0,0,0,0.6);'+
      'z-index:99999;'+
      'display:flex;align-items:center;'+
      'justify-content:center;';
    
    popup.innerHTML = 
      '<div style="background:white;'+
      'border-radius:20px;'+
      'padding:40px 30px;'+
      'max-width:360px;width:90%;'+
      'text-align:center;'+
      'box-shadow:0 20px 60px rgba(0,0,0,0.3);">'+
      
      '<div style="font-size:56px;'+
      'margin-bottom:16px;">✅</div>'+
      
      '<h2 style="color:#2d6a2d;'+
      'font-size:22px;margin-bottom:8px;">'+
      (l ? 'Login Successful!' : 
      'Login Ho Gaya!') +
      '</h2>'+
      
      '<p style="color:#555;'+
      'font-size:15px;margin-bottom:4px;">'+
      (l ? 'Welcome' : 'Khush Aamdeed')+
      ' <strong>' + name + '</strong>!</p>'+
      
      '<p style="color:#888;'+
      'font-size:13px;margin-bottom:24px;">'+
      icons[method] + ' ' + methods[method] +
      (l ? ' login successful' : 
      ' say login ho gaya') +
      '</p>'+
      
      '<div style="width:40px;height:4px;'+
      'background:#2d6a2d;border-radius:2px;'+
      'margin:0 auto 8px;'+
      'animation:loadBar 1.5s linear forwards;">'+
      '</div>'+
      
      '<p style="color:#aaa;font-size:12px;">'+
      (l ? 'Redirecting to home...' : 
      'Home page par ja rahe hain...') +
      '</p>'+
      
      '</div>';
    
    const style = document.createElement('style');
    style.textContent = 
      '@keyframes loadBar{'+
      'from{width:0px}'+
      'to{width:40px}'+
      '}';
    document.head.appendChild(style);
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
      window.location.href = '/';
    }, 1500);
  };

  const acGoogleLogin = async () => {
    const firebase = (window as any).firebase;
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      
      // Check if user exists in database
      const userDoc = await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      
      let userData: any;
      if(!userDoc.exists) {
        // New user - save to database
        userData = {
          uid: user.uid,
          userType: 'customer',
          fullName: user.displayName || '',
          email: user.email || '',
          phone: '',
          whatsapp: '',
          city: '',
          area: '',
          address: '',
          profilePhoto: user.photoURL || '',
          loginMethod: 'google',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          isActive: true
        };
        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .set(userData);
      } else {
        // Existing user - update last login
        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
          });
        userData = {
          ...userDoc.data(),
          fullName: userDoc.data()?.fullName || user.displayName || '',
          email: userDoc.data()?.email || user.email || '',
          userType: userDoc.data()?.userType || 'customer'
        };
      }

      if (userData && userData.fullName && userData.email && userData.userType) {
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
      }
      
      // Generate or get avatar color
      const colorKey = 'ac_avatar_' + user.uid;
      if(!localStorage.getItem(colorKey)) {
        const colors = [
          '#e74c3c','#3498db','#2ecc71',
          '#f39c12','#9b59b6','#1abc9c',
          '#e67e22','#e91e63','#00bcd4',
          '#ff5722'
        ];
        const color = colors[
          Math.floor(Math.random() * colors.length)
        ];
        localStorage.setItem(colorKey, color);
      }
      localStorage.setItem(
        'ac_avatar_color',
        localStorage.getItem(colorKey) || ''
      );
      
      // Save user to localStorage
      if (!userData) {
        userData = userDoc.exists ? 
          userDoc.data() : {
            uid: user.uid,
            fullName: user.displayName || '',
            email: user.email || '',
            userType: 'customer',
            loginMethod: 'google'
          };
      }
      
      localStorage.setItem(
        'ac_user',
        JSON.stringify(userData)
      );
      
      window.dispatchEvent(new Event('ac_user_updated'));
      
      // Show success popup
      acShowLoginPopup(
        user.displayName || 
        user.email.split('@')[0],
        'google'
      );
      
    } catch(error: any) {
      if(error.code === 'auth/popup-closed-by-user') {
        // User closed popup - do nothing
        return;
      } else if(error.code === 'auth/popup-blocked') {
        acShowLoginError(
          'Popup block hai! Browser mein popup allow karein.'
        );
      } else {
        acShowLoginError(
          'Google login mein masla: ' + error.message
        );
      }
    }
  };

  const acFacebookLogin = async () => {
    const firebase = (window as any).firebase;
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      
      // Check database
      const userDoc = await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      
      if(!userDoc.exists) {
        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            uid: user.uid,
            userType: 'customer',
            fullName: user.displayName || '',
            email: user.email || '',
            phone: '',
            profilePhoto: user.photoURL || '',
            loginMethod: 'facebook',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true
          });
      } else {
        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
          });
      }
      
      // Avatar color
      const colorKey = 'ac_avatar_' + user.uid;
      if(!localStorage.getItem(colorKey)) {
        const colors = [
          '#e74c3c','#3498db','#2ecc71',
          '#f39c12','#9b59b6','#1abc9c',
          '#e67e22','#e91e63','#00bcd4',
          '#ff5722'
        ];
        localStorage.setItem(
          colorKey,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
      localStorage.setItem(
        'ac_avatar_color',
        localStorage.getItem(colorKey) || ''
      );
      
      localStorage.setItem(
        'ac_user',
        JSON.stringify({
          uid: user.uid,
          fullName: user.displayName || '',
          email: user.email || '',
          userType: 'customer',
          loginMethod: 'facebook'
        })
      );
      
      window.dispatchEvent(new Event('ac_user_updated'));
      
      acShowLoginPopup(
        user.displayName || 'User',
        'facebook'
      );
      
    } catch(error: any) {
      if(error.code === 'auth/popup-closed-by-user') {
        return;
      } else if(error.code === 'auth/account-exists-with-different-credential'){
        acShowLoginError(
          'Yeh email dusre tarike say pehle se register hai!'
        );
      } else {
        acShowLoginError(
          'Facebook login mein masla hua.'
        );
      }
    }
  };

  const acTwitterLogin = async () => {
    const firebase = (window as any).firebase;
    try {
      const provider = new firebase.auth.TwitterAuthProvider();
      
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      
      const userDoc = await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      
      if(!userDoc.exists) {
        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            uid: user.uid,
            userType: 'customer',
            fullName: user.displayName || '',
            email: user.email || '',
            phone: '',
            profilePhoto: user.photoURL || '',
            loginMethod: 'twitter',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true
          });
      } else {
        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
          });
      }
      
      const colorKey = 'ac_avatar_' + user.uid;
      if(!localStorage.getItem(colorKey)) {
        const colors = [
          '#e74c3c','#3498db','#2ecc71',
          '#f39c12','#9b59b6','#1abc9c',
          '#e67e22','#e91e63','#00bcd4',
          '#ff5722'
        ];
        localStorage.setItem(
          colorKey,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
      localStorage.setItem(
        'ac_avatar_color',
        localStorage.getItem(colorKey) || ''
      );
      
      localStorage.setItem(
        'ac_user',
        JSON.stringify({
          uid: user.uid,
          fullName: user.displayName || '',
          email: user.email || '',
          userType: 'customer',
          loginMethod: 'twitter'
        })
      );
      
      window.dispatchEvent(new Event('ac_user_updated'));
      
      acShowLoginPopup(
        user.displayName || 'User',
        'twitter'
      );
      
    } catch(error: any) {
      if(error.code === 'auth/popup-closed-by-user') {
        return;
      } else {
        acShowLoginError(
          'X login mein masla hua.'
        );
      }
    }
  };

  const themeColor = isSellerLogin ? 'agri-orange' : 'agri-green';
  const themeBg = isSellerLogin ? 'bg-agri-orange' : 'bg-agri-green';
  const themeText = isSellerLogin ? 'text-agri-orange' : 'text-agri-green';
  const themeRing = isSellerLogin ? 'focus:ring-agri-orange' : 'focus:ring-agri-green';
  const themeHover = isSellerLogin ? 'hover:bg-orange-600' : 'hover:bg-green-800';
  const themeShadow = isSellerLogin ? 'shadow-agri-orange/20' : 'shadow-agri-green/20';

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header */}
      <section className="relative h-48 md:h-64 flex items-center justify-center overflow-hidden ac-fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920)' }}
        >
          <div className={cn("absolute inset-0 backdrop-blur-[2px]", isSellerLogin ? "bg-agri-orange/80" : "bg-agri-green/80")} />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            key={isSellerLogin ? 'seller' : 'customer'}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-2"
          >
            {isSellerLogin ? t.sellerTitle : t.customerTitle}
          </motion.h1>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div 
          key={isSellerLogin ? 'seller-card' : 'customer-card'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 ac-zoom-in ac-delay-1"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className={cn("w-10 h-10 fill-current", themeText)} />
              <span className={cn("text-3xl font-serif font-black", themeText)}>AgriConnect</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{isSellerLogin ? t.sellerTitle : t.customerWelcome}</h2>
            <p className="text-gray-500 font-medium text-center">{isSellerLogin ? t.sellerWelcome : (language === 'romanUrdu' ? 'Khush Amdeed! Dobara mil kar khushi hui.' : 'Welcome back! Happy to see you again.')}</p>
          </div>

          <form onSubmit={acCustomerLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  id="login-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailTouched(true);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  placeholder={t.emailPlaceholder}
                  style={getEmailStyle()}
                  className={cn("w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:bg-white transition-all outline-none", themeRing)}
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
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{t.passwordLabel}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className={cn("w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:bg-white transition-all outline-none", themeRing)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors", `hover:${themeText}`)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {errorMessage && (
                <div className={cn(
                  "mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border animate-in fade-in slide-in-from-top-2",
                  errorMessage.type === 'error' ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-600"
                )}>
                  {errorMessage.type === 'error' ? '❌' : '✅'} {errorMessage.text}
                  {errorMessage.text.includes('signup') && (
                    <Link to="/signup" className="underline ml-auto font-bold">
                      {language === 'romanUrdu' ? 'Abhi Signup Karein →' : 'Sign Up Now →'}
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className={cn("w-4 h-4 rounded border-gray-300", themeText, themeRing)} />
                <span className={cn("text-sm text-gray-600 transition-colors", `group-hover:${themeText}`)}>{t.rememberMe}</span>
              </label>
              <button 
                type="button"
                onClick={() => setShowForgotModal(true)}
                className={cn("text-sm font-bold hover:underline bg-transparent border-none p-0 cursor-pointer", themeText)}
              >
                {t.forgotPassword}
              </button>
            </div>

            <button 
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed", 
                themeBg, themeHover, themeShadow
              )}
            >
              {isSubmitting 
                ? (language === 'romanUrdu' ? 'Login ho raha hai...' : 'Logging in...') 
                : (isSellerLogin ? t.sellerLoginBtn : t.customerLoginBtn)}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-sm text-gray-400 font-medium">{t.orLoginWith}</span>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={isSellerLogin ? () => googleLogin('seller') : acGoogleLogin}
                className="w-full flex items-center justify-center py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {!isSellerLogin ? (
            <>
              {/* Seller Login Button for Customer Login Page */}
              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-500 font-medium mb-4">{t.areYouSeller}</p>
                <button 
                  onClick={() => setIsSellerLogin(true)}
                  className="w-full bg-agri-orange text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-agri-orange/20"
                >
                  {t.sellerLoginLink}
                </button>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-500 font-medium mb-6">{t.newAccount}</p>
                <div className="grid grid-cols-1 gap-3">
                  <Link 
                    to="/signup"
                    className="w-full bg-agri-green/10 text-agri-green py-3.5 rounded-xl font-bold hover:bg-agri-green hover:text-white transition-all"
                  >
                    {t.customerSignup}
                  </Link>
                  <Link 
                    to="/seller-register"
                    className="w-full bg-agri-orange/10 text-agri-orange py-3.5 rounded-xl font-bold hover:bg-agri-orange hover:text-white transition-all"
                  >
                    {t.sellerRegister}
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-gray-500 font-medium mb-4">{t.noSellerAccount}</p>
              <Link 
                to="/seller-register"
                className="block w-full bg-agri-orange/10 text-agri-orange py-3.5 rounded-xl font-bold hover:bg-agri-orange hover:text-white transition-all mb-6"
              >
                {t.registerAsSeller}
              </Link>
              <button 
                onClick={() => setIsSellerLogin(false)}
                className="text-agri-green font-bold hover:underline"
              >
                {t.backToCustomer}
              </button>
            </div>
          )}
        </motion.div>
      </section>
      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowForgotModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>

              <div id="forgot-form">
                <div id="forgot-form-inner">
                  <h3 className="text-2xl font-bold text-agri-green mb-2">
                    {language === 'romanUrdu' ? "Password Reset Karein" : "Reset Password"}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {language === 'romanUrdu' 
                      ? "Apni email likhein. Hum aapko password reset ka link bhejein gay." 
                      : "Enter your email. We will send you a password reset link."}
                  </p>

                  <form onSubmit={acForgotPassword} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        id="forgot-email"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder={language === 'romanUrdu' ? "Email darj karein" : "Enter your email"}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-agri-green outline-none"
                      />
                    </div>

                    {forgotStatus && (
                      <div className={cn(
                        "p-3 rounded-xl text-xs font-bold flex items-center gap-2",
                        forgotStatus.type === 'error' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                      )}>
                        {forgotStatus.type === 'error' ? '❌' : '✅'} {forgotStatus.text}
                      </div>
                    )}

                    <button 
                      id="forgot-submit-btn"
                      disabled={isForgotSubmitting}
                      type="submit"
                      className="w-full bg-agri-green text-white py-4 rounded-xl font-bold hover:bg-green-800 transition-all disabled:opacity-50"
                    >
                      {isForgotSubmitting 
                        ? (language === 'romanUrdu' ? "Bhej raha hai..." : "Sending...") 
                        : (language === 'romanUrdu' ? "Reset Link Bhejein" : "Send Reset Link")}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-full text-gray-500 font-bold py-2 hover:text-gray-700 transition-all text-sm"
                    >
                      {language === 'romanUrdu' ? "Wapis" : "Cancel"}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
