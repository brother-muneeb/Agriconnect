import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import MandiRates from '../components/MandiRates';
import WeatherWidget from '../components/WeatherWidget';
import KisanTips from '../components/KisanTips';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Deals from '../components/Deals';

const Home = () => {
  useEffect(() => {
    if ((window as any).acInitAnimations) {
      const timer = setTimeout(() => {
        (window as any).acInitAnimations();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

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
