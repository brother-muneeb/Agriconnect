import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useAnimation } from 'motion/react';
import { Target, Eye, Leaf, Handshake, Tag, Truck, Users, Smile, Package, MapPin, Linkedin, Instagram, CheckCircle, MessageSquare, ShieldCheck, Zap, Wallet, Headset } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

const StatCounter = ({ value, label, icon: Icon }: { value: string, label: string, icon: any }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/\D/g, ''));

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="text-center p-6 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/10 ac-zoom-in">
      <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-4xl font-black text-white mb-2">
        {count}{value.includes('+') ? '+' : ''}
      </h3>
      <p className="text-white/70 font-bold uppercase tracking-widest text-xs">{label}</p>
    </div>
  );
};

const About = () => {
  const { language } = useLanguage();

  const content = {
    romanUrdu: {
      headerTitle: "AgriConnect Kay Baray Mein",
      headerSubtitle: "Farm Say Aapke Ghar Tak Ki Poori Kahani",
      storyTitle: "Hamari Kahani",
      storyPara1: "AgriConnect Ki Shuruat Ek Chhoti Si Soch Say Hui — Kay Punjab Kay Kisaanon Ki Mehnat Ka Sahi Mawqa Milna Chahiye Aur Logon Ko Taazi Cheezain Ghar Baithay Milni Chahiye.",
      storyPara2: "Hum Nay Dekha Kay Kisan Apni Fasal Ka Sahi Daam Nahi Pa Raha Aur Grahak Ko Bazar Mein Taazi Cheezain Nahi Milti — Toh Hum Nay Yeh Faasla Khatam Karne Ka Faisla Kiya.",
      storyPara3: "Aaj AgriConnect Punjab Kay Saikron Kisaanon Ko Seedha Laakhon Grahakoon Say Jor Raha Hai — Bina Darmiyan Walay Kay, Bina Mehengay Daam Kay.",
      storyPara4: "Seedha Khet Say — Seedha Aapke Ghar Tak.",
      missionTitle: "Hamara Mission",
      missionText: "Punjab Kay Kisaanon Ko Seedha Grahakoon Say Jorna Aur Taazi, Asli Aur Sasti Cheezain Har Ghar Tak Pahunchana",
      visionTitle: "Hamari Vision",
      visionText: "Pakistan Ka Sabse Bharosa Mand Agriculture Platform Banana Jahan Har Kisaan Khush Ho Aur Har Ghar Ko Taazgi Mile",
      valuesTitle: "Hamari Aqdar",
      value1Title: "Taazgi",
      value1Text: "Har Product Seedha Khet Say Aata Hai",
      value2Title: "Bharosa",
      value2Text: "Kisaan Aur Grahak Dono Ka Bharosa Hamari Pehli Zaroorat Hai",
      value3Title: "Munasib Daam",
      value3Text: "Sasti Qeemat Par Achi Cheez Dena Hamara Wada Hai",
      value4Title: "Waqt Par Delivery",
      value4Text: "Aapka Order Waqt Par Pahunchana Hamari Zimmedari Hai",
      stat1: "Khush Kisaan",
      stat2: "Khush Grahak",
      stat3: "Products Available",
      stat4: "Punjab Kay Shehr",
      teamTitle: "AgriConnect Ki Team",
      teamSubtitle: "Woh Log Jo Din Raat Aapki Khidmat Mein Lagy Hain",
      member1Bio: "AgriConnect Ka Sapna Dekhne Wala Aur Punjab Kay Kisaanon Ka Dost",
      member2Bio: "Delivery Aur Operations Ko Behtareen Banana Inki Zimmedari Hai",
      member3Bio: "AgriConnect Ko Har Ghar Tak Pahunchana Inka Mission Hai",
      member4Bio: "Punjab Kay Kisaanon Say Seedha Milna Aur Unki Madad Karna",
      whyTitle: "AgriConnect Ko Hi Kyun Chunein",
      reason1Title: "Seedha Khet Say",
      reason1Text: "Koi Darmiyan Walay Nahi",
      reason2Title: "Quality Guaranteed",
      reason2Text: "Har Product Check Hota Hai",
      reason3Title: "Ghar Par Delivery",
      reason3Text: "Punjab Bhar Mein",
      reason4Title: "WhatsApp Par Order",
      reason4Text: "Bohat Aasaan Tarika",
      reason5Title: "Sasti Qeemat",
      reason5Text: "Mandi Say Bhi Sasta",
      reason6Title: "24/7 Support",
      reason6Text: "Hum Hamesha Haazir Hain",
      joinTitle: "AgriConnect Kay Saath Judein",
      joinSubtitle: "Chahe Aap Kisaan Hon Ya Grahak — Hum Dono Ka Khayaal Rakhte Hain",
      joinBtnFarmer: "Kisaan Register Karein",
      joinBtnShop: "Shopping Shuru Karein"
    },
    english: {
      headerTitle: "About AgriConnect",
      headerSubtitle: "The Complete Story From Farm To Your Home",
      storyTitle: "Our Story",
      storyPara1: "AgriConnect started with a small idea that Punjab farmers should get the right opportunity for their hard work and people should get fresh products at home.",
      storyPara2: "We saw that farmers were not getting the right price for their crops and customers were not getting fresh products in markets so we decided to end this gap.",
      storyPara3: "Today AgriConnect is connecting hundreds of Punjab farmers directly with millions of customers without any middlemen and without expensive prices.",
      storyPara4: "Directly From Farm To Your Home.",
      missionTitle: "Our Mission",
      missionText: "Connect Punjab Farmers Directly With Customers And Deliver Fresh Genuine And Affordable Products To Every Home",
      visionTitle: "Our Vision",
      visionText: "Become Pakistan's Most Trusted Agriculture Platform Where Every Farmer Is Happy And Every Home Gets Freshness",
      valuesTitle: "Our Values",
      value1Title: "Freshness",
      value1Text: "Every Product Comes Directly From The Farm",
      value2Title: "Trust",
      value2Text: "Trust Of Both Farmer And Customer Is Our First Priority",
      value3Title: "Affordable Price",
      value3Text: "Giving Good Products At Cheap Price Is Our Promise",
      value4Title: "On Time Delivery",
      value4Text: "Delivering Your Order On Time Is Our Responsibility",
      stat1: "Happy Farmers",
      stat2: "Happy Customers",
      stat3: "Products Available",
      stat4: "Punjab Cities",
      teamTitle: "AgriConnect Team",
      teamSubtitle: "The People Who Are Working Day And Night For Your Service",
      member1Bio: "The Dreamer Of AgriConnect And A Friend Of Punjab Farmers",
      member2Bio: "His Responsibility Is To Make Delivery And Operations The Best",
      member3Bio: "Her Mission Is To Reach AgriConnect To Every Home",
      member4Bio: "Meeting Punjab Farmers Directly And Helping Them",
      whyTitle: "Why Choose AgriConnect",
      reason1Title: "Directly From Farm",
      reason1Text: "No Middlemen",
      reason2Title: "Quality Guaranteed",
      reason2Text: "Every Product Is Checked",
      reason3Title: "Home Delivery",
      reason3Text: "Across Punjab",
      reason4Title: "WhatsApp Order",
      reason4Text: "Very Easy Method",
      reason5Title: "Affordable Price",
      reason5Text: "Even Cheaper Than Market",
      reason6Title: "24/7 Support",
      reason6Text: "We Are Always Available",
      joinTitle: "Join AgriConnect",
      joinSubtitle: "Whether You Are A Farmer Or Customer We Take Care Of Both",
      joinBtnFarmer: "Register As Farmer",
      joinBtnShop: "Start Shopping"
    }
  };

  const t = content[language];

  const values = [
    { icon: Leaf, title: t.value1Title, text: t.value1Text },
    { icon: Handshake, title: t.value2Title, text: t.value2Text },
    { icon: Tag, title: t.value3Title, text: t.value3Text },
    { icon: Truck, title: t.value4Title, text: t.value4Text }
  ];

  const team = [
    {
      name: "Muhammad Muneeb Ahmed",
      role: "Founder & CEO",
      bio: t.member1Bio,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Ahmad Ali",
      role: "Head of Operations",
      bio: t.member2Bio,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Sara Khan",
      role: "Marketing Manager",
      bio: t.member3Bio,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Bilal Hassan",
      role: "Kisan Relations Manager",
      bio: t.member4Bio,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
    }
  ];

  const reasons = [
    { icon: Leaf, title: t.reason1Title, text: t.reason1Text },
    { icon: ShieldCheck, title: t.reason2Title, text: t.reason2Text },
    { icon: Truck, title: t.reason3Title, text: t.reason3Text },
    { icon: MessageSquare, title: t.reason4Title, text: t.reason4Text },
    { icon: Wallet, title: t.reason5Title, text: t.reason5Text },
    { icon: Headset, title: t.reason6Title, text: t.reason6Text }
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
            {t.headerTitle}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 font-medium"
          >
            {t.headerSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative ac-slide-left ac-delay-1"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-agri-green/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-agri-orange/10 rounded-full blur-2xl" />
            <img 
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800" 
              alt="Farmer and Team" 
              className="relative z-10 rounded-[3rem] shadow-2xl border-8 border-white"
            />
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8 ac-slide-right ac-delay-2"
          >
            <h2 className="text-4xl font-serif font-bold text-gray-900">{t.storyTitle}</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
              <p>
                {t.storyPara1}
              </p>
              <p>
                {t.storyPara2}
              </p>
              <p>
                {t.storyPara3}
              </p>
              <p className="text-agri-green font-bold text-2xl">
                {t.storyPara4}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Vision Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-agri-green p-12 rounded-[3rem] text-white shadow-xl shadow-agri-green/20 relative overflow-hidden group ac-zoom-in ac-delay-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <Target className="w-16 h-16 mb-8 opacity-50" />
            <h3 className="text-3xl font-bold mb-6">{t.missionTitle}</h3>
            <p className="text-white/80 text-xl leading-relaxed font-medium">
              {t.missionText}
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-12 rounded-[3rem] border-4 border-agri-green/10 shadow-xl relative overflow-hidden group ac-zoom-in ac-delay-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-agri-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <Eye className="w-16 h-16 mb-8 text-agri-green opacity-50" />
            <h3 className="text-3xl font-bold text-gray-900 mb-6">{t.visionTitle}</h3>
            <p className="text-gray-600 text-xl leading-relaxed font-medium">
              {t.visionText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t.valuesTitle}</h2>
            <div className="w-24 h-1.5 bg-agri-green mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => {
              const delayClass = `ac-delay-${(idx % 4) + 1}`;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 text-center hover:bg-agri-green hover:text-white transition-all group ac-slide-up ${delayClass}`}
                >
                  <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-white/20">
                    <val.icon className="w-8 h-8 text-agri-green group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{val.title}</h3>
                  <p className={cn("font-medium", "text-gray-500 group-hover:text-white/80")}>{val.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-agri-green py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCounter value="500+" label={t.stat1} icon={Users} />
            <StatCounter value="10,000+" label={t.stat2} icon={Smile} />
            <StatCounter value="160+" label={t.stat3} icon={Package} />
            <StatCounter value="30+" label={t.stat4} icon={MapPin} />
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t.teamTitle}</h2>
            <p className="text-gray-500 font-medium">{t.teamSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => {
              const delayClass = `ac-delay-${(idx % 4) + 1}`;
              return (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group ac-slide-up ${delayClass}`}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-agri-green/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                      <div className="flex gap-4">
                        <a href="#" className="bg-white p-2 rounded-lg text-agri-green hover:bg-agri-orange hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
                        <a href="#" className="bg-white p-2 rounded-lg text-agri-green hover:bg-agri-orange hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-agri-green font-bold text-sm mb-4 uppercase tracking-widest">{member.role}</p>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{member.bio}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t.whyTitle}</h2>
            <div className="w-24 h-1.5 bg-agri-green mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, idx) => {
              const delayClass = `ac-delay-${(idx % 3) + 1}`;
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-200 flex items-start gap-6 group hover:border-agri-green transition-all ac-zoom-in ${delayClass}`}
                >
                  <div className="bg-agri-green/10 p-4 rounded-2xl group-hover:bg-agri-green transition-all">
                    <reason.icon className="w-8 h-8 text-agri-green group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                    <p className="text-gray-500 font-medium">{reason.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden ac-slide-up">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1920)' }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6"
          >
            {t.joinTitle}
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/80 mb-12 font-medium"
          >
            {t.joinSubtitle}
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/seller-register" 
              className="w-full sm:w-auto bg-agri-orange text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-agri-orange/20"
            >
              {t.joinBtnFarmer}
            </Link>
            <Link 
              to="/sabziyaan" 
              className="w-full sm:w-auto bg-agri-green text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-xl shadow-agri-green/20"
            >
              {t.joinBtnShop}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
