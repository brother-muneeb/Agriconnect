import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import MandiRates from '../components/MandiRates';
import WeatherWidget from '../components/WeatherWidget';
import KisanTips from '../components/KisanTips';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Deals from '../components/Deals';
import SellerDashboard from '../components/SellerDashboard';

const Home = () => {
  const [userType, setUserType] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem('ac_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.userType || null;
      }
    } catch (e) {
      // Ignore JSON parse error
    }
    return null;
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        const stored = localStorage.getItem('ac_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserType(parsed.userType || null);
        } else {
          setUserType(null);
        }
      } catch (e) {
        setUserType(null);
      }
    };

    window.addEventListener('ac_user_updated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);

    if ((window as any).acInitAnimations) {
      const timer = setTimeout(() => {
        (window as any).acInitAnimations();
      }, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('ac_user_updated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  if (userType === 'seller') {
    return (
      <div id="seller-home-page">
        <SellerDashboard />
      </div>
    );
  }

  return (
    <div id="home-page">
      <Hero />
      <Features />
      <MandiRates />
      <WeatherWidget />
      <KisanTips />
      <Gallery />
      <Reviews />
      <Deals />
    </div>
  );
};

export default Home;
