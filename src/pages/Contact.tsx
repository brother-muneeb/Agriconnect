import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Send, CheckCircle, ArrowRight, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { language } = useLanguage();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: language === 'romanUrdu' ? 'Order Kay Baray Mein' : 'About Order',
    message: ''
  });

  const content = {
    romanUrdu: {
      title: "Humse Rabta Karein",
      subtitle: "Hum Hamesha Aapki Khidmat Mein Haazir Hain",
      whatsapp: "WhatsApp",
      whatsappBtn: "Abhi Message Karein",
      phone: "Phone Number",
      phoneBtn: "Abhi Call Karein",
      address: "Hamara Pata",
      addressBtn: "Map Mein Dekhein",
      formTitle: "Paighaam Bhejein",
      formName: "Aapka Naam *",
      formNamePlaceholder: "Naam darj karein",
      formEmail: "Email Address *",
      formEmailPlaceholder: "Email darj karein",
      formPhone: "Phone Number",
      formPhonePlaceholder: "Phone number darj karein",
      formSubject: "Mauzu (Subject)",
      formMessage: "Aapka Paighaam",
      formMessagePlaceholder: "Apna paighaam yahan likhein...",
      formSubmit: "Paighaam Bhejein",
      formSubmitting: "Bheja Ja Raha Hai...",
      formSuccessTitle: "Shukriya!",
      formSuccessMsg: "Aapka paighaam mil gaya. Hum jald hi rabta karein gay.",
      formNewBtn: "Naya Paighaam Bhejein",
      hoursTitle: "Kaam Kay Awqaat",
      socialTitle: "Hamare Social Media",
      waOrderTitle: "WhatsApp Par Seedha Order Karein",
      waOrderDesc: "Jaldi order karne ke liye hamare WhatsApp par message karein",
      waOrderBtn: "WhatsApp Order",
      mapTitle: "Hamara Pata",
      subjects: [
        "Order Kay Baray Mein",
        "Delivery Kay Baray Mein",
        "Product Kay Baray Mein",
        "Shikayat",
        "Taajweez (Suggestion)",
        "Kuch Aur"
      ],
      days: ["Somvar", "Mangal", "Budh", "Jumeraat", "Jumma", "Hafta", "Itwar"]
    },
    english: {
      title: "Contact Us",
      subtitle: "We Are Always At Your Service",
      whatsapp: "WhatsApp",
      whatsappBtn: "Message Us Now",
      phone: "Phone Number",
      phoneBtn: "Call Us Now",
      address: "Our Address",
      addressBtn: "View On Map",
      formTitle: "Send Message",
      formName: "Your Name *",
      formNamePlaceholder: "Enter your name",
      formEmail: "Email Address *",
      formEmailPlaceholder: "Enter your email",
      formPhone: "Phone Number",
      formPhonePlaceholder: "Enter your phone number",
      formSubject: "Subject",
      formMessage: "Your Message",
      formMessagePlaceholder: "Write your message here...",
      formSubmit: "Send Message",
      formSubmitting: "Sending...",
      formSuccessTitle: "Thank You!",
      formSuccessMsg: "Your message has been received. We will contact you soon.",
      formNewBtn: "Send New Message",
      hoursTitle: "Business Hours",
      socialTitle: "Our Social Media",
      waOrderTitle: "Order Directly On WhatsApp",
      waOrderDesc: "Message us on WhatsApp for quick ordering",
      waOrderBtn: "WhatsApp Order",
      mapTitle: "Our Location",
      subjects: [
        "About Order",
        "About Delivery",
        "About Product",
        "Complaint",
        "Suggestion",
        "Other"
      ],
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    }
  };

  const t = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: language === 'romanUrdu' ? 'Order Kay Baray Mein' : 'About Order', 
        message: '' 
      });
    }, 1500);
  };

  const contactCards = [
    {
      icon: <MessageSquare className="w-8 h-8 text-[#25D366]" />,
      title: t.whatsapp,
      value: "+92 301 9515764",
      buttonText: t.whatsappBtn,
      link: "https://wa.me/923019515764",
      color: "bg-[#25D366]/10"
    },
    {
      icon: <Phone className="w-8 h-8 text-agri-green" />,
      title: t.phone,
      value: "+92 301 9515764",
      buttonText: t.phoneBtn,
      link: "tel:+923019515764",
      color: "bg-agri-green/10"
    },
    {
      icon: <MapPin className="w-8 h-8 text-agri-orange" />,
      title: t.address,
      value: "Main Market, Tarikha, Gujrat, Punjab",
      buttonText: t.addressBtn,
      link: "https://maps.app.goo.gl/aFpiFweQEq9xpjbC6",
      color: "bg-agri-orange/10"
    }
  ];

  const businessHours = [
    { day: t.days[0], hours: "8:00 AM - 8:00 PM" },
    { day: t.days[1], hours: "8:00 AM - 8:00 PM" },
    { day: t.days[2], hours: "8:00 AM - 8:00 PM" },
    { day: t.days[3], hours: "8:00 AM - 8:00 PM" },
    { day: t.days[4], hours: "2:00 PM - 8:00 PM" },
    { day: t.days[5], hours: "8:00 AM - 8:00 PM" },
    { day: t.days[6], hours: "9:00 AM - 6:00 PM" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook />, link: "https://facebook.com/agriconnect", color: "bg-[#1877F2]" },
    { name: "Instagram", icon: <Instagram />, link: "https://instagram.com/agriconnect", color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
    { name: "X", icon: <span className="font-bold">X</span>, link: "https://x.com/agriconnect", color: "bg-black" },
    { name: "YouTube", icon: <Youtube />, link: "https://youtube.com/agriconnect", color: "bg-[#FF0000]" }
  ];

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden ac-fade-in">
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

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 mb-20 ac-slide-up ac-delay-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform"
            >
              <div className={cn("p-4 rounded-2xl mb-6", card.color)}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 font-medium mb-6">{card.value}</p>
              <a 
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-bold hover:bg-agri-green hover:text-white transition-all flex items-center justify-center gap-2"
              >
                {card.buttonText}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">{t.formTitle}</h2>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 ac-slide-left ac-delay-1">
              {formStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="bg-agri-green/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-agri-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.formSuccessTitle}</h3>
                  <p className="text-gray-600 mb-8">
                    {t.formSuccessMsg}
                  </p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="bg-agri-green text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-all"
                  >
                    {t.formNewBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t.formName}</label>
                      <input 
                        required
                        type="text"
                        placeholder={t.formNamePlaceholder}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-agri-green rounded-2xl outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t.formEmail}</label>
                      <input 
                        required
                        type="email"
                        placeholder={t.formEmailPlaceholder}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-agri-green rounded-2xl outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t.formPhone}</label>
                      <input 
                        type="tel"
                        placeholder={t.formPhonePlaceholder}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-agri-green rounded-2xl outline-none transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">{t.formSubject}</label>
                      <select 
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-agri-green rounded-2xl outline-none transition-all appearance-none"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      >
                        {t.subjects.map((sub, i) => (
                          <option key={i}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">{t.formMessage}</label>
                    <textarea 
                      rows={5}
                      placeholder={t.formMessagePlaceholder}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-agri-green rounded-2xl outline-none transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={formStatus === 'submitting'}
                    type="submit"
                    className="w-full bg-agri-green text-white py-5 rounded-2xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg shadow-agri-green/20 flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {formStatus === 'submitting' ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.formSubmit}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">{t.hoursTitle}</h2>
            
            {/* Business Hours */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 ac-slide-right ac-delay-1">
              <div className="bg-agri-green p-6 text-white flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <h3 className="text-xl font-bold">{t.hoursTitle}</h3>
              </div>
              <div className="p-8 space-y-4">
                {businessHours.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <span className="font-bold text-gray-700">{item.day}</span>
                    <span className="text-gray-500 font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 ac-slide-right ac-delay-2">
              <div className="bg-agri-green p-6 text-white flex items-center gap-3">
                <Share2 className="w-6 h-6" />
                <h3 className="text-xl font-bold">{t.socialTitle}</h3>
              </div>
              <div className="p-8 grid grid-cols-2 gap-4">
                {socialLinks.map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold transition-transform hover:scale-105",
                      social.color
                    )}
                  >
                    {social.icon}
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp Quick Order */}
            <div className="bg-agri-green rounded-[2.5rem] p-8 text-white shadow-xl shadow-agri-green/20 relative overflow-hidden group ac-slide-right ac-delay-3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">{t.waOrderTitle}</h3>
                <p className="text-white/80 mb-8 font-medium">
                  {t.waOrderDesc}
                </p>
                <a 
                  href="https://wa.me/923019515764"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-agri-green px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-lg"
                >
                  <MessageSquare className="w-6 h-6" />
                  {t.waOrderBtn}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] w-full relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108031.5422453857!2d74.00418575!3d32.5833441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f1a665977927b%3A0x6335f606886e8140!2sGujrat%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1713175000000!5m2!1sen!2s" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="AgriConnect Location"
        />
        <div className="absolute top-8 left-8 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 max-w-xs hidden md:block">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-agri-green p-2 rounded-xl text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900">{t.mapTitle}</h4>
          </div>
          <p className="text-gray-600 text-sm font-medium leading-relaxed mb-4">
            Main Market, Tarikha, Gujrat, Punjab, Pakistan
          </p>
          <a 
            href="https://maps.app.goo.gl/aFpiFweQEq9xpjbC6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-agri-green text-white py-2 rounded-xl font-bold text-sm hover:bg-green-800 transition-all"
          >
            {t.addressBtn}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
