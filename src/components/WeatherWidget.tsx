import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const WeatherWidget = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Call global wInit when component mounts
    if ((window as any).wInit) {
      (window as any).wInit();
    }
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Step 5 - Home Page Weather DIV */}
        <div id="ac-home-weather" className="ac-zoom-in ac-delay-2"></div>
        
        <div className="mt-8 flex justify-center">
          {/* Step 7 - Full Forecast Button */}
          <button 
            id="forecast-nav-btn"
            className="ac-fade-in ac-delay-3"
            onClick={() => {
              localStorage.setItem('goto_wx', '1');
              // Using window.location instead of navigateToPage to ensure consistent behavior 
              // but following the requested logic
              window.location.href = '/kisan-tips';
            }}
            style={{
              background: '#2d6a2d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {language === 'english' ? 'View Full Forecast →' : 'Poora Forecast Dekhein →'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WeatherWidget;
