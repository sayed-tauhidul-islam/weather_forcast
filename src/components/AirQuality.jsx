import React from 'react';
import { Wind, AlertCircle } from 'lucide-react';

export default function AirQuality({ aqi, theme }) {
  const getAQILevel = (value) => {
    if (value <= 50) return { level: 'Good', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (value <= 100) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (value <= 150) return { level: 'Unhealthy for Sensitive', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (value <= 200) return { level: 'Unhealthy', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (value <= 300) return { level: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-500/20' };
    return { level: 'Hazardous', color: 'text-red-600', bg: 'bg-red-600/20' };
  };

  const aqiInfo = getAQILevel(aqi);

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <Wind className="w-6 h-6" />
        Air Quality Index
      </h3>
      <div className="text-center">
        <div className={`text-6xl font-bold mb-4 ${aqiInfo.color}`}>{aqi}</div>
        <div className={`inline-block px-6 py-2 rounded-full ${aqiInfo.bg} ${aqiInfo.color} text-lg font-semibold mb-4`}>
          {aqiInfo.level}
        </div>
        <div className={`${theme.text} opacity-70 text-sm`}>
          {aqi <= 50 ? 'Air quality is satisfactory' : 
           aqi <= 100 ? 'Acceptable air quality' :
           aqi <= 150 ? 'Sensitive groups should limit outdoor activity' :
           aqi <= 200 ? 'Everyone should reduce outdoor activity' :
           aqi <= 300 ? 'Serious health effects for everyone' :
           'Emergency conditions'}
        </div>
      </div>
    </div>
  );
}
