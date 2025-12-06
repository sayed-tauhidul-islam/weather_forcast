import React from 'react';
import { MapPin } from 'lucide-react';

const NearbyCities = ({ coordinates, theme }) => {
  // Mock nearby cities - in production, calculate from coordinates
  const cities = [
    { name: 'Springfield', distance: '15 km', temp: 22, weather: '☀️' },
    { name: 'Riverside', distance: '28 km', temp: 21, weather: '⛅' },
    { name: 'Lakeside', distance: '42 km', temp: 19, weather: '☁️' },
    { name: 'Mountain View', distance: '56 km', temp: 18, weather: '🌧️' }
  ];

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Nearby Cities</h3>
      </div>
      <div className="space-y-3">
        {cities.map((city, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
            <div>
              <div className={`font-semibold ${theme.text}`}>{city.name}</div>
              <div className={`text-sm ${theme.text} opacity-70`}>{city.distance}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{city.weather}</span>
              <span className={`text-xl font-semibold ${theme.text}`}>{city.temp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyCities;
