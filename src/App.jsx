import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, Sun, Cloud, CloudRain, CloudSnow, Sunrise, Sunset, Eye, Gauge, Calendar, Settings, X, Moon, LogIn, LogOut, User } from 'lucide-react';
import { WeatherParticles, LoadingSpinner } from './components/WeatherEffects';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import TwoFactorSetup from './components/TwoFactorSetup';
import PasswordResetModal from './components/PasswordResetModal';
import { sanitizeCityName, validateCoordinates } from './utils/sanitizer';
import { secureStorage } from './utils/encryption';
import { weatherAPI, authAPI, isAuthenticated, getAuthToken } from './utils/api';
import AirQuality from './components/AirQuality';
import MoonPhase from './components/MoonPhase';
import WeatherCharts from './components/WeatherCharts';
import ClothingRecommendation from './components/ClothingRecommendation';
import ActivitySuggestions from './components/ActivitySuggestions';
import WeatherComparison from './components/WeatherComparison';
import ShareWeather from './components/ShareWeather';
import WeatherAchievements from './components/WeatherAchievements';
import WeatherStreaks from './components/WeatherStreaks';
import FeatureManager from './components/FeatureManager';
import PollenCount from './components/PollenCount';
import Visibility from './components/Visibility';
import Pressure from './components/Pressure';
import DewPoint from './components/DewPoint';
import WindCompass from './components/WindCompass';
import SevereAlerts from './components/SevereAlerts';
import CustomReminders from './components/CustomReminders';
import DailyEmail from './components/DailyEmail';
import PushNotifications from './components/PushNotifications';
// lazy-loaded heavy components
const WeatherRadar = React.lazy(() => import('./components/WeatherRadar'));
const WeatherAnimations = React.lazy(() => import('./components/WeatherAnimations'));
import DarkModeToggle from './components/DarkModeToggle';
import CustomColors from './components/CustomColors';
import WidgetMode from './components/WidgetMode';
import GPSLocation from './components/GPSLocation';
import NearbyCities from './components/NearbyCities';
import RouteWeather from './components/RouteWeather';
import BestTimeRecommendations from './components/BestTimeRecommendations';
import CountdownTimers from './components/CountdownTimers';
import GoldenHour from './components/GoldenHour';
import UserProfiles from './components/UserProfiles';
import CommuteWeather from './components/CommuteWeather';
import WeekendPlanner from './components/WeekendPlanner';
import CalendarIntegration from './components/CalendarIntegration';
import SeasonalStats from './components/SeasonalStats';
import ExportData from './components/ExportData';
// removed WeatherStories (hidden/removed for simplification)
import VoiceCommands from './components/VoiceCommands';
import OfflineMode from './components/OfflineMode';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [unit, setUnit] = useState('celsius');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [timeFormat, setTimeFormat] = useState('12');
  const [showSettings, setShowSettings] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [themeMode, setThemeMode] = useState('auto'); // auto, light, dark, darkBlueRed
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [language, setLanguage] = useState('en'); // en, bn, ar
  const [weatherAlarms, setWeatherAlarms] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // minutes
  const [notifications, setNotifications] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Accurate Plus Code encoder (Open Location Code)
  const encodePlusCode = (latitude, longitude) => {
    const CODE_ALPHABET = '23456789CFGHJMPQRVWX';
    const ENCODING_BASE = 20;
    const PAIR_PRECISION = 5; // Generates 10-digit code (8+2)
    
    // Normalize coordinates
    let lat = latitude + 90.0;
    let lng = longitude + 180.0;
    
    let code = '';
    
    // Generate pairs of digits
    for (let i = 0; i < PAIR_PRECISION; i++) {
      const latDigit = Math.floor(lat * ENCODING_BASE);
      const lngDigit = Math.floor(lng * ENCODING_BASE);
      
      code += CODE_ALPHABET[latDigit];
      code += CODE_ALPHABET[lngDigit];
      
      lat = (lat * ENCODING_BASE) - latDigit;
      lng = (lng * ENCODING_BASE) - lngDigit;
      
      // Add + after 4th digit (8 characters)
      if (i === 3) {
        code += '+';
      }
    }
    
    return code;
  };
  
  // Feature toggles - All disabled for clean minimal design
  const [features, setFeatures] = useState({
    // First 11 features
    airQuality: false,
    moonPhase: false,
    weatherRadar: false,
    weatherCharts: false,
    clothing: false,
    activities: false,
    comparison: false,
    share: false,
    achievements: false,
    streaks: false,
    quiz: false,
    // New 35 features
    pollenCount: false,
    visibility: false,
    pressure: false,
    dewPoint: false,
    windCompass: false,
    severeAlerts: false,
    customReminders: false,
    dailyEmail: false,
    pushNotifications: false,
    weatherAnimations: false,
    darkModeToggle: false,
    customColors: false,
    widgetMode: false,
    gpsLocation: false,
    nearbyCities: false,
    routeWeather: false,
    bestTime: false,
    countdownTimers: false,
    goldenHour: false,
    userProfiles: false,
    commuteWeather: false,
    weekendPlanner: false,
    calendarIntegration: false,
    seasonalStats: false,
    exportData: false,
    weatherStories: false,
    voiceCommands: false,
    offlineMode: false
  });
  
  // Additional data states
  const [airQualityIndex, setAirQualityIndex] = useState(Math.floor(Math.random() * 150) + 20);
  const [moonPhaseValue, setMoonPhaseValue] = useState(0.3);
  const [weatherAchievements, setWeatherAchievements] = useState([1, 2, 9]);
  const [weatherStreaks, setWeatherStreaks] = useState({
    sunny: 3,
    sunnyRecord: 7,
    rainy: 0,
    rainyRecord: 5,
    cold: 0,
    coldRecord: 10,
    hot: 0,
    hotRecord: 8,
    checkin: 15,
    checkinRecord: 30
  });
  const [comparisonLocations, setComparisonLocations] = useState([]);

  const getWeatherDescription = (code) => {
    const codes = {
      0: { text: 'Clear Sky', icon: '☀️', theme: 'sunny' },
      1: { text: 'Mainly Clear', icon: '🌤️', theme: 'sunny' },
      2: { text: 'Partly Cloudy', icon: '⛅', theme: 'cloudy' },
      3: { text: 'Overcast', icon: '☁️', theme: 'cloudy' },
      45: { text: 'Foggy', icon: '🌫️', theme: 'foggy' },
      48: { text: 'Depositing Rime Fog', icon: '🌫️', theme: 'foggy' },
      51: { text: 'Light Drizzle', icon: '🌦️', theme: 'rainy' },
      53: { text: 'Moderate Drizzle', icon: '🌧️', theme: 'rainy' },
      55: { text: 'Dense Drizzle', icon: '🌧️', theme: 'rainy' },
      61: { text: 'Slight Rain', icon: '🌦️', theme: 'rainy' },
      63: { text: 'Moderate Rain', icon: '🌧️', theme: 'rainy' },
      65: { text: 'Heavy Rain', icon: '⛈️', theme: 'stormy' },
      71: { text: 'Slight Snow', icon: '❄️', theme: 'snowy' },
      73: { text: 'Moderate Snow', icon: '❄️', theme: 'snowy' },
      75: { text: 'Heavy Snow', icon: '🌨️', theme: 'snowy' },
      95: { text: 'Thunderstorm', icon: '⛈️', theme: 'stormy' },
      96: { text: 'Thunderstorm with Hail', icon: '⛈️', theme: 'stormy' },
      99: { text: 'Severe Thunderstorm', icon: '⚡', theme: 'stormy' }
    };
    return codes[code] || { text: 'Unknown', icon: '❓', theme: 'cloudy' };
  };

  const getThemeStyles = () => {
    if (!weather) {
      return {
        bg: 'from-slate-900 via-blue-900 to-slate-800',
        card: 'bg-white/10 backdrop-blur-lg',
        text: 'text-white',
        accent: 'from-blue-400 to-purple-500'
      };
    }

    const weatherInfo = getWeatherDescription(weather.current.weather_code);
    const temp = weather.current.temperature_2m;
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    switch(weatherInfo.theme) {
      case 'sunny':
        return {
          bg: isNight 
            ? 'from-indigo-900 via-purple-900 to-pink-900'
            : 'from-sky-300 via-blue-400 to-cyan-500',
          card: 'bg-white/20 backdrop-blur-md shadow-2xl border border-white/30',
          text: isNight ? 'text-white' : 'text-gray-900',
          accent: 'from-yellow-400 to-orange-500',
          glow: 'shadow-yellow-500/50'
        };
      
      case 'cloudy':
        return {
          bg: 'from-gray-400 via-gray-500 to-gray-600',
          card: 'bg-white/15 backdrop-blur-lg shadow-xl border border-white/20',
          text: 'text-white',
          accent: 'from-gray-300 to-gray-500',
          glow: 'shadow-gray-400/30'
        };
      
      case 'rainy':
        return {
          bg: 'from-slate-700 via-blue-800 to-indigo-900',
          card: 'bg-blue-900/30 backdrop-blur-xl shadow-2xl border border-blue-400/20',
          text: 'text-white',
          accent: 'from-blue-400 to-cyan-600',
          glow: 'shadow-blue-500/40'
        };
      
      case 'stormy':
        return {
          bg: 'from-gray-900 via-slate-800 to-gray-900',
          card: 'bg-gray-800/40 backdrop-blur-xl shadow-2xl border border-purple-500/30',
          text: 'text-white',
          accent: 'from-purple-500 to-pink-600',
          glow: 'shadow-purple-500/50'
        };
      
      case 'snowy':
        return {
          bg: 'from-blue-100 via-cyan-200 to-blue-300',
          card: 'bg-white/40 backdrop-blur-lg shadow-xl border border-white/50',
          text: 'text-gray-900',
          accent: 'from-cyan-400 to-blue-500',
          glow: 'shadow-cyan-300/40'
        };
      
      case 'foggy':
        return {
          bg: 'from-gray-300 via-slate-400 to-gray-500',
          card: 'bg-white/25 backdrop-blur-2xl shadow-xl border border-white/30',
          text: 'text-gray-800',
          accent: 'from-slate-400 to-gray-600',
          glow: 'shadow-gray-400/40'
        };
      
      default:
        return {
          bg: 'from-blue-900 via-indigo-900 to-purple-900',
          card: 'bg-white/10 backdrop-blur-lg',
          text: 'text-white',
          accent: 'from-blue-400 to-purple-500',
          glow: 'shadow-blue-400/30'
        };
    }
  };

  const getAppliedTheme = () => {
    const autoTheme = getThemeStyles();
    
    if (themeMode === 'light') {
      return {
        bg: 'from-sky-200 via-blue-100 to-indigo-200',
        card: 'bg-white/60 backdrop-blur-md shadow-xl border border-white/50',
        text: 'text-gray-900',
        accent: 'from-blue-500 to-indigo-600',
        glow: 'shadow-blue-300/50'
      };
    } else if (themeMode === 'dark') {
      return {
        bg: 'from-gray-900 via-slate-900 to-black',
        card: 'bg-gray-800/40 backdrop-blur-xl shadow-2xl border border-gray-700/30',
        text: 'text-white',
        accent: 'from-gray-600 to-gray-800',
        glow: 'shadow-gray-700/50'
      };
    } else if (themeMode === 'darkBlueRed') {
      return {
        bg: 'from-blue-950 via-indigo-950 to-red-950',
        card: 'bg-gradient-to-br from-blue-900/40 to-red-900/40 backdrop-blur-xl shadow-2xl border border-purple-500/30',
        text: 'text-white',
        accent: 'from-blue-500 to-red-600',
        glow: 'shadow-purple-600/60'
      };
    }
    
    return autoTheme; // auto mode
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    if (timeFormat === '24') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const convertTemp = (temp) => {
    if (unit === 'fahrenheit') return `${Math.round((temp * 9/5) + 32)}°F`;
    if (unit === 'kelvin') return `${Math.round(temp + 273.15)}K`;
    return `${Math.round(temp)}°C`;
  };

  const fetchWeatherByCoords = async (lat, lon, cityName) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🌤️ Fetching weather for:', { lat, lon, cityName });
      
      // Validate coordinates
      if (!validateCoordinates(lat, lon)) {
        throw new Error('Invalid coordinates');
      }
      
      // Sanitize city name
      const safeCityName = sanitizeCityName(cityName);
      
      // Use secure API proxy
      const response = await weatherAPI.getForecast(lat, lon);
      console.log('📡 API Response:', response);
      
      if (response.success) {
        console.log('✅ Weather data received:', response.data);
        setWeather(response.data);
        setCoordinates({ lat, lon, name: safeCityName });
        setCity(safeCityName);
        setShowSuggestions(false);
        
        // Fetch prayer times
        fetchPrayerTimes(lat, lon);
      } else {
        console.error('❌ API returned success: false');
        throw new Error('Failed to fetch weather data');
      }
    } catch (err) {
      console.error('🚨 Error fetching weather:', err);
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
      console.log('🏁 Weather fetch complete');
    }
  };

  const fetchPrayerTimes = async (lat, lon) => {
    try {
      const response = await weatherAPI.getPrayerTimes(lat, lon);
      if (response.success && response.data) {
        setPrayerTimes(response.data.timings);
      }
    } catch (err) {
      console.error('Error fetching prayer times:', err);
    }
  };

  const formatPrayerTime = (time24) => {
    if (!time24) return '';
    if (timeFormat === '24') return time24;
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getSehriIftarTimes = () => {
    if (!prayerTimes) return null;
    const fajr = prayerTimes.Fajr;
    const maghrib = prayerTimes.Maghrib;
    
    // Sehri ends 10 minutes before Fajr
    const [fH, fM] = fajr.split(':').map(Number);
    const sehriMinutes = (fH * 60 + fM - 10);
    const sehriHour = Math.floor(sehriMinutes / 60);
    const sehriMin = sehriMinutes % 60;
    const sehriTime = `${String(sehriHour).padStart(2, '0')}:${String(sehriMin).padStart(2, '0')}`;
    
    return {
      sehri: sehriTime,
      iftar: maghrib
    };
  };

  // Translation function
  const t = (key) => {
    const translations = {
      en: {
        weather: 'Weather',
        forecast: 'Forecast',
        search: 'Search for a city...',
        settings: 'Settings',
        temperature: 'Temperature',
        feelsLike: 'Feels like',
        wind: 'Wind',
        humidity: 'Humidity',
        cloudCover: 'Cloud Cover',
        precipitation: 'Precipitation',
        hourForecast: '24-Hour Forecast',
        dayForecast: '7-Day Forecast',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        prayerTimes: 'Prayer Times',
        sehri: 'Sehri',
        iftar: 'Iftar',
        location: 'Location',
        unit: 'Temperature Unit',
        timeFormat: 'Time Format',
        brightness: 'Brightness Control',
        theme: 'Theme Mode',
        language: 'Language',
        alarms: 'Weather Alarms',
        favorites: 'Favorite Cities',
        autoRefresh: 'Auto Refresh',
        notifications: 'Notifications',
        addAlarm: 'Add Temperature Alert',
        tempAbove: 'Alert when temperature above',
        tempBelow: 'Alert when temperature below',
        addToFavorites: 'Add to Favorites',
        refreshEvery: 'Refresh every',
        minutes: 'minutes',
        close: 'Close'
      },
      bn: {
        weather: 'আবহাওয়া',
        forecast: 'পূর্বাভাস',
        search: 'শহর খুঁজুন...',
        settings: 'সেটিংস',
        temperature: 'তাপমাত্রা',
        feelsLike: 'অনুভূত হয়',
        wind: 'বাতাস',
        humidity: 'আর্দ্রতা',
        cloudCover: 'মেঘের আবরণ',
        precipitation: 'বৃষ্টিপাত',
        hourForecast: '২৪-ঘন্টা পূর্বাভাস',
        dayForecast: '৭-দিনের পূর্বাভাস',
        sunrise: 'সূর্যোদয়',
        sunset: 'সূর্যাস্ত',
        prayerTimes: 'নামাজের সময়',
        sehri: 'সেহরি',
        iftar: 'ইফতার',
        location: 'অবস্থান',
        unit: 'তাপমাত্রা একক',
        timeFormat: 'সময় বিন্যাস',
        brightness: 'উজ্জ্বলতা নিয়ন্ত্রণ',
        theme: 'থিম মোড',
        language: 'ভাষা',
        alarms: 'আবহাওয়া সতর্কতা',
        favorites: 'প্রিয় শহর',
        autoRefresh: 'স্বয়ংক্রিয় রিফ্রেশ',
        notifications: 'বিজ্ঞপ্তি',
        addAlarm: 'তাপমাত্রা সতর্কতা যোগ করুন',
        tempAbove: 'তাপমাত্রা এর উপরে হলে সতর্ক করুন',
        tempBelow: 'তাপমাত্রা এর নিচে হলে সতর্ক করুন',
        addToFavorites: 'প্রিয়তে যোগ করুন',
        refreshEvery: 'প্রতি রিফ্রেশ করুন',
        minutes: 'মিনিট',
        close: 'বন্ধ করুন'
      },
      ar: {
        weather: 'الطقس',
        forecast: 'توقعات',
        search: 'ابحث عن مدينة...',
        settings: 'الإعدادات',
        temperature: 'درجة الحرارة',
        feelsLike: 'يشعر وكأنه',
        wind: 'الرياح',
        humidity: 'الرطوبة',
        cloudCover: 'الغطاء السحابي',
        precipitation: 'هطول الأمطار',
        hourForecast: 'توقعات 24 ساعة',
        dayForecast: 'توقعات 7 أيام',
        sunrise: 'شروق الشمس',
        sunset: 'غروب الشمس',
        prayerTimes: 'أوقات الصلاة',
        sehri: 'السحور',
        iftar: 'الإفطار',
        location: 'الموقع',
        unit: 'وحدة الحرارة',
        timeFormat: 'تنسيق الوقت',
        brightness: 'التحكم في السطوع',
        theme: 'وضع السمة',
        language: 'اللغة',
        alarms: 'تنبيهات الطقس',
        favorites: 'المدن المفضلة',
        autoRefresh: 'التحديث التلقائي',
        notifications: 'الإشعارات',
        addAlarm: 'إضافة تنبيه درجة الحرارة',
        tempAbove: 'تنبيه عندما تكون درجة الحرارة فوق',
        tempBelow: 'تنبيه عندما تكون درجة الحرارة تحت',
        addToFavorites: 'أضف إلى المفضلة',
        refreshEvery: 'تحديث كل',
        minutes: 'دقائق',
        close: 'إغلاق'
      }
    };
    return translations[language][key] || key;
  };

  // Check weather alarms
  const checkWeatherAlarms = () => {
    if (!weather || !notifications || weatherAlarms.length === 0) return;
    
    const currentTemp = weather.current.temperature_2m;
    weatherAlarms.forEach(alarm => {
      if (alarm.type === 'above' && currentTemp > alarm.value) {
        showNotification(`Temperature Alert: ${currentTemp}°C is above ${alarm.value}°C`);
      } else if (alarm.type === 'below' && currentTemp < alarm.value) {
        showNotification(`Temperature Alert: ${currentTemp}°C is below ${alarm.value}°C`);
      }
    });
  };

  const showNotification = (message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Weather Alert', { body: message });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const addToFavorites = (cityName, lat, lon) => {
    const safeCityName = sanitizeCityName(cityName);
    const newFavorite = { name: safeCityName, lat, lon };
    if (!favorites.some(f => f.name === safeCityName)) {
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      // Use encrypted storage
      secureStorage.setItem('weatherFavorites', updatedFavorites);
    }
  };

  const removeFromFavorites = (cityName) => {
    const updated = favorites.filter(f => f.name !== cityName);
    setFavorites(updated);
    // Use encrypted storage
    secureStorage.setItem('weatherFavorites', updated);
  };

  const fetchCitySuggestions = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      // Sanitize search term
      const safeTerm = sanitizeCityName(searchTerm);
      
      // Use secure API proxy
      const response = await weatherAPI.searchCity(safeTerm);
      
      if (response.success && response.data && response.data.length > 0) {
        setSearchSuggestions(response.data);
      } else {
        setSearchSuggestions([]);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSearchSuggestions([]);
    }
  };

  const handleCityInput = (e) => {
    const value = e.target.value;
    setCity(value);
    fetchCitySuggestions(value);
    if (value.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchSuggestions.length > 0) {
      const firstResult = searchSuggestions[0];
      fetchWeatherByCoords(firstResult.latitude, firstResult.longitude, firstResult.name);
    }
  };

  useEffect(() => {
    fetchWeatherByCoords(22.8456, 89.5403, 'Khulna');
  }, []);

  // Load favorites from encrypted storage and check auth
  useEffect(() => {
    const saved = secureStorage.getItem('weatherFavorites');
    if (saved) {
      setFavorites(saved);
    }
    requestNotificationPermission();
    
    // Check if user is authenticated
    if (isAuthenticated()) {
      authAPI.getProfile()
        .then(response => {
          if (response.success) {
            setUser(response.user);
          }
        })
        .catch(() => {
          // Token expired or invalid
          authAPI.logout();
        });
    }
  }, []);

  // Auto-refresh weather data
  useEffect(() => {
    if (!autoRefresh || !coordinates) return;
    
    const interval = setInterval(() => {
      fetchWeatherByCoords(coordinates.lat, coordinates.lon, city);
    }, refreshInterval * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, coordinates]);

  // Check alarms when weather updates
  useEffect(() => {
    if (weather) {
      checkWeatherAlarms();
    }
  }, [weather]);

  const theme = getAppliedTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-1000 relative overflow-hidden`} style={{ filter: `brightness(${brightness}%)` }}>
      {/* Navigation Bar */}
      <Navbar features={features} setFeatures={setFeatures} theme={theme} />
      
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {weather && <WeatherParticles weatherCode={weather.current.weather_code} />}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-2`}>
                {t('weather')} {t('forecast')}
              </h1>
              <p className={`${theme.text} opacity-80`}>Real-time weather updates</p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Auth Button */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className={`${theme.card} rounded-xl px-4 py-2 border border-white/20`}>
                    <User className="w-5 h-5 inline mr-2" />
                    <span className={`${theme.text} font-semibold`}>{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      authAPI.logout();
                      setUser(null);
                    }}
                    className={`p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:scale-110 transition-all shadow-lg`}
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`p-3 bg-gradient-to-r ${theme.accent} rounded-xl hover:scale-110 transition-all ${theme.glow} shadow-lg`}
                  title="Login / Sign Up"
                >
                  <LogIn className="w-5 h-5 text-white" />
                </button>
              )}
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative flex-1 md:w-96">
                <input
                  type="text"
                  name="citySearch"
                  placeholder={t('search')}
                  className={`w-full ${theme.card} ${theme.text} border-0 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-current placeholder-opacity-50 transition-all text-lg`}
                  value={city}
                  onChange={handleCityInput}
                  onFocus={() => city.length >= 2 && setShowSuggestions(true)}
                />
                <button 
                type="submit"
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r ${theme.accent} rounded-xl hover:scale-110 transition-all ${theme.glow} shadow-lg`}
              >
                <Search className="w-5 h-5 text-white" />
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className={`absolute top-full mt-2 w-full ${theme.card} ${theme.text} rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-50`}>
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-5 py-3 hover:bg-white/20 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                      onClick={() => {
                        fetchWeatherByCoords(suggestion.latitude, suggestion.longitude, suggestion.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="font-semibold">{suggestion.name}</div>
                      <div className="text-sm opacity-70">{suggestion.country} {suggestion.admin1 && `• ${suggestion.admin1}`}</div>
                    </div>
                  ))}
                </div>
              )}
              </form>

              {/* Settings Button */}
              <button
                onClick={() => {
                  console.log('Settings button clicked');
                  setShowSettings(true);
                }}
                className={`p-4 bg-gradient-to-r ${theme.accent} rounded-2xl hover:scale-110 transition-all ${theme.glow} shadow-lg cursor-pointer`}
                title="Settings"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </header>

        {loading && (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className={`${theme.card} ${theme.text} rounded-3xl p-8 text-center shadow-2xl`}>
            <p className="text-xl">⚠️ {error}</p>
          </div>
        )}

        {weather && !loading && (
          <div className="space-y-6">
            {/* Main Weather Card */}
            <div className={`${theme.card} rounded-3xl p-8 md:p-12 ${theme.glow} shadow-2xl`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <button 
                    onClick={() => setShowLocationPicker(true)}
                    className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <MapPin className={`w-6 h-6 ${theme.text}`} />
                    <h2 className={`text-3xl font-bold ${theme.text}`}>{coordinates?.name}</h2>
                  </button>
                  <div className={`text-8xl md:text-9xl font-bold ${theme.text} mb-4`}>
                    {convertTemp(weather.current.temperature_2m)}
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                    <span className="text-6xl">{getWeatherDescription(weather.current.weather_code).icon}</span>
                    <span className={`text-2xl font-semibold ${theme.text}`}>
                      {getWeatherDescription(weather.current.weather_code).text}
                    </span>
                  </div>
                  <div className={`${theme.text} opacity-80 text-lg`}>
                    Feels like {convertTemp(weather.current.apparent_temperature)}
                  </div>
                  <div className={`${theme.text} opacity-70 mt-2`}>
                    {formatDate(weather.current.time)} • {formatTime(weather.current.time)}
                  </div>
                </div>

                {/* Weather Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className={`${theme.card} rounded-2xl p-6 text-center border border-white/20`}>
                    <Wind className={`w-8 h-8 ${theme.text} mx-auto mb-2`} />
                    <div className={`text-2xl font-bold ${theme.text}`}>{Math.round(weather.current.wind_speed_10m)} km/h</div>
                    <div className={`text-sm ${theme.text} opacity-70`}>Wind Speed</div>
                  </div>
                  <div className={`${theme.card} rounded-2xl p-6 text-center border border-white/20`}>
                    <Droplets className={`w-8 h-8 ${theme.text} mx-auto mb-2`} />
                    <div className={`text-2xl font-bold ${theme.text}`}>{weather.current.relative_humidity_2m}%</div>
                    <div className={`text-sm ${theme.text} opacity-70`}>Humidity</div>
                  </div>
                  <div className={`${theme.card} rounded-2xl p-6 text-center border border-white/20`}>
                    <Cloud className={`w-8 h-8 ${theme.text} mx-auto mb-2`} />
                    <div className={`text-2xl font-bold ${theme.text}`}>{weather.current.cloud_cover}%</div>
                    <div className={`text-sm ${theme.text} opacity-70`}>Cloud Cover</div>
                  </div>
                  <div className={`${theme.card} rounded-2xl p-6 text-center border border-white/20`}>
                    <CloudRain className={`w-8 h-8 ${theme.text} mx-auto mb-2`} />
                    <div className={`text-2xl font-bold ${theme.text}`}>{weather.current.precipitation} mm</div>
                    <div className={`text-sm ${theme.text} opacity-70`}>Precipitation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast removed — consolidated into `WeatherCharts` component */}

            {/* 7-Day Forecast */}
            <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl`}>
              <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
                <Calendar className="w-6 h-6" />
                {t('dayForecast')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {weather.daily.time.map((date, index) => (
                  <button 
                    key={index} 
                    className={`${theme.card} rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all cursor-pointer hover:border-white/40 text-left`}
                    onClick={() => {
                      console.log('Clicked day:', index);
                      setSelectedDay(index);
                      setShowDayDetails(true);
                    }}
                  >
                    <div className={`text-lg font-semibold ${theme.text} mb-3`}>
                      {formatDate(date)}
                    </div>
                    <div className="text-5xl mb-3 text-center">{getWeatherDescription(weather.daily.weather_code[index]).icon}</div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className={`text-2xl font-bold ${theme.text}`}>
                          {convertTemp(weather.daily.temperature_2m_max[index])}
                        </div>
                        <div className={`text-sm ${theme.text} opacity-70`}>High</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${theme.text}`}>
                          {convertTemp(weather.daily.temperature_2m_min[index])}
                        </div>
                        <div className={`text-sm ${theme.text} opacity-70`}>Low</div>
                      </div>
                    </div>
                    <div className={`mt-3 pt-3 border-t border-white/20 ${theme.text} opacity-70 text-sm`}>
                      ☂️ {weather.daily.precipitation_probability_max[index]}% • UV {weather.daily.uv_index_max[index]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sun Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl`}>
                <div className="flex items-center gap-4 mb-4">
                  <Sunrise className={`w-10 h-10 ${theme.text}`} />
                  <div>
                    <div className={`text-xl font-semibold ${theme.text}`}>Sunrise</div>
                    <div className={`text-3xl font-bold ${theme.text}`}>
                      {formatTime(weather.daily.sunrise[0])}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl`}>
                <div className="flex items-center gap-4 mb-4">
                  <Sunset className={`w-10 h-10 ${theme.text}`} />
                  <div>
                    <div className={`text-xl font-semibold ${theme.text}`}>Sunset</div>
                    <div className={`text-3xl font-bold ${theme.text}`}>
                      {formatTime(weather.daily.sunset[0])}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prayer Times Card */}
            {prayerTimes && (
              <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl`}>
                <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
                  <Moon className="w-6 h-6" />
                  {t('prayerTimes')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                    <div key={prayer} className={`${theme.card} rounded-2xl p-4 text-center border border-white/20`}>
                      <div className={`text-sm ${theme.text} opacity-70 mb-1`}>{prayer}</div>
                      <div className={`text-xl font-bold ${theme.text}`}>
                        {formatPrayerTime(prayerTimes[prayer])}
                      </div>
                    </div>
                  ))}
                </div>
                {getSehriIftarTimes() && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`${theme.card} rounded-2xl p-4 border border-white/20`}>
                      <div className={`text-sm ${theme.text} opacity-70 mb-1`}>{t('sehri')}</div>
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {formatPrayerTime(getSehriIftarTimes().sehri)}
                      </div>
                    </div>
                    <div className={`${theme.card} rounded-2xl p-4 border border-white/20`}>
                      <div className={`text-sm ${theme.text} opacity-70 mb-1`}>{t('iftar')}</div>
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {formatPrayerTime(getSehriIftarTimes().iftar)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* New Feature Components */}
            {features.airQuality && <AirQuality aqi={airQualityIndex} theme={theme} />}
            {features.moonPhase && <MoonPhase phase={moonPhaseValue} theme={theme} />}
            {features.weatherCharts && weather.hourly && (
              <WeatherCharts hourly={weather.hourly} convertTemp={convertTemp} theme={theme} />
            )}
            {features.clothing && (
              <ClothingRecommendation 
                temperature={weather.current.temperature_2m} 
                weatherCode={weather.current.weather_code} 
                theme={theme} 
              />
            )}
            {features.activities && <ActivitySuggestions weather={weather} theme={theme} />}
            {features.weatherRadar && (
              <React.Suspense fallback={<div className="p-6"><LoadingSpinner /></div>}>
                <WeatherRadar coordinates={coordinates} theme={theme} />
              </React.Suspense>
            )}
            {features.comparison && comparisonLocations.length > 0 && (
              <WeatherComparison 
                locations={comparisonLocations} 
                convertTemp={convertTemp} 
                theme={theme} 
              />
            )}
            {features.share && <ShareWeather weather={weather} city={city} theme={theme} />}
            {features.achievements && (
              <WeatherAchievements achievements={weatherAchievements} theme={theme} />
            )}
            {features.streaks && <WeatherStreaks streaks={weatherStreaks} theme={theme} />}
            
            {/* New Features - Weather Data */}
            {features.pollenCount && <PollenCount theme={theme} />}
            {features.visibility && <Visibility weather={weather} theme={theme} />}
            {features.pressure && <Pressure weather={weather} theme={theme} />}
            {features.dewPoint && <DewPoint weather={weather} theme={theme} convertTemp={convertTemp} />}
            {features.windCompass && <WindCompass weather={weather} theme={theme} />}
            {features.severeAlerts && <SevereAlerts theme={theme} />}
            
            {/* New Features - Notifications */}
            {features.customReminders && <CustomReminders theme={theme} />}
            {features.dailyEmail && <DailyEmail theme={theme} />}
            {features.pushNotifications && <PushNotifications theme={theme} />}
            
            {/* New Features - Visual */}
            {features.weatherAnimations && (
              <React.Suspense fallback={<div className="p-6"><LoadingSpinner /></div>}>
                <WeatherAnimations weather={weather} theme={theme} />
              </React.Suspense>
            )}
            {features.darkModeToggle && (
              <DarkModeToggle 
                theme={theme} 
                setThemeMode={setThemeMode} 
                currentTheme={themeMode}
              />
            )}
            {features.customColors && <CustomColors theme={theme} setThemeMode={setThemeMode} />}
            {features.widgetMode && <WidgetMode theme={theme} />}
            
            {/* New Features - Location */}
            {features.gpsLocation && <GPSLocation setCity={setCity} theme={theme} />}
            {features.nearbyCities && <NearbyCities coordinates={coordinates} theme={theme} />}
            {features.routeWeather && <RouteWeather theme={theme} />}
            
            {/* New Features - Personal */}
            {features.bestTime && <BestTimeRecommendations weather={weather} theme={theme} />}
            {features.countdownTimers && <CountdownTimers theme={theme} />}
            {features.goldenHour && <GoldenHour theme={theme} />}
            {features.userProfiles && <UserProfiles theme={theme} />}
            {features.commuteWeather && <CommuteWeather theme={theme} />}
            {features.weekendPlanner && <WeekendPlanner weather={weather} theme={theme} />}
            
            {/* New Features - Integration */}
            {features.calendarIntegration && <CalendarIntegration theme={theme} />}
            {features.seasonalStats && <SeasonalStats theme={theme} />}
            {features.exportData && <ExportData weather={weather} theme={theme} />}
            {/* WeatherStories removed for a simpler UI */}
            {features.voiceCommands && <VoiceCommands setCity={setCity} theme={theme} />}
            {features.offlineMode && <OfflineMode theme={theme} />}
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-[9999] p-4 overflow-y-auto" onClick={() => setShowSettings(false)}>
            <div className={`${theme.card} rounded-3xl p-8 max-w-2xl w-full border border-white/30 shadow-2xl mt-8 mb-8 relative z-[10000]`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-3xl font-bold ${theme.text}`}>{t('settings')}</h2>
                <button onClick={() => setShowSettings(false)} className={`p-2 hover:bg-white/10 rounded-xl transition-all`}>
                  <X className={`w-6 h-6 ${theme.text}`} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Location Settings */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>📍 {t('location')}</h3>
                  <div className="relative">
                    <input
                      type="text"
                      name="settingsLocation"
                      placeholder="Search for a city..."
                      className={`w-full ${theme.card} ${theme.text} border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/50`}
                      value={city}
                      onChange={handleCityInput}
                      onFocus={() => city.length >= 2 && setShowSuggestions(true)}
                    />
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className={`absolute top-full mt-2 w-full ${theme.card} rounded-xl overflow-hidden shadow-2xl border border-white/20 z-50 max-h-60 overflow-y-auto`}>
                        {searchSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 hover:bg-white/20 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                            onClick={() => {
                              fetchWeatherByCoords(suggestion.latitude, suggestion.longitude, suggestion.name);
                              setShowSuggestions(false);
                              setShowSettings(false);
                            }}
                          >
                            <div className={`font-semibold ${theme.text}`}>{suggestion.name}</div>
                            <div className={`text-sm ${theme.text} opacity-70`}>{suggestion.country} {suggestion.admin1 && `• ${suggestion.admin1}`}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {coordinates && (
                    <div className={`mt-3 ${theme.text} opacity-70`}>
                      Current: {coordinates.name} ({coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)})
                    </div>
                  )}
                </div>

                {/* Temperature Unit */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>🌡️ {t('unit')}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['celsius', 'fahrenheit', 'kelvin'].map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                          unit === u 
                            ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl scale-105` 
                            : `${theme.card} ${theme.text} border border-white/20 hover:border-white/40 hover:scale-105`
                        }`}
                      >
                        {u === 'celsius' ? 'Celsius (°C)' : u === 'fahrenheit' ? 'Fahrenheit (°F)' : 'Kelvin (K)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Format */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>🕐 {t('timeFormat')}</h3>
                  <div className="flex gap-3">
                    {['12', '24'].map((format) => (
                      <button
                        key={format}
                        onClick={() => setTimeFormat(format)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                          timeFormat === format 
                            ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow}` 
                            : `${theme.card} ${theme.text} border border-white/20`
                        }`}
                      >
                        {format === '12' ? '12 Hour (6:00 PM)' : '24 Hour (18:00)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brightness */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>💡 {t('brightness')}</h3>
                  <div className={`${theme.card} border border-white/20 rounded-xl p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`${theme.text} opacity-70`}>50%</span>
                      <span className={`text-2xl font-bold ${theme.text}`}>{brightness}%</span>
                      <span className={`${theme.text} opacity-70`}>100%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-gray-600 to-yellow-400 rounded-full appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #4b5563 0%, #fbbf24 ${brightness}%, #374151 ${brightness}%, #374151 100%)`
                      }}
                    />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <button
                        onClick={() => setBrightness(60)}
                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                          brightness === 60
                            ? `bg-gradient-to-r ${theme.accent} text-white`
                            : `${theme.card} ${theme.text} border border-white/20 hover:border-white/40`
                        }`}
                      >
                        Dim
                      </button>
                      <button
                        onClick={() => setBrightness(80)}
                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                          brightness === 80
                            ? `bg-gradient-to-r ${theme.accent} text-white`
                            : `${theme.card} ${theme.text} border border-white/20 hover:border-white/40`
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setBrightness(100)}
                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                          brightness === 100
                            ? `bg-gradient-to-r ${theme.accent} text-white`
                            : `${theme.card} ${theme.text} border border-white/20 hover:border-white/40`
                        }`}
                      >
                        Bright
                      </button>
                    </div>
                  </div>
                </div>

                {/* Theme Mode */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>🎨 {t('theme')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setThemeMode('auto')}
                      className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                        themeMode === 'auto'
                          ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl scale-105`
                          : `${theme.card} ${theme.text} border border-white/20 hover:border-white/40 hover:scale-105`
                      }`}
                    >
                      <div className="text-2xl mb-1">🌈</div>
                      Auto (Weather-based)
                    </button>
                    <button
                      onClick={() => setThemeMode('light')}
                      className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                        themeMode === 'light'
                          ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-xl scale-105'
                          : 'bg-gradient-to-br from-sky-100 to-blue-200 text-gray-800 border border-white/40 hover:scale-105'
                      }`}
                    >
                      <div className="text-2xl mb-1">☀️</div>
                      Light
                    </button>
                    <button
                      onClick={() => setThemeMode('dark')}
                      className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                        themeMode === 'dark'
                          ? 'bg-gradient-to-br from-gray-700 to-black text-white shadow-xl scale-105'
                          : 'bg-gradient-to-br from-gray-600 to-gray-800 text-white border border-gray-500 hover:scale-105'
                      }`}
                    >
                      <div className="text-2xl mb-1">🌙</div>
                      Dark
                    </button>
                    <button
                      onClick={() => setThemeMode('darkBlueRed')}
                      className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                        themeMode === 'darkBlueRed'
                          ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white shadow-xl scale-105 shadow-purple-500/50'
                          : 'bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 text-white border border-purple-500/40 hover:scale-105'
                      }`}
                    >
                      <div className="text-2xl mb-1">🔮</div>
                      Dark Blue & Red
                    </button>
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>🌐 {t('language')}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                        language === 'en'
                          ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl scale-105`
                          : `${theme.card} ${theme.text} border border-white/20 hover:border-white/40 hover:scale-105`
                      }`}
                    >
                      <div className="text-2xl mb-1">🇬🇧</div>
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('bn')}
                      className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                        language === 'bn'
                          ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl scale-105`
                          : `${theme.card} ${theme.text} border border-white/20 hover:border-white/40 hover:scale-105`
                      }`}
                    >
                      <div className="text-2xl mb-1">🇧🇩</div>
                      বাংলা
                    </button>
                    <button
                      onClick={() => setLanguage('ar')}
                      className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                        language === 'ar'
                          ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl scale-105`
                          : `${theme.card} ${theme.text} border border-white/20 hover:border-white/40 hover:scale-105`
                      }`}
                    >
                      <div className="text-2xl mb-1">🇸🇦</div>
                      العربية
                    </button>
                  </div>
                </div>

                {/* Security Settings */}
                {user && (
                  <div>
                    <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>🔒 Security</h3>
                    <div className="space-y-3">
                      {/* Email Verification Status */}
                      {user.emailVerified !== undefined && !user.emailVerified && (
                        <div className={`${theme.card} rounded-xl p-4 border border-yellow-500/50 bg-yellow-500/10`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`${theme.text} font-semibold`}>⚠️ Email Not Verified</p>
                              <p className={`${theme.text} opacity-70 text-sm mt-1`}>Please verify your email address</p>
                            </div>
                            <button
                              onClick={async () => {
                                try {
                                  await authAPI.resendVerification();
                                  alert('Verification email sent!');
                                } catch (err) {
                                  alert('Failed to send email: ' + err.message);
                                }
                              }}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all"
                            >
                              Resend Email
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Two-Factor Authentication */}
                      <div className={`${theme.card} rounded-xl p-4 border border-white/20`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`${theme.text} font-semibold`}>🔐 Two-Factor Authentication</p>
                            <p className={`${theme.text} opacity-70 text-sm mt-1`}>
                              {user.twoFactorEnabled ? 'Enabled - Extra security active' : 'Add an extra layer of security'}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (user.twoFactorEnabled) {
                                // Disable 2FA
                                const password = prompt('Enter your password to disable 2FA:');
                                if (password) {
                                  authAPI.disable2FA(password)
                                    .then(() => {
                                      alert('2FA disabled successfully');
                                      setUser({ ...user, twoFactorEnabled: false });
                                    })
                                    .catch(err => alert('Failed: ' + err.message));
                                }
                              } else {
                                setShow2FASetup(true);
                                setShowSettings(false);
                              }
                            }}
                            className={`px-4 py-2 ${
                              user.twoFactorEnabled 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                            } text-white rounded-lg font-semibold transition-all`}
                          >
                            {user.twoFactorEnabled ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </div>

                      {/* Password Change */}
                      <div className={`${theme.card} rounded-xl p-4 border border-white/20`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`${theme.text} font-semibold`}>🔑 Password</p>
                            <p className={`${theme.text} opacity-70 text-sm mt-1`}>Change your password</p>
                          </div>
                          <button
                            onClick={() => {
                              setShowPasswordReset(true);
                              setShowSettings(false);
                            }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      {/* OAuth Connections */}
                      <div className={`${theme.card} rounded-xl p-4 border border-white/20`}>
                        <p className={`${theme.text} font-semibold mb-3`}>🔗 Connected Accounts</p>
                        <div className="space-y-2">
                          <a
                            href="http://localhost:5000/api/auth/google"
                            className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                          >
                            <span className={theme.text}>Google</span>
                            <span className="text-sm text-green-400">Connect →</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weather Alarms */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>🔔 {t('alarms')}</h3>
                  <div className="space-y-3">
                    <div className={`${theme.card} rounded-xl p-4 border border-white/20`}>
                      <label className={`block ${theme.text} text-sm mb-2`}>{t('tempAbove')}:</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="30"
                          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                          id="alarmAbove"
                        />
                        <button
                          onClick={() => {
                            const value = document.getElementById('alarmAbove').value;
                            if (value) {
                              setWeatherAlarms([...weatherAlarms, { type: 'above', value: parseFloat(value) }]);
                              document.getElementById('alarmAbove').value = '';
                            }
                          }}
                          className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-semibold hover:scale-105 transition-all`}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className={`${theme.card} rounded-xl p-4 border border-white/20`}>
                      <label className={`block ${theme.text} text-sm mb-2`}>{t('tempBelow')}:</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="10"
                          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                          id="alarmBelow"
                        />
                        <button
                          onClick={() => {
                            const value = document.getElementById('alarmBelow').value;
                            if (value) {
                              setWeatherAlarms([...weatherAlarms, { type: 'below', value: parseFloat(value) }]);
                              document.getElementById('alarmBelow').value = '';
                            }
                          }}
                          className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.accent} text-white font-semibold hover:scale-105 transition-all`}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {weatherAlarms.length > 0 && (
                      <div className={`${theme.card} rounded-xl p-4 border border-white/20`}>
                        <p className={`${theme.text} font-semibold mb-2`}>Active Alarms:</p>
                        {weatherAlarms.map((alarm, idx) => (
                          <div key={idx} className={`flex justify-between items-center ${theme.text} text-sm py-1`}>
                            <span>Temp {alarm.type} {alarm.value}°C</span>
                            <button
                              onClick={() => setWeatherAlarms(weatherAlarms.filter((_, i) => i !== idx))}
                              className="text-red-400 hover:text-red-300"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Favorite Cities */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>⭐ {t('favorites')}</h3>
                  <div className="space-y-3">
                    {weather && coordinates && (
                      <button
                        onClick={() => addToFavorites(city, coordinates.lat, coordinates.lon)}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${theme.card} ${theme.text} border border-white/20 hover:border-white/40 hover:scale-105`}
                      >
                        ➕ {t('addToFavorites')} ({city})
                      </button>
                    )}
                    {favorites.length > 0 && (
                      <div className={`${theme.card} rounded-xl p-4 border border-white/20`}>
                        {favorites.map((fav, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                            <button
                              onClick={() => fetchWeatherByCoords(fav.lat, fav.lon, fav.name)}
                              className={`${theme.text} hover:opacity-80 flex-1 text-left`}
                            >
                              📍 {fav.name}
                            </button>
                            <button
                              onClick={() => removeFromFavorites(fav.name)}
                              className="text-red-400 hover:text-red-300 ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto Refresh */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>🔄 {t('autoRefresh')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          autoRefresh
                            ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl`
                            : `${theme.card} ${theme.text} border border-white/20 hover:scale-105`
                        }`}
                      >
                        {autoRefresh ? '✓ Enabled' : 'Disabled'}
                      </button>
                      {autoRefresh && (
                        <div className="flex-1">
                          <label className={`block ${theme.text} text-sm mb-2`}>{t('refreshEvery')}:</label>
                          <select
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                          >
                            <option value="15">15 {t('minutes')}</option>
                            <option value="30">30 {t('minutes')}</option>
                            <option value="60">60 {t('minutes')}</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text} mb-4`}>🔔 {t('notifications')}</h3>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      notifications
                        ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl`
                        : `${theme.card} ${theme.text} border border-white/20 hover:scale-105`
                    }`}
                  >
                    {notifications ? '✓ Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Feature Manager */}
                <FeatureManager features={features} setFeatures={setFeatures} theme={theme} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-start z-[9999] p-4" onClick={() => setShowLocationPicker(false)}>
          <div className={`${theme.card} rounded-3xl p-8 max-w-md w-full border border-white/30 shadow-2xl mt-24 ml-4`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${theme.text}`}>Choose Location</h2>
              <button onClick={() => setShowLocationPicker(false)} className={`p-2 hover:bg-white/10 rounded-xl transition-all`}>
                <X className={`w-6 h-6 ${theme.text}`} />
              </button>
            </div>

            <div className="space-y-6">
              {/* GPS Location Button */}
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                          // Validate coordinates
                          if (!validateCoordinates(latitude, longitude)) {
                            throw new Error('Invalid GPS coordinates');
                          }
                          
                          // Generate accurate Plus Code using our encoder
                          const plusCode = encodePlusCode(latitude, longitude);
                          
                          // Get detailed address using secure API proxy
                          const response = await weatherAPI.reverseGeocode(latitude, longitude);
                          
                          if (response.success && response.data) {
                            const address = response.data.address || {};
                            
                            // Build location string with neighborhood details
                            const neighborhood = address.neighbourhood || address.suburb || address.hamlet || '';
                            const city = address.city || address.town || address.village || address.state_district || 'Unknown';
                            
                            // Sanitize location name
                            const safeName = sanitizeCityName(`${neighborhood}, ${plusCode}, ${city}`);
                            
                            fetchWeatherByCoords(latitude, longitude, safeName);
                          } else {
                            // Fallback to Plus Code only
                            fetchWeatherByCoords(latitude, longitude, plusCode);
                          }
                          setShowLocationPicker(false);
                        } catch (err) {
                          console.error('Location error:', err);
                          const plusCode = encodePlusCode(latitude, longitude);
                          fetchWeatherByCoords(latitude, longitude, plusCode);
                          setShowLocationPicker(false);
                        }
                      },
                      (error) => {
                        alert('Unable to get your location. Please enable location permissions.');
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                      }
                    );
                  } else {
                    alert('Geolocation is not supported by your browser.');
                  }
                }}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl hover:scale-105 flex items-center justify-center gap-3`}
              >
                <MapPin className="w-6 h-6" />
                Use My Current Location (GPS)
              </button>

              <div className={`text-center ${theme.text} opacity-70`}>or</div>

              {/* Manual Search */}
              <div>
                <label className={`block ${theme.text} text-sm mb-2 font-semibold`}>Search City Manually</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type city name..."
                    className={`w-full ${theme.card} ${theme.text} border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/50`}
                    value={city}
                    onChange={handleCityInput}
                    onFocus={() => city.length >= 2 && setShowSuggestions(true)}
                  />
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className={`absolute top-full mt-2 w-full ${theme.card} rounded-xl overflow-hidden shadow-2xl border border-white/20 z-50 max-h-60 overflow-y-auto`}>
                      {searchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-white/20 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                          onClick={() => {
                            // If user typed a detailed address, use it; otherwise use the suggestion name
                            const locationName = city.includes(',') ? city : suggestion.name;
                            fetchWeatherByCoords(suggestion.latitude, suggestion.longitude, locationName);
                            setShowSuggestions(false);
                            setShowLocationPicker(false);
                          }}
                        >
                          <div className={`font-semibold ${theme.text}`}>{suggestion.name}</div>
                          <div className={`text-sm ${theme.text} opacity-70`}>{suggestion.country} {suggestion.admin1 && `• ${suggestion.admin1}`}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Day Forecast Modal - Outside main container */}
      {showDayDetails && selectedDay !== null && weather && (
        <div 
          className="fixed inset-0 overflow-y-auto"
          style={{ 
            zIndex: 999999, 
            backgroundColor: 'rgba(0,0,0,0.97)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <div className="min-h-screen">
            {/* Debug text */}
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '48px', zIndex: 1000000 }}>
              MODAL IS SHOWING - DAY {selectedDay}
            </div>
            
            {/* Close Button */}
            <div className="sticky top-0 z-50 flex justify-end p-4 bg-gradient-to-b from-black/80 to-transparent">
              <button 
                onClick={() => setShowDayDetails(false)} 
                className={`${theme.card} p-3 rounded-xl hover:scale-110 transition-all border border-white/30 backdrop-blur-md`}
              >
                <X className={`w-6 h-6 ${theme.text}`} />
              </button>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 pb-8 -mt-16">
              <div className="space-y-6">
              {/* Main Weather Card - Same as today's view */}
              <div className={`${theme.card} rounded-3xl p-8 md:p-12 ${theme.glow} shadow-2xl border border-white/30`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                      <Calendar className={`w-6 h-6 ${theme.text}`} />
                      <h2 className={`text-3xl font-bold ${theme.text}`}>{formatDate(weather.daily.time[selectedDay])}</h2>
                    </div>
                    <div className={`text-8xl md:text-9xl font-bold ${theme.text} mb-4`}>
                      {convertTemp(weather.daily.temperature_2m_max[selectedDay])}
                    </div>
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                      <span className="text-6xl">{getWeatherDescription(weather.daily.weather_code[selectedDay]).icon}</span>
                      <span className={`text-2xl font-semibold ${theme.text}`}>
                        {getWeatherDescription(weather.daily.weather_code[selectedDay]).text}
                      </span>
                    </div>
                    <div className={`${theme.text} opacity-80 text-lg`}>
                      Low {convertTemp(weather.daily.temperature_2m_min[selectedDay])}
                    </div>
                    <div className={`${theme.text} opacity-70 mt-2`}>
                      {coordinates?.name}
                    </div>
                  </div>

                  {/* Weather Stats Grid - Same as today's view */}
                  <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className={`${theme.card} rounded-2xl p-6 text-center border border-white/20`}>
                      <Wind className={`w-8 h-8 ${theme.text} mx-auto mb-2`} />
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {weather.daily?.wind_speed_10m_max?.[selectedDay]?.toFixed(0) || '0'} km/h
                      </div>
                      <div className={`text-sm ${theme.text} opacity-70`}>Max Wind</div>
                    </div>
                    <div className={`${theme.card} rounded-2xl p-6 text-center border border-white/20`}>
                      <Droplets className={`w-8 h-8 ${theme.text} mx-auto mb-2`} />
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {weather.daily?.precipitation_probability_max?.[selectedDay] || '0'}%
                      </div>
                      <div className={`text-sm ${theme.text} opacity-70`}>Precipitation</div>
                    </div>
                    <div className={`${theme.card} rounded-2xl p-6 text-center border border-white/20`}>
                      <Sun className={`w-8 h-8 ${theme.text} mx-auto mb-2`} />
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {weather.daily?.uv_index_max?.[selectedDay]?.toFixed(1) || '0'}
                      </div>
                      <div className={`text-sm ${theme.text} opacity-70`}>UV Index</div>
                    </div>
                    <div className={`${theme.card} rounded-2xl p-6 text-center border border-white/20`}>
                      <CloudRain className={`w-8 h-8 ${theme.text} mx-auto mb-2`} />
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {weather.daily?.precipitation_sum?.[selectedDay]?.toFixed(1) || '0'} mm
                      </div>
                      <div className={`text-sm ${theme.text} opacity-70`}>Rain Total</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 24-Hour Forecast for selected day */}
              <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
                <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
                  <Thermometer className="w-6 h-6" />
                  24-Hour Forecast
                </h3>
                <div className="overflow-x-auto">
                  <div className="flex gap-4 pb-4">
                    {(() => {
                      const dayStart = selectedDay * 24;
                      const dayEnd = dayStart + 24;
                      
                      return weather.hourly.time.slice(dayStart, dayEnd).map((time, index) => {
                        const hourIndex = dayStart + index;
                        return (
                          <div key={hourIndex} className={`${theme.card} rounded-2xl p-4 min-w-[120px] text-center border border-white/20 hover:scale-105 transition-all`}>
                            <div className={`text-sm ${theme.text} opacity-70 mb-2`}>
                              {formatTime(time)}
                            </div>
                            <div className="text-4xl mb-2">{getWeatherDescription(weather.hourly.weather_code[hourIndex]).icon}</div>
                            <div className={`text-xl font-bold ${theme.text}`}>
                              {convertTemp(weather.hourly.temperature_2m[hourIndex])}
                            </div>
                            <div className={`text-sm ${theme.text} opacity-70 mt-2`}>
                              {weather.hourly.precipitation_probability[hourIndex]}% 💧
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Sun Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
                  <div className="flex items-center gap-4 mb-4">
                    <Sunrise className={`w-10 h-10 ${theme.text}`} />
                    <div>
                      <div className={`text-xl font-semibold ${theme.text}`}>Sunrise</div>
                      <div className={`text-3xl font-bold ${theme.text}`}>
                        {formatTime(weather.daily.sunrise[selectedDay])}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
                  <div className="flex items-center gap-4 mb-4">
                    <Sunset className={`w-10 h-10 ${theme.text}`} />
                    <div>
                      <div className={`text-xl font-semibold ${theme.text}`}>Sunset</div>
                      <div className={`text-3xl font-bold ${theme.text}`}>
                        {formatTime(weather.daily.sunset[selectedDay])}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        theme={theme}
        onAuthSuccess={(userData) => setUser(userData)}
        onPasswordResetClick={() => setShowPasswordReset(true)}
      />

      {/* Two-Factor Setup Modal */}
      {show2FASetup && (
        <TwoFactorSetup
          isOpen={show2FASetup}
          onClose={() => setShow2FASetup(false)}
          theme={theme}
          onSuccess={() => {
            setUser({ ...user, twoFactorEnabled: true });
            setShow2FASetup(false);
          }}
        />
      )}

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <PasswordResetModal
          isOpen={showPasswordReset}
          onClose={() => setShowPasswordReset(false)}
          theme={theme}
        />
      )}
    </div>
  );
}
