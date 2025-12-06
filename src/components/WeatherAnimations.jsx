import React from 'react';
import { Sparkles } from 'lucide-react';

const WeatherAnimations = ({ weather, theme }) => {
  const weatherCode = weather?.current?.weather_code || 0;
  
  const getAnimation = (code) => {
    if (code >= 61 && code <= 67) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 82) return '⛈️'; // Thunderstorm
    if (code >= 2 && code <= 3) return '☁️'; // Cloudy
    return '☀️'; // Clear
  };

  const emoji = getAnimation(weatherCode);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Live Weather Animation</h3>
      </div>
      <div className="relative h-48 flex items-center justify-center overflow-hidden">
        {/* Animated weather emojis */}
        <div className="absolute animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="text-8xl">{emoji}</div>
        </div>
        <div className="absolute animate-pulse" style={{ animationDuration: '2s', left: '20%', top: '20%' }}>
          <div className="text-4xl">{emoji}</div>
        </div>
        <div className="absolute animate-pulse" style={{ animationDuration: '2.5s', right: '20%', top: '30%' }}>
          <div className="text-3xl">{emoji}</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAnimations;
