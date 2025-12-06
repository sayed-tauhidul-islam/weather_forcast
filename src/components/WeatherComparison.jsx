import React from 'react';
import { GitCompare } from 'lucide-react';

export default function WeatherComparison({ locations, convertTemp, theme }) {
  if (!locations || locations.length === 0) return null;

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <GitCompare className="w-6 h-6" />
        Compare Locations
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location, index) => (
          <div key={index} className={`${theme.card} rounded-2xl p-6 border border-white/20`}>
            <div className={`text-lg font-bold ${theme.text} mb-2`}>{location.name}</div>
            <div className="text-4xl mb-2">{location.icon}</div>
            <div className={`text-3xl font-bold ${theme.text} mb-1`}>
              {convertTemp(location.temp)}
            </div>
            <div className={`${theme.text} opacity-70 text-sm`}>{location.condition}</div>
            <div className={`mt-3 pt-3 border-t border-white/20 ${theme.text} opacity-70 text-xs`}>
              💨 {location.wind} km/h • 💧 {location.humidity}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
