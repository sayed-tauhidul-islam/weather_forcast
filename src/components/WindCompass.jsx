import React from 'react';
import { Navigation } from 'lucide-react';

const WindCompass = ({ weather, theme }) => {
  const windDirection = weather?.current?.wind_direction_10m || 0;
  const windSpeed = weather?.current?.wind_speed_10m || 0;

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Navigation className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Wind Direction</h3>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-4">
          {/* Compass circle */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          
          {/* Cardinal directions */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold ${theme.text}`}>N</div>
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-lg font-bold ${theme.text}`}>S</div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 text-lg font-bold ${theme.text}`}>W</div>
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-lg font-bold ${theme.text}`}>E</div>
          
          {/* Wind arrow */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${windDirection}deg)` }}
          >
            <div className="text-red-500 text-5xl">↑</div>
          </div>
        </div>
        
        <div className={`text-3xl font-bold ${theme.text} mb-1`}>
          {getWindDirection(windDirection)}
        </div>
        <div className={`text-lg ${theme.text} opacity-70`}>
          {windDirection}° • {windSpeed.toFixed(1)} km/h
        </div>
      </div>
    </div>
  );
};

export default WindCompass;
