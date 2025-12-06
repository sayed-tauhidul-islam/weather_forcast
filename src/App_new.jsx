import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, Sun, Cloud, CloudRain, CloudSnow, Sunrise, Sunset, Eye, Gauge } from 'lucide-react';
import { WeatherParticles, LoadingSpinner } from './components/WeatherEffects';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [timeFormat, setTimeFormat] = useState('12');

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
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather');
      
      const data = await response.json();
      setWeather(data);
      setCoordinates({ lat, lon, name: cityName });
      setCity(cityName);
      setShowSuggestions(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCitySuggestions = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchTerm}&count=5&language=en&format=json`
      );
      const data = await response.json();
      
      if (data.results) {
        setSearchSuggestions(data.results);
      } else {
        setSearchSuggestions([]);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
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

  const theme = getThemeStyles();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-1000 relative overflow-hidden`}>
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
                Weather Dashboard
              </h1>
              <p className={`${theme.text} opacity-80`}>Real-time weather updates</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <input
                type="text"
                name="citySearch"
                placeholder="Search location..."
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

            {/* Unit Toggle */}
            <div className="flex gap-2">
              {['celsius', 'fahrenheit'].map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    unit === u 
                      ? `bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-lg` 
                      : `${theme.card} ${theme.text} hover:scale-105`
                  }`}
                >
                  {u === 'celsius' ? '°C' : '°F'}
                </button>
              ))}
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
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className={`w-6 h-6 ${theme.text}`} />
                    <h2 className={`text-3xl font-bold ${theme.text}`}>{coordinates?.name}</h2>
                  </div>
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

            {/* Hourly Forecast */}
            <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl`}>
              <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
                <Thermometer className="w-6 h-6" />
                24-Hour Forecast
              </h3>
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-4">
                  {weather.hourly.time.slice(0, 24).map((time, index) => (
                    <div key={index} className={`${theme.card} rounded-2xl p-4 min-w-[120px] text-center border border-white/20 hover:scale-105 transition-all`}>
                      <div className={`text-sm ${theme.text} opacity-70 mb-2`}>
                        {formatTime(time)}
                      </div>
                      <div className="text-4xl mb-2">{getWeatherDescription(weather.hourly.weather_code[index]).icon}</div>
                      <div className={`text-xl font-bold ${theme.text}`}>
                        {convertTemp(weather.hourly.temperature_2m[index])}
                      </div>
                      <div className={`text-sm ${theme.text} opacity-70 mt-2`}>
                        {weather.hourly.precipitation_probability[index]}% 💧
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl`}>
              <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
                <Calendar className="w-6 h-6" />
                7-Day Forecast
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {weather.daily.time.map((date, index) => (
                  <div key={index} className={`${theme.card} rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all`}>
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
                  </div>
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
          </div>
        )}
      </div>
    </div>
  );
}
