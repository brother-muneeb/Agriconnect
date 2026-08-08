
// AgriConnect Weather System Utility
export const AgriWeather = {
  // Default location Punjab
  defaultLat: 31.5204,
  defaultLng: 74.3587,
  defaultCity: "Lahore, Punjab",
  
  // Weather codes to icons and text
  getWeatherInfo: function(code: number) {
    if (code === 0) return {
      icon: "☀️", 
      ru: "Saaf Mausam", 
      en: "Clear Sky"
    };
    if (code <= 3) return {
      icon: "⛅", 
      ru: "Badal", 
      en: "Cloudy"
    };
    if (code <= 48) return {
      icon: "🌫️", 
      ru: "Dhund", 
      en: "Foggy"
    };
    if (code <= 55) return {
      icon: "🌦️", 
      ru: "Halki Baarish", 
      en: "Drizzle"
    };
    if (code <= 65) return {
      icon: "🌧️", 
      ru: "Baarish", 
      en: "Rain"
    };
    if (code <= 77) return {
      icon: "❄️", 
      ru: "Barf", 
      en: "Snow"
    };
    if (code <= 82) return {
      icon: "🌧️", 
      ru: "Tez Baarish", 
      en: "Heavy Rain"
    };
    return {
      icon: "⛈️", 
      ru: "Toofan", 
      en: "Thunderstorm"
    };
  },

  // Get day name in both languages
  getDayName: function(dateStr: string, index: number) {
    const days_ru = [
      "Itwar","Somar","Mangal",
      "Budh","Jumerat","Jumma","Hafta"
    ];
    const days_en = [
      "Sunday","Monday","Tuesday",
      "Wednesday","Thursday","Friday","Saturday"
    ];
    const date = new Date(dateStr);
    const dayNum = date.getDay();
    if (index === 0) return {
      ru: "Aaj", en: "Today"
    };
    if (index === 1) return {
      ru: "Kal", en: "Tomorrow"
    };
    return {
      ru: days_ru[dayNum],
      en: days_en[dayNum]
    };
  },

  // Get farming advisory
  getFarmingAdvice: function(temp: number, rain: number, code: number) {
    if (temp > 35) return {
      color: "orange",
      icon: "🌡️",
      ru: "Garmi Bohot Zyada Hai! Subah 6 Baje Ya Sham Ko Pani Dein. Fasal Ko Dhoop Say Bachayein.",
      en: "Very Hot! Water crops in early morning or evening. Protect crops from direct sunlight."
    };
    if (rain > 60) return {
      color: "blue",
      icon: "🌧️",
      ru: "Baarish Ka Zyada Imkan Hai! Katai Rok Lein. Khet Mein Pani Nikalne Ka Intezam Karein.",
      en: "High Rain Probability! Stop harvesting. Arrange drainage in fields."
    };
    if (temp < 10) return {
      color: "lightblue",
      icon: "🥶",
      ru: "Sardi Bohot Zyada Hai! Raat Ko Fasal Zaroor Dhakein. Subah Dhoop Nikalnay Par Pani Dein.",
      en: "Very Cold! Cover crops at night. Water only after morning sun comes out."
    };
    if (code >= 95) return {
      color: "darkblue",
      icon: "⛈️",
      ru: "Toofan Ka Khatra! Khet Mein Mat Jayein. Fasal Ko Mehfooz Jagah Rakhein.",
      en: "Storm Warning! Do not go to fields. Keep crops in safe place."
    };
    return {
      color: "green",
      icon: "🌿",
      ru: "Mausam Khushgawar Hai! Fasal Lagane Ka Acha Waqt Hai. Khaad Daal Sakte Hain.",
      en: "Pleasant Weather! Good time to plant crops. Can apply fertilizer."
    };
  },

  // Fetch weather from Open-Meteo API
  fetchWeather: async function(lat: number, lng: number, cityName: string) {
    try {
      const url = 
        "https://api.open-meteo.com/v1/forecast?" +
        "latitude=" + lat +
        "&longitude=" + lng +
        "&current=temperature_2m," +
        "relative_humidity_2m," +
        "wind_speed_10m," +
        "precipitation_probability," +
        "weather_code" +
        "&daily=temperature_2m_max," +
        "temperature_2m_min," +
        "precipitation_probability_max," +
        "weather_code" +
        "&timezone=Asia%2FKarachi" +
        "&forecast_days=7";

      const response = await fetch(url);
      const data = await response.json();

      // Save to localStorage
      const weatherData = {
        city: cityName,
        lat: lat,
        lng: lng,
        current: {
          temp: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          rain: data.current.precipitation_probability,
          code: data.current.weather_code
        },
        daily: data.daily
      };

      localStorage.setItem(
        'agriconnect-weather',
        JSON.stringify(weatherData)
      );

      return weatherData;

    } catch(error) {
      console.error("Fetch weather error:", error);
      // Return default if API fails
      return {
        city: cityName || "Lahore, Punjab",
        current: {
          temp: 28,
          humidity: 65,
          wind: 12,
          rain: 20,
          code: 0
        },
        daily: null
      };
    }
  },

  // Request location permission
  requestLocation: function(): Promise<{lat: number, lng: number, city: string}> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          lat: this.defaultLat,
          lng: this.defaultLng,
          city: this.defaultCity
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocode to get city name
          try {
            const geoUrl = 
              "https://nominatim.openstreetmap.org/reverse?" +
              "lat=" + lat +
              "&lon=" + lng +
              "&format=json";
            const res = await fetch(geoUrl, {
              headers: {
                'User-Agent': 'AgriConnect-App'
              }
            });
            const geo = await res.json();
            const city = 
              geo.address.city || 
              geo.address.town || 
              geo.address.village || 
              "Aapka Shehar";
            
            // Save location
            const locData = {lat, lng, city};
            localStorage.setItem(
              'agriconnect-location',
              JSON.stringify(locData)
            );
            
            resolve(locData);
          } catch(e) {
            resolve({lat, lng, city: "Aapka Shehar"});
          }
        },
        () => {
          // Permission denied use default
          resolve({
            lat: this.defaultLat,
            lng: this.defaultLng,
            city: this.defaultCity
          });
        }
      );
    });
  },

  // Get saved location or default
  getSavedLocation: function() {
    const saved = localStorage.getItem(
      'agriconnect-location'
    );
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch(e) {
        return {
          lat: this.defaultLat,
          lng: this.defaultLng,
          city: this.defaultCity
        };
      }
    }
    return {
      lat: this.defaultLat,
      lng: this.defaultLng,
      city: this.defaultCity
    };
  }
};
