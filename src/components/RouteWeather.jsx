import React, { useState } from 'react';
import { Navigation, MapPin } from 'lucide-react';

const RouteWeather = ({ theme }) => {
  const [route, setRoute] = useState([
    { location: 'Start', weather: '☀️', temp: 22, time: '09:00' },
    { location: 'Midpoint', weather: '⛅', temp: 21, time: '12:00' },
    { location: 'Destination', weather: '☁️', temp: 19, time: '15:00' }
  ]);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Navigation className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Weather Along Route</h3>
      </div>
      
      <div className="space-y-3">
        {route.map((point, index) => (
          <div key={index} className="relative">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="flex flex-col items-center">
                <MapPin className={theme.text} size={20} />
                {index < route.length - 1 && (
                  <div className="w-0.5 h-8 bg-white/20 mt-2"></div>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${theme.text}`}>{point.location}</div>
                <div className={`text-sm ${theme.text} opacity-70`}>{point.time}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{point.weather}</span>
                <span className={`text-xl font-semibold ${theme.text}`}>{point.temp}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className={`w-full mt-4 py-2 ${theme.card} border border-white/20 ${theme.text} rounded-xl hover:scale-105 transition-transform`}>
        Plan New Route
      </button>
    </div>
  );
};

export default RouteWeather;
