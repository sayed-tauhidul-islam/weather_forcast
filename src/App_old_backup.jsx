import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, Calendar, ArrowRight, Settings, Sun, Cloud, CloudRain, CloudSnow, Sunrise, Sunset, Eye, Gauge } from 'lucide-react';
import { WeatherParticles, LoadingSpinner } from './components/WeatherEffects';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [showHourly, setShowHourly] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [timeFormat, setTimeFormat] = useState('12');
  const [showSettings, setShowSettings] = useState(false);

  // Mapping WMO weather codes to readable text and icons
  const getWeatherDescription = (code) => {
    const codes = {
      0: { text: 'Clear Sky', icon: '☀️', color: 'text-yellow-500' },
      1: { text: 'Mainly Clear', icon: '🌤️', color: 'text-yellow-400' },
      2: { text: 'Partly Cloudy', icon: '⛅', color: 'text-gray-400' },
      3: { text: 'Overcast', icon: '☁️', color: 'text-gray-600' },
      45: { text: 'Foggy', icon: '🌫️', color: 'text-gray-500' },
      48: { text: 'Depositing Rime Fog', icon: '🌫️', color: 'text-gray-500' },
      51: { text: 'Light Drizzle', icon: '🌦️', color: 'text-blue-300' },
      53: { text: 'Moderate Drizzle', icon: '🌧️', color: 'text-blue-400' },
      55: { text: 'Dense Drizzle', icon: '🌧️', color: 'text-blue-500' },
      61: { text: 'Slight Rain', icon: '🌦️', color: 'text-blue-400' },
      63: { text: 'Moderate Rain', icon: '🌧️', color: 'text-blue-500' },
      65: { text: 'Heavy Rain', icon: '⛈️', color: 'text-blue-700' },
      71: { text: 'Slight Snow', icon: '❄️', color: 'text-cyan-200' },
      73: { text: 'Moderate Snow', icon: '❄️', color: 'text-cyan-400' },
      75: { text: 'Heavy Snow', icon: '❄️', color: 'text-cyan-600' },
      80: { text: 'Slight Showers', icon: '🌦️', color: 'text-blue-400' },
      81: { text: 'Moderate Showers', icon: '🌧️', color: 'text-blue-500' },
      82: { text: 'Violent Showers', icon: '⛈️', color: 'text-blue-700' },
      95: { text: 'Thunderstorm', icon: '⚡', color: 'text-purple-500' },
      96: { text: 'Thunderstorm with Hail', icon: '⛈️', color: 'text-purple-600' },
    };
    return codes[code] || { text: 'Unknown', icon: '❓', color: 'text-gray-400' };
  };

  // Helper to format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Format time for hourly forecast
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    if (timeFormat === '24') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  // Format time with full details (for prayer times, sunrise/sunset)
  const formatTimeDetailed = (dateString) => {
    const date = new Date(dateString);
    if (timeFormat === '24') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Format prayer time string
  const formatPrayerTime = (timeString) => {
    if (!timeString) return '';
    if (timeFormat === '24') {
      return timeString; // Already in 24-hour format
    }
    // Convert from 24-hour to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get relative time for last update
  const getRelativeTime = () => {
    if (!lastUpdated) return '';
    const seconds = Math.floor((new Date() - lastUpdated) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Get data for temperature graph
  const getGraphData = () => {
    if (!weather) return [];
    const data = [];
    for (let i = 0; i < 24; i++) {
      let value;
      if (viewMode === 'temperature') {
        value = weather.hourly.temperature_2m[i];
      } else if (viewMode === 'precipitation') {
        value = weather.hourly.precipitation_probability[i];
      } else {
        value = weather.current.wind_speed_10m; // Simplified for demo
      }
      data.push({
        time: formatTime(weather.hourly.time[i]),
        value: convertTemp(value)
      });
    }
    return data;
  };

  // Convert temperature based on unit
  const convertTemp = (temp) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    } else if (unit === 'kelvin') {
      return Math.round(temp + 273.15);
    }
    return Math.round(temp);
  };

  // Get temperature unit symbol
  const getTempUnit = () => {
    if (unit === 'celsius') return '°C';
    if (unit === 'fahrenheit') return '°F';
    return 'K';
  };

  // Fetch prayer times
  const fetchPrayerTimes = async (lat, lon) => {
    try {
      const date = new Date();
      const timestamp = Math.floor(date.getTime() / 1000);
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=2`
      );
      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
      }
    } catch (err) {
      console.error('Failed to fetch prayer times:', err);
    }
  };

  // Fetch city suggestions
  const fetchCitySuggestions = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchTerm}&count=5&language=en&format=json`
      );
      const data = await response.json();
      if (data.results) {
        setSearchSuggestions(data.results);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    }
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon, cityName) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get Weather Data from Open-Meteo (No API Key needed)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,cloud_cover,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=7`
      );
      
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data = await response.json();

      setWeather({
        city: cityName,
        current: data.current,
        daily: data.daily,
        hourly: data.hourly,
        units: data.current_units,
      });
      
      setCoordinates({ lat, lon });
      setLastUpdated(new Date());
      await fetchPrayerTimes(lat, lon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search for a city using Geocoding API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      // Open-Meteo Geocoding API
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please try again.");
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      await fetchWeatherByCoords(latitude, longitude, `${name}, ${country}`);
      setCity('');
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = async (suggestion) => {
    setShowSuggestions(false);
    setCity('');
    const { latitude, longitude, name, country } = suggestion;
    await fetchWeatherByCoords(latitude, longitude, `${name}, ${country}`);
  };

  // Handle city input change
  const handleCityInput = (e) => {
    const value = e.target.value;
    setCity(value);
    fetchCitySuggestions(value);
  };

  // Get User's Current Location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding is complex without a key, so we'll just say "Your Location"
          fetchWeatherByCoords(latitude, longitude, "Your Location");
        },
        () => {
          setError("Unable to retrieve your location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Load default location on mount
  useEffect(() => {
    // Default to Khulna, Bangladesh
    fetchWeatherByCoords(22.8456, 89.5403, "Khulna, Bangladesh");
  }, []);

  // Get dynamic background based on weather
  const getBackgroundClass = () => {
    if (!weather) return 'from-violet-900 via-blue-900 to-slate-900';
    const code = weather.current.weather_code;
    const isDay = weather.current.is_day;
    
    if (code === 0 || code === 1) {
      return isDay ? 'from-amber-400 via-orange-500 to-pink-500' : 'from-indigo-900 via-purple-900 to-slate-900';
    } else if (code === 2 || code === 3) {
      return isDay ? 'from-cyan-400 via-blue-500 to-indigo-600' : 'from-slate-800 via-gray-900 to-black';
    } else if (code >= 61 && code <= 65) {
      return 'from-slate-700 via-blue-800 to-indigo-900';
    } else if (code >= 71 && code <= 75) {
      return 'from-cyan-200 via-blue-300 to-indigo-400';
    } else if (code >= 95) {
      return 'from-purple-900 via-violet-900 to-fuchsia-900';
    }
    return 'from-violet-900 via-blue-900 to-slate-900';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()} text-white font-sans p-4 md:p-8 flex items-center justify-center transition-all duration-1000 ${
      theme === 'light' ? 'brightness-150 saturate-150' : theme === 'blur' ? 'backdrop-blur-3xl' : ''
    }`}>
      {weather && <WeatherParticles weatherCode={weather.current.weather_code} isDay={weather.current.is_day} />}
      <div className={`max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden border relative z-10 ${
        theme === 'light' 
          ? 'bg-white/90 backdrop-blur-md border-gray-300 text-gray-900' 
          : theme === 'blur'
          ? 'bg-white/5 backdrop-blur-2xl border-white/30'
          : 'bg-white/10 backdrop-blur-md border-white/20'
      }`}>
        
        {/* Header / Search Section */}
        <div className="p-6 md:p-8 border-b border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-blue-400">☁️</span> SkyCast
              </h1>
              {lastUpdated && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live • Updated {getRelativeTime()}
                </p>
              )}
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <input
                type="text"
                name="citySearch"
                placeholder="Search city..."
                className="w-full bg-slate-800/50 border border-slate-600 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400 transition-all"
                value={city}
                onChange={handleCityInput}
                onFocus={() => city.length >= 2 && setShowSuggestions(true)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg"
              >
                <Search size={16} />
              </button>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-lg border border-slate-600 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30 transition-all flex items-center gap-3 border-b border-slate-700/50 last:border-b-0"
                    >
                      <MapPin size={16} className="text-purple-400" />
                      <div>
                        <p className="text-white font-medium">{suggestion.name}</p>
                        <p className="text-sm text-gray-400">
                          {suggestion.admin1 && `${suggestion.admin1}, `}
                          {suggestion.country}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>

            <button 
              onClick={handleCurrentLocation}
              className="p-2 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-full hover:from-emerald-400/50 hover:to-teal-400/50 transition-all backdrop-blur-sm border border-emerald-400/30 shadow-lg"
              title="Use current location"
            >
              <MapPin size={20} className="text-emerald-200" />
            </button>

            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full hover:from-purple-400/50 hover:to-pink-400/50 transition-all backdrop-blur-sm border border-purple-400/30 shadow-lg"
              title="Settings"
            >
              <Settings size={20} className="text-purple-200" />
            </button>

            <button 
              onClick={() => setShowLocationFilters(!showLocationFilters)}
              className="px-3 py-2 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-full hover:from-amber-400/50 hover:to-orange-400/50 transition-all backdrop-blur-sm border border-amber-400/30 shadow-lg text-sm font-semibold"
              title="Advanced Location Filter"
            >
              📍 Filters
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl p-6 rounded-2xl border border-purple-400/30 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                <Settings size={24} className="text-purple-400" />
                Settings & Preferences
              </h3>
              
              <div className="space-y-6">
                {/* Temperature Unit */}
                <div>
                  <label className="text-sm text-gray-300 mb-3 block font-semibold flex items-center gap-2">
                    🌡️ Temperature Unit
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUnit('celsius')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
                        unit === 'celsius'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-105 shadow-cyan-500/50'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      Celsius (°C)
                    </button>
                    <button
                      onClick={() => setUnit('fahrenheit')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
                        unit === 'fahrenheit'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105 shadow-red-500/50'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                    <button
                      onClick={() => setUnit('kelvin')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
                        unit === 'kelvin'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-pink-500/50'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      Kelvin (K)
                    </button>
                  </div>
                </div>

                {/* Time Format */}
                <div>
                  <label className="text-sm text-gray-300 mb-3 block font-semibold flex items-center gap-2">
                    ⏰ Time Format
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimeFormat('12')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
                        timeFormat === '12'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white scale-105 shadow-teal-500/50'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      12 Hour (6:00 PM)
                    </button>
                    <button
                      onClick={() => setTimeFormat('24')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
                        timeFormat === '24'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-105 shadow-purple-500/50'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      24 Hour (18:00)
                    </button>
                  </div>
                </div>

                {/* Theme Mode */}
                <div>
                  <label className="text-sm text-gray-300 mb-3 block font-semibold flex items-center gap-2">
                    💡 Theme & Brightness
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white scale-105 shadow-slate-500/50'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      🌙 Dark
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
                        theme === 'light'
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 scale-105 shadow-yellow-500/50'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      ☀️ Light
                    </button>
                    <button
                      onClick={() => setTheme('blur')}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
                        theme === 'blur'
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white scale-105 shadow-pink-500/50'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }`}
                    >
                      🎨 Blur & Red
                    </button>
                  </div>
                </div>

                {/* Weather Alarms */}
                <div>
                  <label className="text-sm text-gray-300 mb-3 block font-semibold flex items-center gap-2">
                    ⏰ Weather Alarms
                  </label>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Set alerts for specific conditions</span>
                      <button
                        onClick={() => setShowAlarmModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold text-sm hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg"
                      >
                        + Add Alarm
                      </button>
                    </div>
                    {alarms.length > 0 ? (
                      <div className="space-y-2">
                        {alarms.map((alarm, index) => (
                          <div key={index} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                name={`alarm-${index}`}
                                checked={alarm.enabled}
                                onChange={() => {
                                  const newAlarms = [...alarms];
                                  newAlarms[index].enabled = !newAlarms[index].enabled;
                                  setAlarms(newAlarms);
                                }}
                                className="w-4 h-4 accent-green-500"
                              />
                              <div>
                                <p className="text-sm font-semibold">{alarm.time}</p>
                                <p className="text-xs text-gray-400">{alarm.condition}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setAlarms(alarms.filter((_, i) => i !== index))}
                              className="text-red-400 hover:text-red-300 text-sm font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-2">No alarms set</p>
                    )}
                  </div>
                </div>

                {/* Auto Refresh */}
                <div>
                  <label className="text-sm text-gray-300 mb-3 block font-semibold flex items-center gap-2">
                    🔄 Auto Refresh
                  </label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-400 hover:to-emerald-400 transition-all">
                      ✓ Enabled (Every 10 min)
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <label className="text-sm text-gray-300 mb-3 block font-semibold flex items-center gap-2">
                    🔔 Notifications
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg hover:from-violet-400 hover:to-purple-400 transition-all">
                      Severe Weather
                    </button>
                    <button className="py-3 px-4 rounded-xl font-bold bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 transition-all">
                      Daily Forecast
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alarm Modal */}
          {showAlarmModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAlarmModal(false)}>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-purple-400/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Create Weather Alarm</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Time</label>
                    <input
                      type="time"
                      name="alarmTime"
                      value={newAlarm.time}
                      onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Condition</label>
                    <select
                      name="alarmCondition"
                      value={newAlarm.condition}
                      onChange={(e) => setNewAlarm({...newAlarm, condition: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="any">Any Weather</option>
                      <option value="rain">Rain</option>
                      <option value="clear">Clear Sky</option>
                      <option value="hot">Hot (&gt;30°C)</option>
                      <option value="cold">Cold (&lt;15°C)</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (newAlarm.time) {
                          setAlarms([...alarms, {...newAlarm}]);
                          setNewAlarm({ time: '', condition: 'any', enabled: true });
                          setShowAlarmModal(false);
                        }
                      }}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-400 transition-all"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowAlarmModal(false)}
                      className="flex-1 py-2 px-4 bg-slate-700 rounded-lg font-semibold hover:bg-slate-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Location Filters */}
          {showLocationFilters && (
            <div className="mt-4 bg-gradient-to-br from-amber-800/90 to-orange-900/90 backdrop-blur-xl p-6 rounded-2xl border border-amber-400/30 shadow-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                📍 Location Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-amber-200 mb-1 block font-medium">Country</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="e.g., Bangladesh"
                    className="w-full bg-slate-900/50 border border-amber-500/30 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    value={locationFilters.country}
                    onChange={(e) => setLocationFilters({...locationFilters, country: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-200 mb-1 block font-medium">Division</label>
                  <input
                    type="text"
                    name="division"
                    placeholder="e.g., Khulna"
                    className="w-full bg-slate-900/50 border border-amber-500/30 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    value={locationFilters.division}
                    onChange={(e) => setLocationFilters({...locationFilters, division: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-200 mb-1 block font-medium">District</label>
                  <input
                    type="text"
                    name="district"
                    placeholder="e.g., Khulna"
                    className="w-full bg-slate-900/50 border border-amber-500/30 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    value={locationFilters.district}
                    onChange={(e) => setLocationFilters({...locationFilters, district: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-200 mb-1 block font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g., Khulna"
                    className="w-full bg-slate-900/50 border border-amber-500/30 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    value={locationFilters.city}
                    onChange={(e) => setLocationFilters({...locationFilters, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-200 mb-1 block font-medium">Upazila</label>
                  <input
                    type="text"
                    name="upazila"
                    placeholder="e.g., Daulatpur"
                    className="w-full bg-slate-900/50 border border-amber-500/30 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    value={locationFilters.upazila}
                    onChange={(e) => setLocationFilters({...locationFilters, upazila: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={async () => {
                      const searchQuery = [locationFilters.upazila, locationFilters.city, locationFilters.district, locationFilters.division, locationFilters.country]
                        .filter(Boolean)
                        .join(', ');
                      if (searchQuery) {
                        setCity(searchQuery);
                        setLoading(true);
                        try {
                          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`);
                          const geoData = await geoRes.json();
                          if (geoData.results && geoData.results.length > 0) {
                            const { latitude, longitude, name, country } = geoData.results[0];
                            await fetchWeatherByCoords(latitude, longitude, searchQuery);
                            setShowLocationFilters(false);
                          } else {
                            setError('Location not found. Try different filters.');
                          }
                        } catch (err) {
                          setError(err.message);
                        }
                        setLoading(false);
                      }
                    }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-semibold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg"
                  >
                    🔍 Search
                  </button>
                </div>
              </div>
              <p className="text-xs text-amber-300 mt-3">Fill in any combination of location details for more accurate results</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center text-red-300 py-12 bg-red-900/20 rounded-xl">
              <p className="text-lg">{error}</p>
            </div>
          ) : weather ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* View Mode Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setViewMode('temperature')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    viewMode === 'temperature'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                      : 'bg-slate-800/40 text-gray-300 hover:bg-slate-700/50'
                  }`}
                >
                  🌡️ Temperature
                </button>
                <button
                  onClick={() => setViewMode('precipitation')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    viewMode === 'precipitation'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                      : 'bg-slate-800/40 text-gray-300 hover:bg-slate-700/50'
                  }`}
                >
                  💧 Precipitation
                </button>
                <button
                  onClick={() => setViewMode('wind')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    viewMode === 'wind'
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg scale-105'
                      : 'bg-slate-800/40 text-gray-300 hover:bg-slate-700/50'
                  }`}
                >
                  💨 Wind
                </button>
              </div>

              {/* Temperature Graph Chart */}
              <div className="mb-8 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80 backdrop-blur-xl p-8 rounded-3xl border-2 border-white/20 shadow-2xl relative overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    <span className="text-3xl">📊</span> 24-Hour {viewMode === 'temperature' ? 'Temperature' : viewMode === 'precipitation' ? 'Precipitation' : 'Wind'} Graph
                  </h3>
                  
                  <div className="relative h-80 bg-slate-900/40 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <svg width="100%" height="100%" className="overflow-visible">
                      {/* Grid lines */}
                      {[0, 25, 50, 75, 100].map((y) => (
                        <line
                          key={y}
                          x1="0%"
                          y1={`${y}%`}
                          x2="100%"
                          y2={`${y}%`}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                          strokeDasharray="5,5"
                        />
                      ))}
                      
                      {/* Gradient fill under the curve */}
                      <defs>
                        <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={viewMode === 'temperature' ? '#f97316' : viewMode === 'precipitation' ? '#3b82f6' : '#14b8a6'} stopOpacity="0.4" />
                          <stop offset="100%" stopColor={viewMode === 'temperature' ? '#f97316' : viewMode === 'precipitation' ? '#3b82f6' : '#14b8a6'} stopOpacity="0.05" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Area under curve */}
                      <path
                        d={(() => {
                          const data = getGraphData();
                          const maxVal = Math.max(...data.map(d => d.value));
                          const minVal = Math.min(...data.map(d => d.value));
                          const range = maxVal - minVal || 1;
                          let path = '';
                          
                          data.forEach((point, index) => {
                            const x = (index / 23) * 100;
                            const y = 100 - (((point.value - minVal) / range) * 80 + 10);
                            if (index === 0) {
                              path += `M ${x} ${y} `;
                            } else {
                              path += `L ${x} ${y} `;
                            }
                          });
                          
                          path += `L 100 100 L 0 100 Z`;
                          return path;
                        })()}
                        fill="url(#graphGradient)"
                      />
                      
                      {/* Main line */}
                      {weather.hourly.time.slice(0, 24).map((time, index) => {
                        const data = getGraphData();
                        const maxVal = Math.max(...data.map(d => d.value));
                        const minVal = Math.min(...data.map(d => d.value));
                        const range = maxVal - minVal || 1;
                        const x = (index / 23) * 100;
                        const y = 100 - (((data[index].value - minVal) / range) * 80 + 10);
                        
                        if (index === 0) return null;
                        
                        const prevData = data[index - 1];
                        const prevX = ((index - 1) / 23) * 100;
                        const prevY = 100 - (((prevData.value - minVal) / range) * 80 + 10);
                        
                        // Color gradient based on position
                        const colors = viewMode === 'temperature' 
                          ? ['#ef4444', '#f97316', '#fbbf24', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6']
                          : viewMode === 'precipitation'
                          ? ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff']
                          : ['#14b8a6', '#0d9488', '#0f766e', '#5eead4', '#2dd4bf', '#99f6e4', '#ccfbf1', '#f0fdfa'];
                        const colorIndex = Math.floor((index / 23) * (colors.length - 1));
                        
                        return (
                          <g key={index}>
                            <line
                              x1={`${prevX}%`}
                              y1={`${prevY}%`}
                              x2={`${x}%`}
                              y2={`${y}%`}
                              stroke={colors[colorIndex]}
                              strokeWidth="4"
                              strokeLinecap="round"
                              filter="url(#glow)"
                              className="transition-all duration-300"
                            />
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="6"
                              fill={colors[colorIndex]}
                              className="drop-shadow-2xl animate-pulse"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            />
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="10"
                              fill={colors[colorIndex]}
                              opacity="0.3"
                              className="animate-ping"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            />
                            <text
                              x={`${x}%`}
                              y={`${y - 8}%`}
                              fill="white"
                              fontSize="12"
                              fontWeight="bold"
                              textAnchor="middle"
                              className="drop-shadow-lg"
                            >
                              {data[index].value}{viewMode === 'precipitation' ? '%' : viewMode === 'wind' ? '' : '°'}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                    
                    {/* Hour labels - Clear and visible */}
                    <div className="relative mt-10 space-y-6">
                      {/* Time markers with vertical lines */}
                      <div className="flex justify-between items-start px-4 pb-6">
                        {weather.hourly.time.slice(0, 24).map((time, index) => {
                          // Show labels for every 2 hours
                          if (index % 2 !== 0) return <div key={index} className="flex-1"></div>;
                          
                          const date = new Date(time);
                          const hour = date.getHours();
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const hour12 = hour % 12 || 12;
                          
                          let hourLabel;
                          if (timeFormat === '24') {
                            hourLabel = `${hour.toString().padStart(2, '0')}:00`;
                          } else {
                            hourLabel = hour12.toString();
                          }
                          
                          const colors = ['#ef4444', '#f97316', '#fbbf24', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'];
                          const color = colors[Math.floor((index / 23) * (colors.length - 1))];
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-3">
                              {/* Vertical tick line */}
                              <div 
                                className="w-2 h-10 rounded-full"
                                style={{ 
                                  backgroundColor: color,
                                  boxShadow: `0 0 20px ${color}`
                                }}
                              ></div>
                              
                              {/* Hour label box - Much bigger and clearer */}
                              <div 
                                className={`px-4 py-3 rounded-2xl border-3 transition-all hover:scale-125 min-w-[60px] ${index === 0 ? 'animate-pulse' : ''}`}
                                style={{ 
                                  borderWidth: '3px',
                                  borderColor: color,
                                  backgroundColor: `${color}40`,
                                  boxShadow: `0 4px 20px ${color}60`
                                }}
                              >
                                {/* Hour number - BIGGER */}
                                <div 
                                  className="text-2xl font-black text-center leading-none"
                                  style={{ 
                                    color: '#ffffff',
                                    textShadow: `0 0 10px ${color}, 0 2px 4px rgba(0,0,0,0.8)`
                                  }}
                                >
                                  {index === 0 ? '⭐' : hourLabel}
                                </div>
                                
                                {/* AM/PM or Now label - BIGGER */}
                                <div 
                                  className="text-sm font-extrabold text-center mt-1.5 leading-none"
                                  style={{ 
                                    color: '#ffffff',
                                    textShadow: `0 0 8px ${color}, 0 1px 3px rgba(0,0,0,0.8)`
                                  }}
                                >
                                  {index === 0 ? 'Now' : (timeFormat === '12' ? ampm : '')}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Bottom timeline bar - BIGGER */}
                      <div className="h-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500 rounded-full" style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)' }}></div>
                    </div>
                  </div>
                  
                  {/* Legend - Moved below the graph
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800/60 to-slate-900/60 px-5 py-3 rounded-xl border-2 border-white/20 shadow-xl">
                      <div className={`w-4 h-4 rounded-full ${viewMode === 'temperature' ? 'bg-orange-500' : viewMode === 'precipitation' ? 'bg-blue-500' : 'bg-teal-500'} animate-pulse shadow-lg`}></div>
                      <span className="text-white font-bold">📡 Real-time Data</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-slate-800/60 to-slate-900/60 px-5 py-3 rounded-xl border-2 border-white/20 shadow-xl">
                      <span className="text-white font-bold">🔄 Updates Every Hour</span>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Current Weather Card */}
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-12">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-bold mb-2">{weather.city}</h2>
                  <p className="text-xl text-blue-200 mb-1">{formatDate(weather.current.time)}</p>
                  <p className="text-sm text-gray-400">Real-time weather data</p>
                  
                  <div className="flex items-center gap-4 mt-6">
                    <span className="text-7xl md:text-8xl font-bold tracking-tighter">
                      {convertTemp(weather.current.temperature_2m)}{unit === 'celsius' ? '°' : '°'}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-4xl">
                        {getWeatherDescription(weather.current.weather_code).icon}
                      </span>
                      <span className="text-lg text-blue-100 font-medium">
                        {getWeatherDescription(weather.current.weather_code).text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="bg-gradient-to-br from-teal-500/30 to-emerald-500/30 p-4 rounded-xl flex items-center gap-3 border border-teal-400/30 backdrop-blur-sm shadow-lg hover:shadow-teal-500/50 transition-all">
                    <Wind className="text-teal-300" size={24} />
                    <div>
                      <p className="text-xs text-teal-200">Wind</p>
                      <p className="font-bold text-lg">{weather.current.wind_speed_10m} km/h</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 p-4 rounded-xl flex items-center gap-3 border border-blue-400/30 backdrop-blur-sm shadow-lg hover:shadow-blue-500/50 transition-all">
                    <Droplets className="text-blue-300" size={24} />
                    <div>
                      <p className="text-xs text-blue-200">Humidity</p>
                      <p className="font-bold text-lg">{weather.current.relative_humidity_2m}%</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/30 to-red-500/30 p-4 rounded-xl flex items-center gap-3 border border-orange-400/30 backdrop-blur-sm shadow-lg hover:shadow-orange-500/50 transition-all">
                    <Thermometer className="text-orange-300" size={24} />
                    <div>
                      <p className="text-xs text-orange-200">Feels Like</p>
                      <p className="font-bold text-lg">{convertTemp(weather.current.apparent_temperature)}°</p>
                    </div>
                  </div>
                   <div className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30 p-4 rounded-xl flex items-center gap-3 border border-indigo-400/30 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/50 transition-all">
                    <Calendar className="text-indigo-300" size={24} />
                    <div>
                      <p className="text-xs text-indigo-200">Precipitation</p>
                      <p className="font-bold text-lg">{weather.current.precipitation} mm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Weather Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-gradient-to-br from-orange-500/30 via-amber-500/20 to-yellow-500/30 p-4 rounded-xl border border-orange-400/40 shadow-lg hover:shadow-orange-500/50 transition-all hover:scale-105">
                  <p className="text-xs text-orange-200 mb-1 font-semibold">☀️ UV Index</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">{weather.current.uv_index || 0}</p>
                  <p className="text-xs text-orange-300 mt-1 font-medium">{weather.current.uv_index < 3 ? 'Low' : weather.current.uv_index < 6 ? 'Moderate' : weather.current.uv_index < 8 ? 'High' : 'Very High'}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-indigo-500/30 p-4 rounded-xl border border-cyan-400/40 shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105">
                  <p className="text-xs text-cyan-200 mb-1 font-semibold">☁️ Cloud Cover</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">{weather.current.cloud_cover}%</p>
                  <p className="text-xs text-cyan-300 mt-1 font-medium">{weather.current.cloud_cover < 25 ? 'Clear' : weather.current.cloud_cover < 50 ? 'Partly Cloudy' : weather.current.cloud_cover < 75 ? 'Cloudy' : 'Overcast'}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500/30 via-rose-500/20 to-purple-500/30 p-4 rounded-xl border border-pink-400/40 shadow-lg hover:shadow-pink-500/50 transition-all hover:scale-105">
                  <p className="text-xs text-pink-200 mb-1 font-semibold">🌅 Sunrise</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">{formatTimeDetailed(weather.daily.sunrise[0])}</p>
                </div>
                <div className="bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-fuchsia-500/30 p-4 rounded-xl border border-violet-400/40 shadow-lg hover:shadow-violet-500/50 transition-all hover:scale-105">
                  <p className="text-xs text-violet-200 mb-1 font-semibold">🌇 Sunset</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">{formatTimeDetailed(weather.daily.sunset[0])}</p>
                </div>
              </div>

              {/* Interactive Map Section */}
              <div className="mb-8">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-4 py-2 rounded-xl hover:from-purple-500/40 hover:to-pink-500/40 transition-all border border-purple-400/30 shadow-lg"
                >
                  <MapPin size={20} className="text-purple-300" />
                  <span>{showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}</span>
                </button>
                
                {showMap && coordinates && (
                  <div className="mt-4 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                    <iframe
                      width="100%"
                      height="400"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lon-0.1},${coordinates.lat-0.1},${coordinates.lon+0.1},${coordinates.lat+0.1}&layer=mapnik&marker=${coordinates.lat},${coordinates.lon}`}
                      style={{ border: 0 }}
                    ></iframe>
                    <div className="bg-slate-800/60 backdrop-blur-sm p-3 text-center">
                      <a 
                        href={`https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lon}#map=12/${coordinates.lat}/${coordinates.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-300 hover:text-purple-200 transition-colors text-sm font-medium"
                      >
                        View Larger Map →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Prayer Times Section */}
              {prayerTimes && (
                <div className="mb-8 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 backdrop-blur-sm p-6 rounded-2xl border border-emerald-400/30 shadow-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">🕌</span> Prayer Times (Islamic)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-emerald-400/20 hover:border-emerald-400/50 transition-all">
                      <p className="text-emerald-300 text-sm mb-1">Fajr</p>
                      <p className="text-2xl font-bold">{formatPrayerTime(prayerTimes.Fajr)}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-yellow-400/20 hover:border-yellow-400/50 transition-all">
                      <p className="text-yellow-300 text-sm mb-1">Sunrise</p>
                      <p className="text-2xl font-bold">{formatPrayerTime(prayerTimes.Sunrise)}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-orange-400/20 hover:border-orange-400/50 transition-all">
                      <p className="text-orange-300 text-sm mb-1">Dhuhr</p>
                      <p className="text-2xl font-bold">{formatPrayerTime(prayerTimes.Dhuhr)}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-amber-400/20 hover:border-amber-400/50 transition-all">
                      <p className="text-amber-300 text-sm mb-1">Asr</p>
                      <p className="text-2xl font-bold">{formatPrayerTime(prayerTimes.Asr)}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-pink-400/20 hover:border-pink-400/50 transition-all">
                      <p className="text-pink-300 text-sm mb-1">Maghrib</p>
                      <p className="text-2xl font-bold">{formatPrayerTime(prayerTimes.Maghrib)}</p>
                    </div>
                    <div className="bg-slate-800/40 p-4 rounded-xl text-center border border-indigo-400/20 hover:border-indigo-400/50 transition-all md:col-span-3 lg:col-span-5">
                      <p className="text-indigo-300 text-sm mb-1">Isha</p>
                      <p className="text-2xl font-bold">{formatPrayerTime(prayerTimes.Isha)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-4 text-center">Times are shown in local timezone</p>
                </div>
              )}

              {/* Hourly Forecast Toggle */}
              <div className="mb-8">
                <button
                  onClick={() => setShowHourly(!showHourly)}
                  className="flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-blue-500/30 to-cyan-500/30 px-4 py-2 rounded-xl hover:from-blue-500/40 hover:to-cyan-500/40 transition-all border border-blue-400/30 shadow-lg"
                >
                  <span>{showHourly ? '▼' : '▶'}</span> 24-Hour Forecast
                </button>
                
                {showHourly && (
                  <div className="mt-4 overflow-x-auto pb-4">
                    <div className="flex gap-3 min-w-max">
                      {weather.hourly.time.slice(0, 24).map((time, index) => {
                        const temp = weather.hourly.temperature_2m[index];
                        const code = weather.hourly.weather_code[index];
                        const precip = weather.hourly.precipitation_probability[index];
                        const desc = getWeatherDescription(code);

                        return (
                          <div 
                            key={time} 
                            className="bg-slate-800/40 hover:bg-slate-700/60 p-3 rounded-lg flex flex-col items-center text-center transition-all min-w-[80px] border border-slate-700/50 hover:border-blue-400/50"
                          >
                            <p className="text-xs font-medium text-blue-200 mb-2">
                              {index === 0 ? 'Now' : formatTime(time)}
                            </p>
                            <span className="text-2xl mb-2" title={desc.text}>{desc.icon}</span>
                            <p className="font-bold text-lg">{convertTemp(temp)}°</p>
                            {precip > 0 && (
                              <p className="text-xs text-blue-300 mt-1">💧 {precip}%</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 7-Day Forecast */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-400" /> 7-Day Forecast
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {weather.daily.time.map((day, index) => {
                    // Skip today in forecast list if preferred, or keep it. Here we keep it.
                    const code = weather.daily.weather_code[index];
                    const maxTemp = Math.round(weather.daily.temperature_2m_max[index]);
                    const minTemp = Math.round(weather.daily.temperature_2m_min[index]);
                    const desc = getWeatherDescription(code);

                    return (
                      <div 
                        key={day} 
                        className="bg-slate-800/30 hover:bg-slate-700/50 p-3 rounded-lg flex flex-col items-center text-center transition-all border border-transparent hover:border-blue-400/30 hover:scale-105"
                      >
                        <p className="text-sm font-medium text-blue-200 mb-2">
                          {index === 0 ? 'Today' : formatDate(day).split(',')[0]}
                        </p>
                        <span className="text-3xl mb-2" title={desc.text}>{desc.icon}</span>
                        <div className="w-full flex justify-between px-2 text-sm">
                          <span className="font-bold">{convertTemp(maxTemp)}°</span>
                          <span className="text-gray-400">{convertTemp(minTemp)}°</span>
                        </div>
                        <p className="text-xs text-blue-300 mt-1">UV: {Math.round(weather.daily.uv_index_max[index])}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
